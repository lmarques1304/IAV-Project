AFRAME.registerComponent("spawn-recyclables", {
  init: function () {
    const materials = [
      { type: "plastic", texture: "#plastic-texture", count: 3 },
      { type: "paper", texture: "#paper-texture", count: 3 },
      { type: "glass", texture: "#glass-texture", count: 3 },
    ];

    materials.forEach((material) => {
      for (let i = 0; i < material.count; i++) {
        const block = document.createElement("a-box");
        block.setAttribute("class", "recyclable");
        block.setAttribute("data-type", material.type);
        block.setAttribute("src", material.texture);
        block.setAttribute("width", 0.2);
        block.setAttribute("height", 0.2);
        block.setAttribute("depth", 0.2);
        block.setAttribute("grabbable", "");
        block.setAttribute("position", {
          x: (Math.random() - 0.5) * 4,
          y: 0.2,
          z: (Math.random() - 0.5) * 2 - 1,
        });
        this.el.sceneEl.appendChild(block);
      }
    });
  },
});
