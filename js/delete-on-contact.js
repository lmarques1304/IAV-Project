AFRAME.registerComponent('delete-on-contact', {
  init: function () {
    // Use the physics system's 'collide' event
    this.el.addEventListener('collide', (e) => {
      
      // Get the element attached to the physics body that hit the bin
      const hitEl = e.detail.body ? e.detail.body.el : null;

      // Check if it's a grabbable item
      if (hitEl && hitEl.classList.contains('grabbable')) {
        
        // CRITICAL FIX: Defer removal to the next tick. 
        // Removing a physics body synchronously during a collision event crashes the engine.
        setTimeout(() => {
          if (hitEl.parentNode) {
            hitEl.parentNode.removeChild(hitEl);
          }
        }, 0);
      }
    });
  }
});