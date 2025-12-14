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
  },

  init: function () {
    // Helper to create objects
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

      // 3. Model
      if (this.data.model) {
        el.setAttribute("gltf-model", this.data.model);
      }

      // 4. Hitbox (CRITICAL)
      // We add an invisible box so the physics engine and your hand have a simple shape to detect.
      // Without this, the raycaster tries to hit the complex mesh and fails.
      el.setAttribute("geometry", "primitive: box; width: 0.5; height: 0.5; depth: 0.5");
      el.setAttribute("material", "visible: false");

      // 5. Grabbable & Physics State
      if (this.data.isGrabbable) {
        el.classList.add("grabbable");

        // Spawn as STATIC (Asleep). This prevents them from jittering/exploding on load.
        // The grab script will wake them up later.
        el.setAttribute("static-body", "shape: box"); 
      }

      return el;
    };

    // Create fragment for performance
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < this.data.count; i++) {
      fragment.appendChild(createObject());
    }
    this.el.sceneEl.appendChild(fragment);
  },
});