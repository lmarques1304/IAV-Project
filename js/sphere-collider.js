AFRAME.registerComponent("sphere-collider", {
  schema: {
    objects: { default: "" },
    radius: { default: 0.1 },
  },

  init: function () {
    this.intersectedEls = [];
  },

  tick: function () {
    this.intersectedEls = [];

    // Get hand position
    const handPos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(handPos);

    // Find all grabbable objects
    const grabbables = document.querySelectorAll(this.data.objects);

    grabbables.forEach((el) => {
      const objPos = new THREE.Vector3();
      el.object3D.getWorldPosition(objPos);

      const distance = handPos.distanceTo(objPos);

      if (distance < this.data.radius) {
        this.intersectedEls.push(el);
      }
    });
  },
});
