AFRAME.registerComponent('delete-on-contact', {
  init: function () {
    this.el.addEventListener('contactbegin', (e) => {
      const hitEl = e.detail.otherEl;

      if (hitEl && hitEl.classList.contains('grabbable')) {
        setTimeout(() => {
          if (hitEl.parentNode) {
            hitEl.parentNode.removeChild(hitEl);
            this.el.sceneEl.emit('item-deleted');
          }
        }, 0);
      }
    });
  }
});