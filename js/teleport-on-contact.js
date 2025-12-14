AFRAME.registerComponent('teleport-on-contact', {
  schema: {
    targetUrl: {type: 'string'}
  },

  init: function () {
    this.el.addEventListener('hitstart', () => {
      window.location.href = this.data.targetUrl;
    });
  }
});
