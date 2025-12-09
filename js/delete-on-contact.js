AFRAME.registerComponent("delete-on-contact", {
  schema: {
    target: { type: "string", default: ".custom-grabbable" },
  },

  init: function () {
    this.el.addEventListener("contactbegin", this.handleContact.bind(this));
  },

  handleContact: function (event) {
    const targetEl = event.detail.body.el;
    if (targetEl.matches(this.data.target)) {
      targetEl.parentNode.removeChild(targetEl);
    }
  },
});
