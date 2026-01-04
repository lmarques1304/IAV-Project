/* File: js/simple-grab.js */
AFRAME.registerComponent("simple-grab", {
  schema: {
    MAX_GRAB_DISTANCE: { type: "number", default: 1.5 }
  },

  init: function () {
    this.grabbedEl = null;
    this.hoveredEl = null;

    this.onGrab = this.onGrab.bind(this);
    this.onRelease = this.onRelease.bind(this);

    // Controller buttons
    this.el.addEventListener("triggerdown", this.onGrab);
    this.el.addEventListener("gripdown", this.onGrab);
    this.el.addEventListener("triggerup", this.onRelease);
    this.el.addEventListener("gripup", this.onRelease);

    // Desktop/Mouse Support
    this.el.addEventListener("mousedown", this.onGrab);
    this.el.addEventListener("mouseup", this.onRelease);
  },

  tick: function () {
    // 1. Don't look for new objects if already holding one
    if (this.grabbedEl) {
      // Safety check: If the object I'm holding was deleted (e.g. by a bin), release it immediately
      if (!this.grabbedEl.object3D || !this.grabbedEl.parentNode) {
        this.grabbedEl = null;
        this.hoveredEl = null;
      }
      return;
    }

    // 2. Get the collider component
    const collider = this.el.components["sphere-collider"];
    if (!collider) return;

    // 3. Get list of objects the collider currently hits
    const intersectedEls = collider.els || [];

    // 4. Find the closest object that is ALSO within a strict distance
    let closestEl = null;
    let closestDistance = Infinity;

    const handPos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(handPos);

    intersectedEls.forEach((el) => {
      // Must be a valid element with the correct class
      // FIX: Check if el.object3D exists to prevent crash on deleted items
      if (el && el.object3D && el.classList && el.classList.contains("grabbable")) {
        
        // Calculate real distance from hand to object center
        const objectPos = new THREE.Vector3();
        el.object3D.getWorldPosition(objectPos);
        const distance = handPos.distanceTo(objectPos);

        if (distance < this.data.MAX_GRAB_DISTANCE && distance < closestDistance) {
          closestDistance = distance;
          closestEl = el;
        }
      }
    });

    // 5. Update Visuals (Red Highlight)
    if (closestEl !== this.hoveredEl) {
      // Un-highlight previous
      if (this.hoveredEl) {
        this.setEmissive(this.hoveredEl, 0x000000);
      }

      // Highlight new
      this.hoveredEl = closestEl;
      if (this.hoveredEl) {
        this.setEmissive(this.hoveredEl, 0x0000ff); // Blue
      }
    }
  },

  setEmissive: function (el, color) {
    // FIX: Check if element and its 3D object exist
    if (!el || !el.object3D) return;

    el.object3D.traverse((node) => {
      // Only effect meshes (visible parts), not invisible helpers
      if (node.isMesh && node.material) {
        // Cloning material allows us to highlight ONE item without turning ALL items red
        if (!node.material.isCloned) {
          node.material = node.material.clone();
          node.material.isCloned = true;
        }
        node.material.emissive.setHex(color);
        node.material.needsUpdate = true;
      }
    });
  },

  onGrab: function () {
    if (this.grabbedEl) return;
    if (!this.hoveredEl) return; 

    // FIX: Verify object still exists before grabbing
    if (!this.hoveredEl.object3D) {
      this.hoveredEl = null;
      return;
    }

    this.grabbedEl = this.hoveredEl;

    // Clear highlight
    this.setEmissive(this.grabbedEl, 0x000000);

    // Disable physics while holding
    if (this.grabbedEl.getAttribute("dynamic-body")) {
      this.grabbedEl.removeAttribute("dynamic-body");
    }
    if (this.grabbedEl.getAttribute("static-body")) {
      this.grabbedEl.removeAttribute("static-body");
    }

    // Attach to hand
    this.el.object3D.attach(this.grabbedEl.object3D);
  },

  onRelease: function () {
    if (!this.grabbedEl) return;

    // FIX: If the object was deleted while we were holding it (e.g. dunked in bin)
    // we cannot re-attach it. Just clear variables.
    if (!this.grabbedEl.object3D) {
       this.grabbedEl = null;
       this.hoveredEl = null;
       return;
    }

    // Detach from hand, re-attach to scene
    this.el.sceneEl.object3D.attach(this.grabbedEl.object3D);

    // Re-enable physics
    this.grabbedEl.setAttribute("dynamic-body", {
      mass: 5, // Restoring mass to 5 to match your HTML settings
      shape: "box", // Restoring shape to box
    });

    this.grabbedEl = null;
    this.hoveredEl = null;
  },

  remove: function () {
    if (this.grabbedEl) {
      this.onRelease();
    }
  },
});