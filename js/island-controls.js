window.addEventListener("DOMContentLoaded", () => {

  console.log("Island Controls Loaded");

  const rig = document.querySelector("#rig");
  const camera = document.querySelector("#camera");

  const leftHand = document.querySelector("#leftHand");
  const rightHand = document.querySelector("#rightHand");

  if (!rig || !camera) {
    console.warn();
    return;
  }

  if (!leftHand || !rightHand) {
    console.warn("!");
    return;
  }

  leftHand.setAttribute("blink-controls", {
    cameraRig: "#rig",
    teleportOrigin: "#camera",
    collisionEntities: ".ground",
    button: "thumbstick"
  });

  rightHand.setAttribute("blink-controls", {
    cameraRig: "#rig",
    teleportOrigin: "#camera",
    collisionEntities: ".ground",
    button: "thumbstick"
  });

  console.log();

});
