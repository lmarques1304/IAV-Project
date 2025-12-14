/* File: js/spawner.js
  Usage: <a-entity random-spawner="model: #myModel; count: 10"></a-entity>
*/

AFRAME.registerComponent("random-spawner", {
  schema: {
    model: { type: "string", default: "" },
    count: { type: "int", default: 10 },
    scale: { type: "vec3", default: { x: 1, y: 1, z: 1 } },
    areaSize: { type: "number", default: 50 }, // Width/Depth of the area
    offsetZ: { type: "number", default: 0 }, // Shift the area forward/back
    yPos: { type: "number", default: 0 },
    rotationType: { type: "string", default: "randomY" }, // 'randomY' or 'lying'
    isGrabbable: { type: "boolean", default: false },
    physics: { type: "string", default: "none" }, // 'none', 'static', 'dynamic'
  },

  init: function () {
    // We use a document fragment to improve performance (batches DOM updates)
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < this.data.count; i++) {
      const el = document.createElement("a-entity");

      // 1. Set Model
      if (this.data.model) {
        el.setAttribute("gltf-model", this.data.model);
      }

      // 2. Set Position (Random X/Z, Fixed Y)
      const x = (Math.random() - 0.5) * this.data.areaSize;
      const z = (Math.random() - 0.5) * this.data.areaSize + this.data.offsetZ;
      el.setAttribute("position", `${x} ${this.data.yPos} ${z}`);

      // 3. Set Scale
      el.setAttribute("scale", this.data.scale);

      // 4. Set Rotation
      if (this.data.rotationType === "lying") {
        // Lying down (good for trash on ground)
        el.setAttribute("rotation", `90 0 ${Math.random() * 360}`);
      } else {
        // Upright but rotated randomly (good for trees/props)
        el.setAttribute("rotation", `0 ${Math.random() * 360} 0`);
      }

      // 5. Classes (Interaction)
      if (this.data.isGrabbable) {
        el.classList.add("grabbable");
      }

      if (this.data.physics !== "none") {
        // Define the function that adds physics
        const addPhysics = () => {
          if (this.data.physics === "dynamic") {
            // "hull" is often more accurate than "auto" for trash items
            el.setAttribute("dynamic-body", "mass: 0.2; shape: hull");
          } else if (this.data.physics === "static") {
            el.setAttribute("static-body", "shape: hull");
          }
        };

        // If it's a model, wait for it to load. If it's a primitive (box/sphere), add immediately.
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
