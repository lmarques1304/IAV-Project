AFRAME.registerComponent("delete-on-contact", {
  init: function () {
    this.el.addEventListener("collide", (e) => {
      const hitEl = e.detail.body ? e.detail.body.el : null;

      if (hitEl && hitEl.classList.contains("grabbable")) {
        setTimeout(() => {
          if (hitEl.parentNode) {
            hitEl.parentNode.removeChild(hitEl);
            this.el.sceneEl.emit("item-deleted");
          }
        }, 0);
      }
    });
  },
});
