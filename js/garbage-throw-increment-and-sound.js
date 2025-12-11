//requires delete-on-contact.js to be loaded first and has to be defered
//requires #counter element in html andd #garbage-throw-sound sound entity
let deleteCount = 0;
const counterEl = document.querySelector("#counter");

document.querySelector("a-scene").addEventListener("item-deleted", () => {
  deleteCount++;
  counterEl.setAttribute("text", "value", `Items collected: ${deleteCount}/10`);
  if (deleteCount >= 10) {
    window.location.href = "metal.html";
  }

  garbageThrowSound = document.querySelector("#garbage-throw-sound");
  garbageThrowSound.components.sound.playSound();
});

// In your HTML, make sure to have the following elements:

//   <a-entity
//     sound="src: #bin-sound; volume: 0.3 positional: false"
//     id="garbage-throw-sound"
//   ></a-entity>

// <a-entity id="counter-display" position="0 1.5 -5" scale="1.5 1.5 1.5">
//     <a-plane
//       color="#000000"
//       opacity="0.5"
//       width="2"
//       height="0.5"
//       position="0 0 -0.1"
//     ></a-plane>
//     <a-entity
//       id="counter"
//       text="value: Items collected: 0/10; color: #FFFFFF; align: center; width: 3.5"
//       position="0 0 0"
//     ></a-entity>
//   </a-entity>
