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
      // 1. Create the PARENT container (The Hitbox & Physics Body)
      const container = document.createElement("a-entity");
      
      const x = (Math.random() - 0.5) * this.data.areaSize;
      const z = (Math.random() - 0.5) * this.data.areaSize + this.data.offsetZ;
      
      container.setAttribute("position", `${x} ${this.data.yPos} ${z}`);
      
      // Rotate the container so the physics box rotates too
      if (this.data.rotationType === "lying") {
        container.setAttribute("rotation", `90 0 ${Math.random() * 360}`);
      } else {
        container.setAttribute("rotation", `0 ${Math.random() * 360} 0`);
      }

      // HITBOX: A semi-transparent box so you can see where to grab.
      // Set visible: false later if you want it perfectly hidden.
      container.setAttribute("geometry", "primitive: box; width: 0.6; height: 0.6; depth: 0.6");
      container.setAttribute("material", "color: red; opacity: 0.01; visible: true; transparent: true");

      if (this.data.isGrabbable) {
        container.classList.add("grabbable");
      }

      // PHYSICS: Apply to the parent container
      if (this.data.physics !== "none") {
         if (this.data.physics === "dynamic") {
            container.setAttribute("dynamic-body", "mass: 2; shape: box");
         } else {
            container.setAttribute("static-body", "shape: box");
         }
      }

      // 2. Create the CHILD (The Visual Model)
      if (this.data.model) {
        const modelEl = document.createElement("a-entity");
        modelEl.setAttribute("gltf-model", this.data.model);
        modelEl.setAttribute("scale", this.data.scale);
        
        // Center the model inside the hitbox
        modelEl.setAttribute("position", "0 0 0"); 
        
        container.appendChild(modelEl);
      }

      fragment.appendChild(container);
    }

    this.el.sceneEl.appendChild(fragment);
  },
});