/* File: js/spawner.js */
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
      const el = document.createElement("a-entity");

      // 1. ADD INVISIBLE HITBOX (The Fix)
      // This gives the object immediate size so the hand can find it.
      // We make it roughly 0.5m size, visible=false so the player doesn't see it.
      el.setAttribute(
        "geometry",
        "primitive: box; width: 0.5; height: 0.5; depth: 0.5"
      );
      el.setAttribute("material", "visible: false");

      // 2. Set Model
      if (this.data.model) {
        el.setAttribute("gltf-model", this.data.model);
      }

      // 3. Set Position & Scale
      const x = (Math.random() - 0.5) * this.data.areaSize;
      const z = (Math.random() - 0.5) * this.data.areaSize + this.data.offsetZ;
      el.setAttribute("position", `${x} ${this.data.yPos} ${z}`);
      el.setAttribute("scale", this.data.scale);

      // 4. Rotation
      if (this.data.rotationType === "lying") {
        el.setAttribute("rotation", `90 0 ${Math.random() * 360}`);
      } else {
        el.setAttribute("rotation", `0 ${Math.random() * 360} 0`);
      }

      // 5. Interaction
      if (this.data.isGrabbable) {
        el.classList.add("grabbable");
      }

      // 6. Physics (Wait for load, but now we have the hitbox as backup)
      if (this.data.physics !== "none") {
        const addPhysics = () => {
          // Remove the temporary hitbox geometry so it doesn't conflict with the model shape
          el.removeAttribute("geometry");
          el.removeAttribute("material");

          if (
            this.data.physics === "dynamic" ||
            this.data.physics === "static"
          ) {
            el.setAttribute("static-body", "shape: auto");
          }
        };

        if (this.data.model) {
          el.addEventListener("model-loaded", addPhysics);
        } else {
          addPhysics();
        }
      }

      fragment.appendChild(el);
    }

    this.el.sceneEl.appendChild(fragment);
  },
});
