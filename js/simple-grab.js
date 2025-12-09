AFRAME.registerComponent('simple-grab', {
  init: function () {
    this.grabbedEl = null;
    this.hoveredEl = null;

    // Bind event handlers
    this.onHit = this.onHit.bind(this);
    this.onHitEnd = this.onHitEnd.bind(this);
    this.onGrab = this.onGrab.bind(this);
    this.onRelease = this.onRelease.bind(this);

    // 1. Listen for collisions (Hand touching object)
    // Note: sphere-collider uses 'hit'/'hitend', aabb-collider uses 'hitstart'/'hitend'
    // We listen to both to be safe.
    this.el.addEventListener('hit', this.onHit);
    this.el.addEventListener('hitstart', this.onHit);
    this.el.addEventListener('hitend', this.onHitEnd);

    // 2. Listen for controller buttons (Trigger or Grip)
    this.el.addEventListener('triggerdown', this.onGrab);
    this.el.addEventListener('gripdown', this.onGrab);

    // 3. Listen for release
    this.el.addEventListener('triggerup', this.onRelease);
    this.el.addEventListener('gripup', this.onRelease);

    // 4. Desktop/Mouse Support (Click to grab)
    this.el.addEventListener('mousedown', this.onGrab);
    this.el.addEventListener('mouseup', this.onRelease);
  },

  onHit: function (evt) {
    // If we are already holding something, ignore new hits
    if (this.grabbedEl) return;

    // Get the first intersected element
    const hitEl = evt.detail.intersectedEls ? evt.detail.intersectedEls[0] : evt.detail.el;
    
    if (!hitEl || !hitEl.classList.contains('grabbable')) return;

    // Highlight the object to show it's ready to be grabbed
    if (this.hoveredEl !== hitEl) {
      this.hoveredEl = hitEl;
      this.savedColor = this.hoveredEl.getAttribute('material')?.color || 'white';
      this.hoveredEl.setAttribute('material', 'color', '#FF0000'); // Turn RED on hover
    }
  },

  onHitEnd: function () {
    // Restore color when hand leaves
    if (this.hoveredEl && !this.grabbedEl) {
      this.hoveredEl.setAttribute('material', 'color', this.savedColor);
      this.hoveredEl = null;
    }
  },

  onGrab: function () {
    // 1. Decide what to grab: either the hovered object OR ask the collider directly
    let target = this.hoveredEl;

    if (!target) {
      // Fallback: Check collider directly if event was missed
      const collider = this.el.components['sphere-collider'];
      if (collider && collider.intersectedEls.length > 0) {
        target = collider.intersectedEls.find(el => el.classList.contains('grabbable'));
      }
    }

    if (!target) return; // Nothing to grab

    this.grabbedEl = target;
    
    // Restore original color before grabbing
    if (this.savedColor) {
        this.grabbedEl.setAttribute('material', 'color', this.savedColor);
    }

    // 2. DISABLE PHYSICS so it doesn't fight the hand
    this.grabbedEl.removeAttribute('dynamic-body');

    // 3. Attach to hand
    this.el.object3D.attach(this.grabbedEl.object3D);
  },

  onRelease: function () {
    if (!this.grabbedEl) return;

    // 1. Detach from hand and re-attach to scene
    this.el.sceneEl.object3D.attach(this.grabbedEl.object3D);

    // 2. Re-enable physics
    this.grabbedEl.setAttribute('dynamic-body', 'mass: 0.2; shape: auto');

    // 3. Reset state
    this.grabbedEl = null;
    this.hoveredEl = null;
  }
});