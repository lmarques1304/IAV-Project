AFRAME.registerComponent("simple-grab", {
  init: function () {
    this.grabbedEl = null;
    this.hoveredEl = null;

    // Bind event handlers
    this.onHit = this.onHit.bind(this);
    this.onHitEnd = this.onHitEnd.bind(this);
    this.onGrab = this.onGrab.bind(this);
    this.onRelease = this.onRelease.bind(this);

    // 1. Listen for collisions
    this.el.addEventListener("hit", this.onHit);
    this.el.addEventListener("hitstart", this.onHit);
    this.el.addEventListener("hitend", this.onHitEnd);

    // 2. Listen for controller buttons
    this.el.addEventListener("triggerdown", this.onGrab);
    this.el.addEventListener("gripdown", this.onGrab);

    // 3. Listen for release
    this.el.addEventListener("triggerup", this.onRelease);
    this.el.addEventListener("gripup", this.onRelease);

    // 4. Desktop/Mouse Support
    this.el.addEventListener("mousedown", this.onGrab);
    this.el.addEventListener("mouseup", this.onRelease);
  },

  onHit: function (evt) {
    if (this.grabbedEl) return;

    const hitEl = evt.detail.intersectedEls
      ? evt.detail.intersectedEls[0]
      : evt.detail.el;

    if (!hitEl || !hitEl.classList.contains("grabbable")) return;

    if (this.hoveredEl !== hitEl) {
      this.hoveredEl = hitEl;
      this.savedColor =
        this.hoveredEl.getAttribute("material")?.color || "white";
      this.hoveredEl.setAttribute("material", "color", "#FF0000");
    }
  },

  onHitEnd: function () {
    if (this.hoveredEl && !this.grabbedEl) {
      this.hoveredEl.setAttribute("material", "color", this.savedColor);
      this.hoveredEl = null;
    }
  },

  onGrab: function () {
    let target = this.hoveredEl;

    if (!target) {
      const collider = this.el.components["sphere-collider"];
      if (collider && collider.intersectedEls.length > 0) {
        target = collider.intersectedEls.find((el) =>
          el.classList.contains("grabbable")
        );
      }
    }

    if (!target) return;

    this.grabbedEl = target;

    if (this.savedColor) {
      this.grabbedEl.setAttribute("material", "color", this.savedColor);
    }

    // --- FIX STARTS HERE ---
    // Remove BOTH physics types to prevent "Ghost Object" bugs.
    // If we only remove dynamic-body, the static-body remains and anchors the object in place.
    this.grabbedEl.removeAttribute("dynamic-body");
    this.grabbedEl.removeAttribute("static-body");
    // --- FIX ENDS HERE ---

    this.el.object3D.attach(this.grabbedEl.object3D);
  },

  onRelease: function () {
    if (!this.grabbedEl) return;

    this.el.sceneEl.object3D.attach(this.grabbedEl.object3D);

    // Re-enable physics as dynamic
    this.grabbedEl.setAttribute("dynamic-body", "mass: 1; shape: auto");

    this.grabbedEl = null;
    this.hoveredEl = null;
  },
});