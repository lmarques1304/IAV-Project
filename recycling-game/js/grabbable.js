AFRAME.registerComponent("grabbable", {
  init: function () {
    this.el.addEventListener("gripdown", this.grab.bind(this));
    this.el.addEventListener("gripup", this.release.bind(this));
  },

  grab: function (evt) {
    evt.detail.hand.setAttribute("grabbing", "true");
    evt.detail.hand.object3D.attach(this.el.object3D);
  },

  release: function (evt) {
    const sceneEl = this.el.sceneEl;
    const worldPosition = new THREE.Vector3();
    this.el.object3D.getWorldPosition(worldPosition);

    evt.detail.hand.setAttribute("grabbing", "false");
    sceneEl.object3D.attach(this.el.object3D);
    this.el.object3D.position.copy(worldPosition);
  },
});
