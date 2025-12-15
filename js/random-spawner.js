/* File: js/random-spawner.js */
AFRAME.registerComponent("random-spawner", {
  schema: {
    model: { type: "string", default: "gltf-model" },
    count: { type: "int", default: 10 },
    scale: { type: "vec3", default: { x: 1, y: 1, z: 1 } },
    areaSize: { type: "number", default: 50 },
    offsetZ: { type: "number", default: 0 },
    yPos: { type: "number", default: 0 },
    rotationType: { type: "string", default: "randomY" },
    isGrabbable: { type: "boolean", default: false },
    physicsType: { type: "string", default: "none" },
  },

  init: function () {
    const createObject = () => {
      const el = document.createElement("a-entity");

      const x = (Math.random() - 0.5) * this.data.areaSize;
      const z = (Math.random() - 0.5) * this.data.areaSize + this.data.offsetZ;
      el.setAttribute("position", `${x} ${this.data.yPos} ${z}`);
      el.setAttribute("scale", this.data.scale);

      if (this.data.rotationType === "lying") {
        el.setAttribute("rotation", `90 0 ${Math.random() * 360}`);
      } else {
        el.setAttribute("rotation", `0 ${Math.random() * 360} 0`);
      }

      if (this.data.model) {
        el.setAttribute("gltf-model", this.data.model);
      }

      // el.setAttribute(
      //   "geometry",
      //   "primitive: box; width: 0.5; height: 0.5; depth: 0.5"
      // );
      // el.setAttribute("material", "visible: false");

      if (this.data.isGrabbable) {
        el.setAttribute("class", "grabbable");
        el.setAttribute("dynamic-body", "mass: 0.2; shape: auto");
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
