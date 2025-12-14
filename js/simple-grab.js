/* File: simple-grab.js */
AFRAME.registerComponent("simple-grab", {
  init: function () {
    this.grabbedEl = null;
    this.hoveredEl = null;

    this.onHit = this.onHit.bind(this);
    this.onHitEnd = this.onHitEnd.bind(this);
    this.onGrab = this.onGrab.bind(this);
    this.onRelease = this.onRelease.bind(this);

    // 1. Collision Events
    this.el.addEventListener("hit", this.onHit);
    this.el.addEventListener("hitend", this.onHitEnd);

    // 2. VR Controller Buttons
    this.el.addEventListener("triggerdown", this.onGrab);
    this.el.addEventListener("gripdown", this.onGrab);
    this.el.addEventListener("triggerup", this.onRelease);
    this.el.addEventListener("gripup", this.onRelease);

    // 3. Desktop Testing (Click anywhere on screen to grab)
    // We listen to the SCENE, not the hand, so you don't need a cursor to click the hand.
    this.el.sceneEl.addEventListener("mousedown", this.onGrab);
    this.el.sceneEl.addEventListener("mouseup", this.onRelease);
  },

  onHit: function (evt) {
    if (this.grabbedEl) return;

    // Get the intersected object
    const hitEl = evt.detail.intersectedEls
      ? evt.detail.intersectedEls[0]
      : evt.detail.el;

    if (!hitEl || !hitEl.classList.contains("grabbable")) return;

    // Visual Feedback: Make the hitbox more visible
    if (this.hoveredEl !== hitEl) {
      this.hoveredEl = hitEl;
      // Save opacity to restore later
      this.savedOpacity = this.hoveredEl.getAttribute("material")?.opacity || 0.01;
      
      // Increase opacity to show "Selected" state
      this.hoveredEl.setAttribute("material", "opacity", 0.5); 
      this.hoveredEl.setAttribute("material", "color", "#FFD700"); // Gold highlight
    }
  },

  onHitEnd: function () {
    if (this.hoveredEl && !this.grabbedEl) {
      // Restore opacity
      this.hoveredEl.setAttribute("material", "opacity", this.savedOpacity);
      this.hoveredEl.setAttribute("material", "color", "red"); // Back to invisible-ish red
      this.hoveredEl = null;
    }
  },

  onGrab: function () {
    if (this.grabbedEl || !this.hoveredEl) return;

    this.grabbedEl = this.hoveredEl;

    // 1. Remove Physics (So we can move it manually)
    this.grabbedEl.removeAttribute("dynamic-body");
    this.grabbedEl.removeAttribute("static-body");

    // 2. Parent to Hand
    this.el.object3D.attach(this.grabbedEl.object3D);
  },

  onRelease: function () {
    if (!this.grabbedEl) return;

    // 1. Re-attach to Scene (Drop it)
    this.el.sceneEl.object3D.attach(this.grabbedEl.object3D);

    // 2. Restore Physics
    this.grabbedEl.setAttribute("dynamic-body", "mass: 2; shape: box");

    // 3. Reset
    this.grabbedEl = null;
    this.hoveredEl = null;
  },
});