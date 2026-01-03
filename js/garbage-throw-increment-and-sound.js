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
    handleLevelComplete: function () {
      const infoPanel = document.querySelector("#info-panel");
      const infoText = document.querySelector("#info-text");

      if (infoPanel && infoText) {
        infoPanel.setAttribute("visible", true);

        const currentPage = window.location.pathname.split("/").pop();

        let message = "";
        let nextPage = null;

        switch (currentPage) {
          case "plastic.html":
            message =
              "Plastic takes hundreds of years to decompose.\nRecycling plastic saves energy and reduces ocean pollution.";
            nextPage = "metal.html";
            break;

            case "glass.html":
            message =
              "Glass is 100% recyclable and can be reused endlessly.\nRecycling glass reduces waste and saves resources.";
            nextPage = "organic.html";
            break;

          case "metal.html":
            message =
              "Metal can be recycled infinitely without losing quality.\nRecycling metal saves raw materials and energy.";
            nextPage = "glass.html";
            break;

          case "organic.html":
            message =
              "Organic waste can be composted.\nComposting reduces landfill waste and creates natural fertilizer.";
            setTimeout(() => {
              window.location.href = "final.html";
            }, 6000);
            infoText.setAttribute("value", message);
            return;
        }

        infoText.setAttribute("value", message);

        // espera 5 segundos antes de mudar de ilha
        setTimeout(() => {
          window.location.href = nextPage;
        }, 5000);
      }
    }


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
