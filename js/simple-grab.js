AFRAME.registerComponent("simple-grab", {
  init: function () {
    this.grabbedEl = null;
    this.hoveredEl = null;
    this.originalMaterials = new Map();

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

  tick: function() {
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
          this.clearHighlight(this.hoveredEl);
        }
        
        // Set new hover
        this.hoveredEl = target;
        if (this.hoveredEl) {
          this.highlightObject(this.hoveredEl);
        }
      }
    } else if (this.hoveredEl) {
      // Clear hover when nothing nearby
      this.clearHighlight(this.hoveredEl);
      this.hoveredEl = null;
    }
  },

  highlightObject: function(el) {
    // For GLTF models, we need to traverse the mesh and change materials
    el.object3D.traverse((node) => {
      if (node.isMesh && node.material) {
        // Store original color
        if (!this.originalMaterials.has(node.uuid)) {
          this.originalMaterials.set(node.uuid, node.material.emissive.getHex());
        }
        // Set red emissive glow
        node.material.emissive.setHex(0xff0000);
        node.material.emissiveIntensity = 0.5;
      }
    });
  },

  clearHighlight: function(el) {
    // Restore original materials
    el.object3D.traverse((node) => {
      if (node.isMesh && node.material) {
        const originalColor = this.originalMaterials.get(node.uuid);
        if (originalColor !== undefined) {
          node.material.emissive.setHex(originalColor);
          node.material.emissiveIntensity = 0;
        }
      }
    });
  },

  onGrab: function () {
    if (!this.hoveredEl || this.grabbedEl) return;

    this.grabbedEl = this.hoveredEl;

    // Clear highlight
    this.clearHighlight(t