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
    minDistance: { type: "number", default: 1 },
  },

  init: function () {
    const player = this.el.sceneEl.querySelector("#player");
    const bin = this.el.sceneEl.querySelector("#bin");
    const binPosition = bin ? bin.getAttribute("position") : null;

    const createObject = () => {
      const el = document.createElement("a-entity");
      // Get up-to-date player position for each object created
      const playerPosition = player.getAttribute("position");

      let x, z;
      let tooClose;
      let attempts = 0;
      const maxAttempts = 20;

      do {
        x = (Math.random() - 0.5) * this.data.areaSize;
        z = (Math.random() - 0.5) * this.data.areaSize + this.data.offsetZ;
        attempts++;

        const distToPlayer = Math.hypot(x - playerPosition.x, z - playerPosition.z);
        
        let distToBin = Infinity;
        if (binPosition) {
          distToBin = Math.hypot(x - binPosition.x, z - binPosition.z);
        }

        tooClose = distToPlayer < this.data.minDistance || distToBin < this.data.minDistance;

      } while (tooClose && attempts < maxAttempts);

      if (tooClose) {
        console.warn(`[random-spawner]: Could not find a suitable position for an object after ${maxAttempts} attempts. Skipping this spawn.`);
        return null;
      }

      // Position
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
      const newEl = createObject();
      if (newEl) {
        fragment.appendChild(newEl);
      }
    }
    this.el.sceneEl.appendChild(fragment);
  },
});