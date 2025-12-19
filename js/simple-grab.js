AFRAME.registerComponent("simple-grab", {
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

    // Desktop/Mouse Support (for testing without VR)
    this.el.addEventListener("mousedown", this.onGrab);
    this.el.addEventListener("mouseup", this.onRelease);
  },

  tick: function () {
    // Don't check for new objects while holding something
    if (this.grabbedEl) return;

    // Check collision with sphere-collider
    const collider = this.el.components["sphere-collider"];
    
    // Safety check: if sphere-collider isn't ready or loaded, stop here
    if (!collider) return; 

    // A-Frame Extras uses 'els' for the array of intersected elements
    const intersectedEls = collider.els || []; 

    if (intersectedEls.length === 0) {
      if (this.hoveredEl) {
        this.setEmissive(this.hoveredEl, 0x000000);
        this.hoveredEl = null;
      }
      return;
    }

    // Find the closest grabbable object
    let closestEl = null;
    let closestDistance = Infinity;
    const handPos = this.el.object3D.position;

    intersectedEls.forEach((el) => {
      // Ensure the element is valid and has the class
      if (el && el.classList && el.classList.contains("grabbable")) {
        const distance = handPos.distanceTo(el.object3D.position);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEl = el;
        }
      }
    });

    // Update hover state
    if (closestEl !== this.hoveredEl) {
      // Clear old hover
      if (this.hoveredEl) {
        this.setEmissive(this.hoveredEl, 0x000000);
      }

      // Set new hover
      this.hoveredEl = closestEl;
      if (this.hoveredEl) {
        this.setEmissive(this.hoveredEl, 0xff0000); // Highlight Red
      }
    }
  },

  setEmissive: function (el, color) {
    if (!el) return;
    el.object3D.traverse((node) => {
      if (node.isMesh && node.material) {
        // Clone material to avoid affecting all instances of the same model
        // (Optional optimization: cache materials, but cloning is safer for highlights)
        // node.material = node.material.clone(); 
        node.material.emissive.setHex(color);
        node.material.needsUpdate = true;
      }
    });
  },

  onGrab: function () {
    if (this.grabbedEl) return;
    if (!this.hoveredEl) return; // We rely on tick to find the best candidate

    // Grab the object
    this.grabbedEl = this.hoveredEl;

    // Clear highlight
    this.setEmissive(this.grabbedEl, 0x000000);

    // Remove physics body so we can move it manually
    if (this.grabbedEl.getAttribute("dynamic-body")) {
        this.grabbedEl.removeAttribute("dynamic-body");
    }
    // Also clear static body if it exists, just in case
    if (this.grabbedEl.getAttribute("static-body")) {
        this.grabbedEl.removeAttribute("static-body");
    }

    // Attach to hand (parent the object to the controller)
    this.el.object3D.attach(this.grabbedEl.object3D);
  },

  onRelease: function () {
    if (!this.grabbedEl) return;

    // Detach from hand and re-parent to scene
    this.el.sceneEl.object3D.attach(this.grabbedEl.object3D);

    // Re-enable physics
    this.grabbedEl.setAttribute("dynamic-body", {
      mass: 0.2,
      shape: "auto",
      linearDamping: 0.1,
      angularDamping: 0.1,
    });

    // Clear references
    this.grabbedEl = null;
    this.hoveredEl = null;
  },

  remove: function () {
    if (this.grabbedEl) {
      this.onRelease();
    }
  },
});