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
    if (!collider) return;

    // Find the closest grabbable object
    let closestEl = null;
    let closestDistance = Infinity;

    const handPos = this.el.object3D.position;

    collider.intersectedEls.forEach((el) => {
      if (el.classList.contains("grabbable")) {
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
        this.setEmissive(this.hoveredEl, 0xff0000);
      }
    }
  },

  setEmissive: function (el, color) {
    el.object3D.traverse((node) => {
      if (node.isMesh && node.material) {
        node.material.emissive.setHex(color);
        node.material.needsUpdate = true;
      }
    });
  },

  onGrab: function () {
    // If already holding something, ignore
    if (this.grabbedEl) return;

    // Check if we have something to grab
    const collider = this.el.components["sphere-collider"];
    if (!collider || collider.intersectedEls.length === 0) return;

    // Find a grabbable object
    let target = null;
    for (let i = 0; i < collider.intersectedEls.length; i++) {
      if (collider.intersectedEls[i].classList.contains("grabbable")) {
        target = collider.intersectedEls[i];
        break;
      }
    }

    if (!target) return;

    // Grab the object
    this.grabbedEl = target;

    // Clear highlight
    this.setEmissive(this.grabbedEl, 0x000000);

    // Remove physics body
    if (this.grabbedEl.body) {
      this.grabbedEl.removeAttribute("dynamic-body");
      this.grabbedEl.removeAttribute("static-body");
    }

    // Attach to hand (parent the object to the controller)
    this.el.object3D.attach(this.grabbedEl.object3D);
  },

  onRelease: function () {
    if (!this.grabbedEl) return;

    // Get current world position and rotation before detaching
    const worldPos = new THREE.Vector3();
    const worldQuat = new THREE.Quaternion();
    this.grabbedEl.object3D.getWorldPosition(worldPos);
    this.grabbedEl.object3D.getWorldQuaternion(worldQuat);

    // Detach from hand and re-parent to scene
    this.el.sceneEl.object3D.attach(this.grabbedEl.object3D);

    // Set the world position/rotation (in case attach changes it)
    this.grabbedEl.object3D.position.copy(worldPos);
    this.grabbedEl.object3D.quaternion.copy(worldQuat);

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
    // Cleanup
    if (this.grabbedEl) {
      this.onRelease();
    }
  },
});
