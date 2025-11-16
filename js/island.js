window.addEventListener("DOMContentLoaded", () => {

  console.log("Island Setup Loaded");

  const sky = document.querySelector("a-sky");
  if (sky) {
    sky.setAttribute("color", "#87CEEB");
  }

  const defaultLight = document.querySelector("#defaultLight");
  if (defaultLight) {
    defaultLight.setAttribute("light", {
      type: "ambient",
      intensity: 1
    });
  }

  const sunLight = document.querySelector("#sunLight");
  if (sunLight) {
    sunLight.setAttribute("light", {
      type: "directional",
      intensity: 0.8
    });
  }

  const rig = document.querySelector("#rig");
  if (rig) {
    rig.setAttribute("position", { x: 0, y: 1.6, z: 0 });
  }

});
