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
    const createObject = () => {
      const el = document.createElement("a-entity");

      // Position
      const x = (Math.random() - 0.5) * this.data.areaSize;
      const z = (Math.random() - 0.5) * this.data.areaSize + this.data.offsetZ;
      el.setAttribute("position", `${x} ${this.data.yPos} ${z}`);
      el.setAttribute("scale", this.data.scale);

      // Rotation
      if (this.data.rotationType === "lying") {
        el.setAttribute("rotation", `90 0 ${Math.random() * 360}`);
      } else {
        el.setAttribute("rotation", `0 ${Math.random() * 360} 0`);
      }

      // Model
      if (this.data.model) el.setAttribute("gltf-model", this.data.model);

      // Grabbable Setup
      if (this.data.isGrabbable) {
        el.classList.add("grabbable");

        // Wait for model load, then add STATIC body
        el.addEventListener("model-loaded", () => {
          el.setAttribute("static-body", { shape: "hull" });
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