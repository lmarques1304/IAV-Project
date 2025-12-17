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
    // Constantly check for nearby grabbable objects
    if (this.grabbedEl) return;

    const collider = this.el.components["sphere-collider"];
    if (collider && collider.intersectedEls.length > 0) {
      const target = collider.intersectedEls.find((el) =>
        el.classList.contains("grabbable")
      );

      if (target !== this.hoveredEl) {
        // Clear old hover
        if (this.hoveredEl) {
          this.hoveredEl.removeAttribute("material");
        }

        // Set new hover
        this.hoveredEl = target;
        if (this.hoveredEl) {
          this.hoveredEl.setAttribute("material", "color", "#FF0000");
        }
      }
    } else if (this.hoveredEl) {
      // Clear hover when nothing nearby
      this.hoveredEl.removeAttribute("material");
      this.hoveredEl = null;
    }
  },

  onGrab: function () {
    if (!this.hoveredEl || this.grabbedEl) return;

    this.grabbedEl = this.hoveredEl;

    // Remove physics
    this.grabbedEl.removeAttribute("dynamic-body");
    this.grabbedEl.removeAttribute("static-body");

    // Attach to hand
    this.el.object3D.attach(this.grabbedEl.object3D);

    // Reset color
    this.grabbedEl.removeAttribute("material");
  },

  onRelease: function () {
    if (!this.grabbedEl) return;

    // Detach from hand
    this.el.sceneEl.object3D.attach(this.grabbedEl.object3D);

    // Re-enable physics with same settings as creation
    this.grabbedEl.setAttribute("dynamic-body", "mass: 0.2; shape: auto");

    this.grabbedEl = null;
    this.hoveredEl = null;
  },
});
