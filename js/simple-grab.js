/* File: js/simple-grab.js */
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

    // Desktop/Mouse Support
    this.el.addEventListener("mousedown", this.onGrab);
    this.el.addEventListener("mouseup", this.onRelease);
  },

  tick: function () {
    // 1. Don't look for new objects if already holding one
    if (this.grabbedEl) return;

    // 2. Get the collider component
    const collider = this.el.components["sphere-collider"];
    if (!collider) return;

    // 3. Get list of objects the collider currently hits
    // (A-Frame Extras uses 'els')
    const intersectedEls = collider.els || [];

    // 4. Find the closest object that is ALSO within a strict distance
    let closestEl = null;
    let closestDistance = Infinity;
    const MAX_GRAB_DISTANCE = 1; // Maximum reach in meters (prevents "Force Grab")

    const handPos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(handPos);

    intersectedEls.forEach((el) => {
      // Must be a valid element with the correct class
      if (el && el.classList && el.classList.contains("grabbable")) {
        // Calculate real distance from hand to object center
        const objectPos = new THREE.Vector3();
        el.object3D.getWorldPosition(objectPos);
        const distance = handPos.distanceTo(objectPos);

        // STHRICT CHECK: Ignore objects strictly outside our max reach
        // This ignores huge bounding boxes triggering grabs from far away
        if (distance < MAX_GRAB_DISTANCE && distance < closestDistance) {
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
        this.setEmissive(this.hoveredEl, 0xff0000); // Red
      }
    }
  },

  setEmissive: function (el, color) {
    if (!el) return;
    el.object3D.traverse((node) => {
      // Only effect meshes (visible parts), not invisible helpers
      if (node.isMesh && node.material) {
        // Cloning material allows us to highlight ONE item without turning ALL items red
        // (Performance note: For a simple game, this is fine. For massive games, use a shader)
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
    if (!this.hoveredEl) return; // Only grab if we are hovering a valid, close object

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

    // Detach from hand, re-attach to scene
    this.el.sceneEl.object3D.attach(this.grabbedEl.object3D);

    // Re-enable physics
    this.grabbedEl.setAttribute("dynamic-body", {
      mass: 0.2,
      shape: "auto",
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
