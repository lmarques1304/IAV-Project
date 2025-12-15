/* island.js */

AFRAME.registerComponent("island-setup", {
  init: function () {
    // Wait for the scene to fully load before running setup
    // This fixes the issue where elements might not be ready yet
    if (this.el.hasLoaded) {
      this.setup();
    } else {
      this.el.addEventListener("loaded", () => {
        this.setup();
      });
    }
  },

  setup: function () {
    console.log("Island Setup Component Loaded");

    // Sky Setup
    const sky = document.querySelector("a-sky");
    if (sky) {
      sky.setAttribute("color", "#87CEEB");
    }

    // Default Light Setup
    const defaultLight = document.querySelector("#defaultLight");
    if (defaultLight) {
      defaultLight.setAttribute("light", {
        type: "ambient",
        intensity: 1,
      });
    }

    // Sun Light Setup
    const sunLight = document.querySelector("#sunLight");
    if (sunLight) {
      sunLight.setAttribute("light", {
        type: "directional",
        intensity: 0.8,
      });
    }

    // Rig/Camera Setup
    const rig = document.querySelector("#rig");
    if (rig) {
      // It is often safer to set position as a string or an object
      rig.setAttribute("position", { x: 0, y: 1.6, z: 0 });
    }
  },
});

AFRAME.registerComponent("stay-in-bounds", {
  schema: {
    xRange: { type: "number", default: 30 }, // Distance from center
    zRange: { type: "number", default: 30 },
  },

  tick: function () {
    const currentPosition = this.el.getAttribute("position");
    const limitX = this.data.xRange;
    const limitZ = this.data.zRange;

    let x = currentPosition.x;
    let z = currentPosition.z;
    let modified = false;

    // Check X bounds
    if (x > limitX) {
      x = limitX;
      modified = true;
    } else if (x < -limitX) {
      x = -limitX;
      modified = true;
    }

    // Check Z bounds
    if (z > limitZ) {
      z = limitZ;
      modified = true;
    } else if (z < -limitZ) {
      z = -limitZ;
      modified = true;
    }

    // Only update the DOM if we actually hit a wall
    if (modified) {
      this.el.setAttribute("position", { x: x, y: currentPosition.y, z: z });
    }
  },
});
