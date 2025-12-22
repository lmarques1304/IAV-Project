/* File: garbage-throw-increment-and-sound.js
  Usage: Attach this component to your <a-scene> tag.
  Example: <a-scene game-manager>
*/

AFRAME.registerComponent("game-manager", {
  schema: {
    targetCount: { type: "int", default: 10 },
    counterId: { type: "string", default: "#counter" },
    soundId: { type: "string", default: "#garbage-throw-sound" },
  },

  init: function () {
    // 1. Initialize State
    this.deleteCount = 0;

    // 2. Cache References (Do this once, not every frame)
    // We look for elements inside the scene to be safe
    this.counterEl = document.querySelector(this.data.counterId);
    this.soundEl = document.querySelector(this.data.soundId);

    // Check if elements exist to prevent crashes
    if (!this.counterEl)
      console.warn("Game Manager: Counter element not found!");
    if (!this.soundEl) console.warn("Game Manager: Sound element not found!");

    // 3. Bind the event listener to 'this' so we can access variables
    this.handleItemDeleted = this.handleItemDeleted.bind(this);

    // 4. Listen for the event on the Scene
    this.el.addEventListener("item-deleted", this.handleItemDeleted);
  },

  handleItemDeleted: function () {
    // Increment
    this.deleteCount++;

    // Update Text
    if (this.counterEl) {
      this.counterEl.setAttribute(
        "text",
        "value",
        `Items collected: ${this.deleteCount}/${this.data.targetCount}`
      );
    }

    // Play Sound
    if (this.soundEl && this.soundEl.components.sound) {
      this.soundEl.components.sound.playSound();
    }

    // Check Win Condition
    if (this.deleteCount >= this.data.targetCount) {
      this.handleLevelComplete();
    }
  },

  handleLevelComplete: function () {
    const currentPage = window.location.pathname.split("/").pop();
    let nextPage;

    switch (currentPage) {
      case "plastic.html":
        nextPage = "metal.html";
        break;
      case "metal.html":
        nextPage = "glass.html";
        break;
      case "glass.html":
        nextPage = "organic.html";
        break;
      case "organic.html":
        window.location.href = "final.html";
        return;
    }

    if (nextPage) {
      console.log("Level Complete! Moving to:", nextPage);
      window.location.href = nextPage;
    }
  },

  // Cleanup if the scene is removed (Good practice)
  remove: function () {
    this.el.removeEventListener("item-deleted", this.handleItemDeleted);
  },
});
