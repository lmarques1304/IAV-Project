AFRAME.registerComponent("teleport-on-contact", {
  schema: {
    targetUrl: { type: "string" },
    targetElement: { type: "string" }, // Changed to 'string' to avoid loading order issues
  },

  init: function () {
    this.onBodyEntered = this.onBodyEntered.bind(this);
    // Listen for collision events
    this.el.addEventListener("body-entered", this.onBodyEntered);
  },

  onBodyEntered: function (evt) {
    // The element we collided with
    const hitElement = evt.detail.body.el;
    
    // Check if the hit element matches the target selector (e.g., "#magicSphere")
    if (hitElement.matches(this.data.targetElement)) {
      console.log("Teleporting to:", this.data.targetUrl);
      window.location.href = this.data.targetUrl;
    }
  },

  remove: function () {
    this.el.removeEventListener("body-entered", this.onBodyEntered);
  },
});