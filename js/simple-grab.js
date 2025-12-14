/* File: js/simple-grab.js */
AFRAME.registerComponent("simple-grab", {
  init: function () {
    this.grabbedEl = null;
    this.hoveredEl = null;

    this.onHit = this.onHit.bind(this);
    this.onHitEnd = this.onHitEnd.bind(this);
    this.onGrab = this.onGrab.bind(this);
    this.onRelease = this.onRelease.bind(this);

    // Collision Event Listeners
    this.el.addEventListener("hit", this.onHit);
    this.el.addEventListener("hitend", this.onHitEnd);

    // VR Controller Listeners
    this.el.addEventListener("triggerdown", this.onGrab);
    this.el.addEventListener("gripdown", this.onGrab);
    this.el.addEventListener("triggerup", this.onRelease);
    this.el.addEventListener("gripup", this.onRelease);

    // Desktop/Mouse Listeners (Scene-wide for easier clicking)
    this.el.sceneEl.addEventListener("mousedown", this.onGrab);
    this.el.sceneEl.addEventListener("mouseup", this.onRelease);
  },

  onHit: function (evt) {
    if (this.grabbedEl) return;

    const hitEl = evt.detail.intersectedEls && evt.detail.intersectedEls.length > 0
      ? evt.detail.intersectedEls[0]
      : evt.detail.el;

    // Ensure we hit a grabbable object
    if (!hitEl || !hitEl.classList.contains("grabbable")) return;

    if (this.hoveredEl !== hitEl) {
      this.hoveredEl = hitEl;

      // VISUAL FEEDBACK: 
      // 1. Make the invisible hitbox semi-visible yellow
      this.hoveredEl.setAttribute("material", "visible", true);
      this.hoveredEl.setAttribute("material", "opacity", 0.5);
      this.hoveredEl.setAttribute("material", "color", "#FFFF00");
      this.hoveredEl.setAttribute("material", "transparent", true);
    }
  },

  onHitEnd: function () {
    if (this.hoveredEl && !this.grabbedEl) {
      // Hide the hitbox again when hand leaves
      this.hoveredEl.setAttribute("material", "visible", false);
      this.hoveredEl.setAttribute("material", "opacity", 1.0); // Reset defaults just in case
      this.hoveredEl = null;
    }
  },

  onGrab: function () {
    if (this.grabbedEl || !this.hoveredEl) return;

    this.grabbedEl = this.hoveredEl;

    // 1. Disable Physics so it doesn't fight the hand
    this.grabbedEl.removeAttribute("dynamic-body");
    this.grabbedEl.removeAttribute("static-body");

    // 2. Attach to Hand
    this.el.object3D.attach(this.grabbedEl.object3D);
    
    // 3. Keep visual feedback (Optional: maybe turn green to show 'held')
    this.grabbedEl.setAttribute("material", "color", "#00FF00");
  },

  onRelease: function () {
    if (!this.grabbedEl) return;

    // 1. Re-attach to Scene
    this.el.sceneEl.object3D.attach(this.grabbedEl.object3D);

    // 2. Re-enable Physics (Dynamic so it falls)
    this.grabbedEl.setAttribute("dynamic-body", "mass: 5; shape: box");

    // 3. Reset Visuals (Hide hitbox)
    this.grabbedEl.setAttribute("material", "visible", false);

    // 4. Clear State
    this.grabbedEl = null;
    this.hoveredEl = null;
  },
});