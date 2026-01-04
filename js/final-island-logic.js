/* js/final-island-logic.js */

// 1. Lógica do Placar (Clicar para mudar texto)
AFRAME.registerComponent("info-sign-logic", {
  init: function () {
    this.state = 0; // 0 = Primeira frase, 1 = Segunda frase
    const textEl = document.querySelector("#placard-text");

    this.el.addEventListener("click", () => {
      if (this.state === 0) {
        textEl.setAttribute(
          "value",
          "Collect the 5 objects of different materials and place them in the correct bin. Are you capable?"
        );
        this.state = 1;
      }
    });
  },
});

// 2. Lógica de Validação do Lixo (Bin correto?)
AFRAME.registerComponent("final-bin-check", {
  schema: {
    targetType: { type: "string", default: "" },
  },
  init: function () {
    this.el.addEventListener("collide", (e) => {
      const hitEl = e.detail.body ? e.detail.body.el : null;

      // Safety check: ensure hitEl exists and hasn't been processed yet
      if (!hitEl || hitEl.isRemoving) return;

      // Verifica se é um objeto agarrável
      if (hitEl.classList.contains("grabbable")) {
        const itemType = hitEl.getAttribute("data-type");

        // Verifica se o tipo bate certo (Ex: metal == metal)
        if (itemType === this.data.targetType) {
          // Mark as removing to prevent double-collision crashes
          hitEl.isRemoving = true;

          console.log("Correct bin! Removing:", itemType);

          setTimeout(() => {
            if (hitEl.parentNode) {
              // CRITICAL FIX: Remove physics components BEFORE removing the entity
              // This prevents the physics engine from crashing on a missing shape
              hitEl.removeAttribute("dynamic-body");
              hitEl.removeAttribute("static-body");
              hitEl.removeAttribute("shape"); // specific to cannon.js sometimes

              // Remove o objeto do DOM
              hitEl.parentNode.removeChild(hitEl);

              // Toca o som de sucesso
              const soundEntity = document.querySelector(
                "#garbage-throw-sound"
              );
              if (soundEntity && soundEntity.components.sound) {
                soundEntity.components.sound.playSound();
              }

              // Avisa o manager para subir a pontuação
              this.el.sceneEl.emit("garbage-success");
            }
          }, 50); // Increased delay slightly to 50ms to ensure physics step clears
        } else {
          console.log(
            "Wrong bin! Item is " +
              itemType +
              ", Bin needs " +
              this.data.targetType
          );
        }
      }
    });
  },
});

// 3. Gerenciador do Jogo (Contador e Vitória)
AFRAME.registerComponent("final-island-manager", {
  init: function () {
    this.totalGoal = 5; // Objetivo de 5 itens
    this.currentCount = 0;
    this.counterText = document.querySelector("#score-counter");

    // Escuta o evento de sucesso vindo dos bins
    this.el.addEventListener("garbage-success", () => {
      this.currentCount++;

      // Atualiza o texto do contador no placar
      if (this.counterText) {
        this.counterText.setAttribute(
          "value",
          `Items collected: ${this.currentCount}/${this.totalGoal}`
        );
      }

      // Verifica Vitória
      if (this.currentCount >= this.totalGoal) {
        this.triggerVictory();
      }
    });
  },

  triggerVictory: function () {
    // Muda o céu
    const sky = document.querySelector("#main-sky");
    if (sky) {
      sky.setAttribute("src", "");
      sky.setAttribute("color", "#87CEEB"); // Azul limpo
    }

    // Atualiza o Placar com mensagem final
    const textEl = document.querySelector("#placard-text");
    if (textEl) {
      textEl.setAttribute(
        "value",
        "CONGRATULATIONS!\nThe island is clean.\nRecycling is the future."
      );
      textEl.setAttribute("color", "#00FF00");
    }

    // Redireciona após 10 segundos
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 10000);
  },
});
