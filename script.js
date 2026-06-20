// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", () => {

  // Crea el botón flotante del chatbot
  const btn = document.createElement("button");
  btn.id = "btnChat";
  btn.innerText = "💬";
  document.body.appendChild(btn);

  // Obtiene elementos del DOM necesarios
  const chatbotDiv = document.getElementById("chatbot-flotante");
  const bgAudio = document.getElementById("bg-audio");
  const playMusicBtn = document.getElementById("play-music-btn");

  // Inserta contenido HTML dentro del chatbot
  chatbotDiv.innerHTML = `
    <h5 style="color:#ff4444; margin-bottom: 0.75rem;">Tattoo & Art Bot</h5>
    <p>Hola, soy tu asistente. ¿Quieres agendar tu hora por WhatsApp?</p>
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem;">
      <button id="btnAgendar" class="btn btn-sm btn-success">Abrir WhatsApp</button>
      <button id="btnCerrar" class="btn btn-sm btn-outline-light">Cerrar</button>
    </div>
  `;

  // Función para hacer fade-in y fade-out del audio
  const fadeAudio = (audio, fadeTime, targetVolume, callback) => {
    const steps = 30; // cantidad de pasos del fade
    const interval = fadeTime / steps; // tiempo entre pasos
    const volumeStep = (targetVolume - audio.volume) / steps; // cuánto cambia el volumen por paso
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep += 1;
      audio.volume = Math.min(1, Math.max(0, audio.volume + volumeStep));

      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        if (callback) callback(); // ejecuta callback si existe
      }
    }, interval);
  };

  // Evita que el audio se inicie más de una vez
  let bgAudioStarted = false;

  // Oculta el botón de música si ya no es necesario
  const hideMusicButton = () => {
    if (playMusicBtn) {
      playMusicBtn.style.display = "none";
    }
  };

  // Función principal para iniciar el audio de fondo
  const startBackgroundAudio = () => {
    if (!bgAudio || bgAudioStarted) return;

    bgAudio.volume = 0;
    const playPromise = bgAudio.play();

    const fadeStart = () => {
      bgAudioStarted = true;
      fadeAudio(bgAudio, 2500, 0.28); // fade-in

      // Después de 27 segundos, fade-out y detiene el audio
      setTimeout(() => {
        fadeAudio(bgAudio, 2500, 0, () => {
          bgAudio.pause();
          bgAudio.currentTime = 0;
        });
      }, 27000);

      hideMusicButton();
    };

    // Manejo de bloqueo de reproducción automática
    if (playPromise !== undefined) {
      playPromise.then(fadeStart).catch(() => {
        if (playMusicBtn) {
          playMusicBtn.style.display = "block";
          playMusicBtn.innerText = "Presiona para iniciar la música";
        }
      });
    } else {
      fadeStart();
    }
  };

  // Eventos que activan la música
  if (playMusicBtn) {
    playMusicBtn.addEventListener("click", startBackgroundAudio);
  }
  document.addEventListener("click", startBackgroundAudio, { once: true });
  document.addEventListener("keydown", startBackgroundAudio, { once: true });
  document.addEventListener("touchstart", startBackgroundAudio, { once: true });

  // Intenta iniciar el audio automáticamente
  startBackgroundAudio();

  // Parallax: selecciona elementos con clase .parallax
  const parallaxItems = document.querySelectorAll(".parallax");

  const applyParallax = () => {
    const scrollTop = window.scrollY;

    parallaxItems.forEach((item, index) => {
      const speed = 0.05 + index * 0.02; // velocidad distinta por elemento
      const offset = (scrollTop - item.offsetTop) * speed;
      item.style.transform = `translateY(${offset}px)`; // mueve el elemento
    });
  };

  // Header con efecto de humo
  const header = document.querySelector("header");

  const applyScrollEffects = () => {
    applyParallax();

    if (!header) return;

    const scrollTop = window.scrollY;

    if (scrollTop > 50) {
      header.classList.add("smoke-header");
      const intensity = Math.min(1, (scrollTop - 50) / 250);
      header.style.setProperty("--smoke-opacity", intensity);
    } else {
      header.classList.remove("smoke-header");
    }
  };

  // Aplica efectos al hacer scroll
  window.addEventListener("scroll", applyScrollEffects);
  applyScrollEffects();

  // Función para mostrar saludo inicial del chatbot
  const showGreeting = () => {
    chatbotDiv.style.display = "block";
    btn.style.display = "none";

    const greetingText = "¡Hola! 👋";
    const originalContent = chatbotDiv.innerHTML;

    chatbotDiv.innerHTML = `
      <h5 style="color:#ff4444; margin-bottom: 0.75rem;">Tattoo & Art Bot</h5>
      <p style="font-size: 1.2rem; font-weight: 600;">${greetingText}</p>
    `;

    // Restaura contenido después de 1.5 segundos
    setTimeout(() => {
      chatbotDiv.innerHTML = originalContent;

      const closeBtn = document.getElementById("btnCerrar");
      const agendBtn = document.getElementById("btnAgendar");

      // Botón cerrar
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          chatbotDiv.style.display = "none";
          btn.style.display = "flex";
          btn.style.alignItems = "center";
          btn.style.justifyContent = "center";
        });
      }

      // Botón agendar por WhatsApp
      if (agendBtn) {
        agendBtn.addEventListener("click", () => {
          const whatsappNumber = "56912345678";
          const message = encodeURIComponent("Hola Tattoo & Art, quiero agendar una hora.");
          const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
          window.open(whatsappUrl, "_blank");
        });
      }
    }, 1500);
  };

  // Evento para abrir chatbot
  btn.addEventListener("click", () => {
    showGreeting();
  });

  // Botón externo para abrir chatbot
  const reserveChatBtn = document.getElementById("btnReservaChat");
  if (reserveChatBtn) {
    reserveChatBtn.addEventListener("click", (event) => {
      event.preventDefault();
      showGreeting();
    });
  }

  // Formulario de contacto
  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!contactStatus) return;

      contactStatus.textContent = "Enviando mensaje...";

      const formData = new FormData(contactForm);
      const payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      };

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          contactStatus.textContent = result.error || "Error al enviar el mensaje.";
          return;
        }

        contactStatus.textContent = "¡Mensaje enviado! Nos contactaremos pronto.";
        contactForm.reset();

      } catch (error) {
        contactStatus.textContent = "No se pudo enviar el mensaje. Intenta nuevamente más tarde.";
      }
    });
  }

  // Formulario de subida de imágenes
  const uploadForm = document.getElementById("uploadForm");
  const uploadStatus = document.getElementById("uploadStatus");
  const uploadPreview = document.getElementById("uploadPreview");

  if (uploadForm) {
    uploadForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!uploadStatus) return;

      uploadStatus.textContent = "Subiendo archivo...";
      uploadPreview.innerHTML = "";

      const fileInput = document.getElementById("uploadFile");

      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        uploadStatus.textContent = "Por favor selecciona una imagen.";
        return;
      }

      const formData = new FormData();
      formData.append("file", fileInput.files[0]);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          uploadStatus.textContent = result.error || "Error al subir el archivo.";
          return;
        }

        uploadStatus.textContent = "¡Archivo subido con éxito!";
        uploadPreview.innerHTML = `
          <p class="text-light-50">Archivo disponible en:
            <a href="${result.url}" target="_blank">${result.url}</a>
          </p>
          <img src="${result.url}" class="img-fluid rounded shadow" alt="Vista previa de archivo subido">
        `;

        uploadForm.reset();

      } catch (error) {
        uploadStatus.textContent = "No se pudo subir el archivo. Intenta nuevamente más tarde.";
      }
    });
  }
});

