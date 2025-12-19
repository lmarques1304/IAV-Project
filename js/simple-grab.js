AFRAME.registerComponent("simple-grab", {
  init: function () {
    this.grabbedEl = null;
    this.hoveredEl = null;

    this.onGrab = this.onGrab.bind(this);
    this.onRelease = this.onRelease.bind(this);

    // Controller events
    this.el.addEventListener("triggerdown", this.onGrab);
    this.el.addEventListener("gripdown", this.onGrab);
    this.el.addEventListener("triggerup", this.onRelease);
    this.el.addEventListener("gripup", this.onRelease);

    // Mouse events (for testing)
    this.el.addEventListener("mousedown", this.onGrab);
    this.el.addEventListener("mouseup", this.onRelease);
  },

  tick: function () {
    // 1. If holding something, don't search for new things
    if (this.grabbedEl) return;

    const collider = this.el.components["sphere-collider"];
    if (!collider) return;

    // 2. Compatibility: Check both 'els' (new A-Frame Extras) and 'intersectedEls' (old)
    const intersectedEls = collider.els || collider.intersectedEls || [];

    // 3. Find closest grabbable item
    let closestEl = null;
    let closestDistance = Infinity;
    const handPos = this.el.object3D.position;

    for (let i = 0; i < intersectedEls.length; i++) {
      const el = intersectedEls[i];
      // Check if element has the class 'grabbable'
      if (el && el.classList && el.classList.contains("grabbable")) {
        // We rely on sphere-collider to tell us if we are touching it.
        // We just calculate distance to find the *closest* one if touching multiple.
        const distance = handPos.distanceTo(el.object3D.position);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEl = el;
        }
      }
    }

    // 4. Handle Visual Highlight (Red Color)
    if (closestEl !== this.hoveredEl) {
      if (this.hoveredEl) this.setEmissive(this.hoveredEl, 0x000000); // Off
      this.hoveredEl = closestEl;
      if (this.hoveredEl) this.setEmissive(this.hoveredEl, 0xff0000); // On (Red)
    }
  },

  setEmissive: function (el, color) {
    if (!el) return;
    el.object3D.traverse((node) => {
      if (node.isMesh && node.material) {
        // Robust check: Handle array materials (rare but possible)
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        
        materials.forEach((mat) => {
          // Clone material prevents changing ALL instances of the object
          if (!mat.isCloned) {
             // Note: Cloning is safer, but if performance drops, remove the clone check
             // and just set emissive directly (but all bottles will turn red).
             // For now, we modify directly to be safe on performance.
             mat.emissive.setHex(color);
             mat.needsUpdate = true;
          } else {
             mat.emissive.setHex(color);
          }
        });
      }
    });
  },

  onGrab: function () {
    if (this.grabbedEl || !this.hoveredEl) return;

    // 1. Lock the object
    this.grabbedEl = this.hoveredEl;
    this.setEmissive(this.grabbedEl, 0x000000); // Turn off red

    // 2. WAKE UP: Remove physics so we can move it manually
    // Remove both dynamic AND static bodies to ensure it's free
    if (this.grabbedEl.getAttribute("dynamic-body")) {
      this.grabbedEl.removeAttribute("dynamic-body");
    }
    if (this.grabbedEl.getAttribute("static-body")) {
      this.grabbedEl.removeAttribute("static-body");
    }

    // 3. Attach to hand
    this.el.object3D.attach(this.grabbedEl.object3D);
  },

  onRelease: function () {
    if (!this.grabbedEl) return;

    // 1. Detach from hand, re-attach to scene
    this.el.sceneEl.object3D.attach(this.grabbedEl.object3D);

    // 2. APPLY PHYSICS: Make it dynamic (so it falls)
    this.grabbedEl.setAttribute("dynamic-body", {
      mass: 0.2,
      shape: "hull" // Hull fits the shape better than box
    });

    this.grabbedEl = null;
    this.hoveredEl = null;
  },

  remove: function () {
    if (this.grabbedEl) this.onRelease();
  },
});