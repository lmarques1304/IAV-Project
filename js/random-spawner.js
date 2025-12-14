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

      // 1. ADD INVISIBLE HITBOX
      // We keep this geometry! It provides a solid volume for the hand collider to grab.
      el.setAttribute(
        "geometry",
        "primitive: box; width: 0.5; height: 0.5; depth: 0.5"
      );
      // Visible false means the player sees the model, but the 'hand' feels the box.
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

      // 6. Physics
      if (this.data.physics !== "none") {
        const addPhysics = () => {
          // FIX 1: Do NOT remove the geometry/material.
          // By keeping the invisible box, we ensure stable physics (box shape)
          // and reliable grabbing (hand finds the box easily).

          // FIX 2: Correctly assign dynamic vs static
          if (this.data.physics === "dynamic") {
            // Dynamic needs mass to fall/move
            el.setAttribute("dynamic-body", "shape: auto; mass: 2");
          } else if (this.data.physics === "static") {
            el.setAttribute("static-body", "shape: auto");
          }
        };

        if (this.data.model) {
          // Wait for model to load ensures we don't apply physics too early,
          // though with the box geometry kept, we could actually do it immediately.
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