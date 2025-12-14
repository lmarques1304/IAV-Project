AFRAME.registerComponent("teleport-on-contact", {
  schema: {
    targetUrl: { type: "string" },
    targetElement: { type: "selector" },
  },

  init: function () {
    this.onBodyEntered = this.onBodyEntered.bind(this);
    this.el.addEventListener("body-entered", this.onBodyEntered);
  },

  onBodyEntered: function (evt) {
    if (evt.detail.body.el === this.data.targetElement) {
      window.location.href = this.data.targetUrl;
    }
  },

  remove: function () {
    this.el.removeEventListener("body-entered", this.onBodyEntered);
  },
});
