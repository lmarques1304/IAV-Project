/* File: js/random-spawner.js */
AFRAME.registerComponent("random-spawner", {
  schema: {
    model: { type: "string", default: "" },
    count: { type: "int", default: 10 },
    scale: { type: "vec3", default: { x: 1, y: 1, z: 1 } },
    areaSize: { type: "number", default: 50 },
    offsetZ: { type: "number", default: 0 },
    yPos: { type: "number", default: 0 },
    rotationType: { type: "string", default: "randomY" },
    isGrabbable: { type: "boolean", default: false },
    physics: { type: "string", default: "none" },
  },

  init: function () {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < this.data.count; i++) {
      // 1. Create PARENT (Physics Body & Hitbox)
      const container = document.createElement("a-entity");

      const x = (Math.random() - 0.5) * this.data.areaSize;
      const z = (Math.random() - 0.5) * this.data.areaSize + this.data.offsetZ;

      container.setAttribute("position", `${x} ${this.data.yPos} ${z}`);

      if (this.data.rotationType === "lying") {
        container.setAttribute("rotation", `90 0 ${Math.random() * 360}`);
      } else {
        container.setAttribute("rotation", `0 ${Math.random() * 360} 0`);
      }

      // 2. HITBOX: Smaller (0.25) so items don't overlap easily.
      // visible: false -> Invisible until debugged or hovered.
      container.setAttribute("geometry", "primitive: box; width: 0.25; height: 0.25; depth: 0.25");
      container.setAttribute("material", "visible: false"); 

      if (this.data.isGrabbable) {
        container.classList.add("grabbable");
      }

      // 3. PHYSICS
      if (this.data.physics !== "none") {
        if (this.data.physics === "dynamic") {
           // 'shape: hull' tries to match the model, but 'shape: box' is more stable for grabbing.
           // slightly larger mass makes it less jittery.
           container.setAttribute("dynamic-body", "mass: 5; shape: box");
        } else {
           container.setAttribute("static-body", "shape: box");
        }
      }

      // 4. CHILD (Visual Model)
      if (this.data.model) {
        const modelEl = document.createElement("a-entity");
        modelEl.setAttribute("gltf-model", this.data.model);
        modelEl.setAttribute("scale", this.data.scale);
        modelEl.setAttribute("position", "0 0 0");
        container.appendChild(modelEl);
      }

      fragment.appendChild(container);
    }

    this.el.sceneEl.appendChild(fragment);
  },
});