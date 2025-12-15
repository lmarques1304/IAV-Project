/* File: js/simple-grab.js */
AFRAME.registerComponent("simple-grab", {
  init: function () {
    this.heldItem = null;
    this.hoveredItem = null;

    // Bind functions
    this.onHit = this.onHit.bind(this);
    this.onGrab = this.onGrab.bind(this);
    this.onRelease = this.onRelease.bind(this);

    // Event Listeners
    // Hit detection (finding the object)
    this.el.addEventListener("hit", this.onHit);
    
    // VR Controllers
    this.el.addEventListener("triggerdown", this.onGrab);
    this.el.addEventListener("gripdown", this.onGrab);
    this.el.addEventListener("triggerup", this.onRelease);
    this.el.addEventListener("gripup", this.onRelease);

    // Desktop Mouse (Scene listener ensures clicks register anywhere)
    this.el.sceneEl.addEventListener("mousedown", this.onGrab);
    this.el.sceneEl.addEventListener("mouseup", this.onRelease);
  },

  onHit: function (evt) {
    if (this.heldItem) return; // Don't look for new items if holding one

    const hitEl = evt.detail.intersectedEls[0] || evt.detail.el;
    
    // Only care about .grabbable objects
    if (hitEl && hitEl.classList.contains("grabbable")) {
      this.hoveredItem = hitEl;
    }
  },

  onGrab: function () {
    // If we have something hovered and we aren't holding anything
    if (this.hoveredItem && !this.heldItem) {
      this.heldItem = this.hoveredItem;

      // 1. Remove Physics (So it doesn't fight the hand)
      this.heldItem.removeAttribute("static-body");
      this.heldItem.removeAttribute("dynamic-body");

      // 2. Attach to Hand
      this.el.object3D.attach(this.heldItem.object3D);
    }
  },

  onRelease: function () {
    if (this.heldItem) {
      this.el.sceneEl.object3D.attach(this.heldItem.object3D);

      this.heldItem.setAttribute("dynamic-body", "mass: 0.2; shape: auto");

      this.heldItem = null;
      this.hoveredItem = null;
    }
  },
});