AFRAME.registerComponent("recycling-bin", {
  schema: {
    type: { type: "string" },
  },

  init: function () {
    this.el.addEventListener("body-entered", (evt) => {
      const recyclable = evt.detail.body.el;
      if (recyclable.dataset.type === this.data.type) {
        recyclable.parentNode.removeChild(recyclable);
      }
    });
  },
});
