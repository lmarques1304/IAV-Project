/* File: js/random-spawner.js */
AFRAME.registerComponent("random-spawner", {
  schema: {
    model: { type: "string", default: "" }, // Default empty to check if provided
    count: { type: "int", default: 10 },
    scale: { type: "vec3", default: { x: 1, y: 1, z: 1 } },
    areaSize: { type: "number", default: 50 },
    offsetZ: { type: "number", default: 0 },
    yPos: { type: "number", default: 0 },
    rotationType: { type: "string", default: "randomY" },
    isGrabbable: { type: "boolean", default: false },
  },

  init: function () {
    // Helper function to generate random numbers
    const random = (min, max) => Math.random() * (max - min) + min;

    const createObject = () => {
      const el = document.createElement("a-entity");

      // 1. Position & Scale
      const x = (Math.random() - 0.5) * this.data.areaSize;
      const z = (Math.random() - 0.5) * this.data.areaSize + this.data.offsetZ;
      el.setAttribute("position", `${x} ${this.data.yPos} ${z}`);
      el.setAttribute("scale", this.data.scale);

      // 2. Rotation
      if (this.data.rotationType === "lying") {
        el.setAttribute("rotation", `90 0 ${Math.random() * 360}`);
      } else {
        el.setAttribute("rotation", `0 ${Math.random() * 360} 0`);
      }

      // 3. Set Model
      if (this.data.model) {
        el.setAttribute("gltf-model", this.data.model);
      }

      // 4. Handle Grabbable & Physics
      if (this.data.isGrabbable) {
        // Essential for simple-grab to find it
        el.classList.add("grabbable");

        // CRITICAL FIX: Wait for the model to load before adding physics
        // Otherwise physics body calculates size as 0
        el.addEventListener("model-loaded", () => {
          // 'hull' wraps the model tightly, 'box' is a simple box
          // 'hull' is usually best for bottles/cans
          el.setAttribute("dynamic-body", {
            mass: 0.2,
            shape: "hull",
          });
        });
      }

      return el;
    };

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < this.data.count; i++) {
      fragment.appendChild(createObject());
    }
    this.el.sceneEl.appendChild(fragment);
  },
});
