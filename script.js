// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", () => {

  // -----------------------------
  // CREACIÓN DEL BOTÓN FLOTANTE
  // -----------------------------

  const btn = document.createElement("button"); // Crea un botón dinámico
  btn.id = "btnChat";                           // Asigna ID al botón
  btn.innerText = "💬";                         // Agrega emoji como texto
  document.body.appendChild(btn);               // Inserta el botón en el body

  // -----------------------------
  // OBTENER ELEMENTOS DEL DOM
  // -----------------------------

  const chatbotDiv = document.getElementById("chatbot-flotante"); // Contenedor del chatbot
  const bgAudio = document.getElementById("bg-audio");            // Audio de fondo
  const playMusicBtn = document.getElementById("play-music-btn"); // Botón para iniciar música

  // -----------------------------
  // CONTENIDO DEL CHATBOT
  // -----------------------------

  chatbotDiv.innerHTML = ` 
    <h5 style="color:#ff4444; margin-bottom: 0.75rem;">Tattoo & Art Bot</h5>
    <p>Hola, soy tu asistente. ¿Quieres agendar tu hora por WhatsApp?</p>
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem;">
      <button id="btnAgendar" class="btn btn-sm btn-success">Abrir WhatsApp</button>
      <button id="btnCerrar" class="btn btn-sm btn-outline-light">Cerrar</button>
    </div>
  `; // Inserta el HTML del chatbot

  // -----------------------------
  // FUNCIÓN PARA FADE-IN / FADE-OUT DEL AUDIO
  // -----------------------------

  const fadeAudio = (audio, fadeTime, targetVolume, callback) => { // Función para suavizar volumen
    const steps = 30;                                              // Cantidad de pasos del fade
    const interval = fadeTime / steps;                             // Tiempo entre pasos
    const volumeStep = (targetVolume - audio.volume) / steps;      // Cambio por paso
    let currentStep = 0;                                           // Contador de pasos

    const fadeInterval = setInterval(() => {                       // Intervalo repetitivo
      currentStep += 1;                                            // Incrementa paso
      audio.volume = Math.min(1, Math.max(0, audio.volume + volumeStep)); // Ajusta volumen

      if (currentStep >= steps) {                                  // Si terminó el fade
        clearInterval(fadeInterval);                               // Detiene intervalo
        if (callback) callback();                                  // Ejecuta callback si existe
      }
    }, interval);                                                  // Tiempo entre pasos
  };

  // -----------------------------
  // CONTROL PARA EVITAR DOBLE AUDIO
  // -----------------------------

  let bgAudioStarted = false; // Evita que el audio se inicie más de una vez

  // -----------------------------
  // OCULTAR BOTÓN DE MÚSICA
  // -----------------------------

  const hideMusicButton = () => {                 // Función para ocultar botón
    if (playMusicBtn) playMusicBtn.style.display = "none"; // Oculta si existe
  };

  // -----------------------------
  // INICIAR AUDIO DE FONDO
  // -----------------------------

  const startBackgroundAudio = () => {            // Función principal del audio
    if (!bgAudio || bgAudioStarted) return;       // Evita doble inicio

    bgAudio.volume = 0;                           // Comienza en volumen 0
    const playPromise = bgAudio.play();           // Intenta reproducir audio

    const fadeStart = () => {                     // Función que inicia fade-in
      bgAudioStarted = true;                      // Marca que ya inició
      fadeAudio(bgAudio, 2500, 0.28);             // Fade-in de 2.5 segundos

      setTimeout(() => {                          // Después de 27 segundos...
        fadeAudio(bgAudio, 2500, 0, () => {       // Fade-out
          bgAudio.pause();                        // Pausa audio
          bgAudio.currentTime = 0;                // Reinicia audio
        });
      }, 27000);                                  // Tiempo antes del fade-out

      hideMusicButton();                          // Oculta botón de música
    };

    if (playPromise !== undefined) {              // Si play() devuelve promesa
      playPromise.then(fadeStart).catch(() => {   // Si se pudo reproducir
        if (playMusicBtn) {                       // Si no se pudo reproducir...
          playMusicBtn.style.display = "block";   // Muestra botón
          playMusicBtn.innerText = "Presiona para iniciar la música"; // Cambia texto
        }
      });
    } else {
      fadeStart();                                // Si no hay promesa, inicia fade
    }
  };

  // -----------------------------
  // EVENTOS QUE ACTIVAN EL AUDIO
  // -----------------------------

  if (playMusicBtn) playMusicBtn.addEventListener("click", startBackgroundAudio); // Botón manual
  document.addEventListener("click", startBackgroundAudio, { once: true });       // Primer clic
  document.addEventListener("keydown", startBackgroundAudio, { once: true });     // Primera tecla
  document.addEventListener("touchstart", startBackgroundAudio, { once: true });  // Primer toque

  startBackgroundAudio(); // Intenta iniciar automáticamente

  // -----------------------------
  // EFECTO PARALLAX
  // -----------------------------

  const parallaxItems = document.querySelectorAll(".parallax"); // Selecciona elementos parallax

  const applyParallax = () => {                                 // Función parallax
    const scrollTop = window.scrollY;                           // Obtiene scroll

    parallaxItems.forEach((item, index) => {                    // Recorre elementos
      const speed = 0.05 + index * 0.02;                        // Velocidad distinta
      const offset = (scrollTop - item.offsetTop) * speed;      // Calcula desplazamiento
      item.style.transform = `translateY(${offset}px)`;         // Aplica movimiento
    });
  };

  // -----------------------------
  // EFECTO DE HUMO EN EL HEADER
  // -----------------------------

  const header = document.querySelector("header"); // Obtiene header

  const applyScrollEffects = () => {               // Función de efectos de scroll
    applyParallax();                               // Aplica parallax

    if (!header) return;                           // Si no hay header, termina

    const scrollTop = window.scrollY;              // Obtiene scroll

    if (scrollTop > 50) {                          // Si bajó más de 50px
      header.classList.add("smoke-header");        // Activa humo
      const intensity = Math.min(1, (scrollTop - 50) / 250); // Calcula opacidad
      header.style.setProperty("--smoke-opacity", intensity); // Aplica opacidad
    } else {
      header.classList.remove("smoke-header");     // Quita humo si vuelve arriba
    }
  };

  window.addEventListener("scroll", applyScrollEffects); // Aplica efectos al hacer scroll
  applyScrollEffects();                                  // Aplica efectos al cargar

  // -----------------------------
  // MOSTRAR SALUDO DEL CHATBOT
  // -----------------------------

  const showGreeting = () => {                     // Función para mostrar saludo
    chatbotDiv.style.display = "block";            // Muestra chatbot
    btn.style.display = "none";                    // Oculta botón flotante

    const greetingText = "¡Hola! 👋";              // Texto del saludo
    const originalContent = chatbotDiv.innerHTML;  // Guarda contenido original

    chatbotDiv.innerHTML = `                       // Muestra saludo temporal
      <h5 style="color:#ff4444; margin-bottom: 0.75rem;">Tattoo & Art Bot</h5>
      <p style="font-size: 1.2rem; font-weight: 600;">${greetingText}</p>
    `;

    setTimeout(() => {                             // Espera 1.5 segundos
      chatbotDiv.innerHTML = originalContent;      // Restaura contenido

      const closeBtn = document.getElementById("btnCerrar"); // Botón cerrar
      const agendBtn = document.getElementById("btnAgendar"); // Botón agendar

      if (closeBtn) {                              // Si existe botón cerrar
        closeBtn.addEventListener("click", () => { // Evento cerrar
          chatbotDiv.style.display = "none";       // Oculta chatbot
          btn.style.display = "flex";              // Muestra botón flotante
        });
      }

      if (agendBtn) {                              // Si existe botón agendar
        agendBtn.addEventListener("click", () => { // Evento agendar
          const whatsappNumber = "56912345678";    // Número de WhatsApp
          const message = encodeURIComponent("Hola Tattoo & Art, quiero agendar una hora."); // Mensaje
          const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`; // URL completa
          window.open(whatsappUrl, "_blank");      // Abre WhatsApp
        });
      }
    }, 1500);                                      // Tiempo del saludo
  };

  // -----------------------------
  // ACTIVAR CHATBOT
  // -----------------------------

  btn.addEventListener("click", showGreeting); // Abre chatbot al hacer clic

  // -----------------------------
  // BOTÓN EXTERNO PARA ABRIR CHATBOT
  // -----------------------------

  const reserveChatBtn = document.getElementById("btnReservaChat"); // Botón externo

  if (reserveChatBtn) {                                             // Si existe
    reserveChatBtn.addEventListener("click", (event) => {           // Evento clic
      event.preventDefault();                                       // Evita recarga
      showGreeting();                                               // Abre chatbot
    });
  }

  // -----------------------------
  // FORMULARIO DE CONTACTO
  // -----------------------------

  const contactForm = document.getElementById("contactForm");       // Formulario
  const contactStatus = document.getElementById("contactStatus");   // Estado

  if (contactForm) {                                                // Si existe
    contactForm.addEventListener("submit", async (event) => {       // Evento enviar
      event.preventDefault();                                       // Evita recarga
      if (!contactStatus) return;                                   // Si no hay estado, termina

      contactStatus.textContent = "Enviando mensaje...";            // Mensaje de carga

      const formData = new FormData(contactForm);                   // Obtiene datos
      const payload = {                                             // Crea objeto
        name: formData.get("name"),                                 // Nombre
        email: formData.get("email"),                               // Email
        message: formData.get("message"),                           // Mensaje
      };

      try {                                                         // Intenta enviar
        const response = await fetch("/api/contact", {              // Petición POST
          method: "POST",
          headers: { "Content-Type": "application/json" },          // Envía JSON
          body: JSON.stringify(payload),                            // Convierte a JSON
        });

        const result = await response.json();                       // Respuesta JSON

        if (!response.ok) {                                         // Si hubo error
          contactStatus.textContent = result.error || "Error al enviar el mensaje.";
          return;
        }

        contactStatus.textContent = "¡Mensaje enviado! Nos contactaremos pronto."; // Éxito
        contactForm.reset();                                        // Limpia formulario

      } catch (error) {                                             // Error en petición
        contactStatus.textContent = "No se pudo enviar el mensaje. Intenta nuevamente más tarde.";
      }
    });
  }

  // -----------------------------
  // FORMULARIO DE SUBIDA DE IMÁGENES
  // -----------------------------

  const uploadForm = document.getElementById("uploadForm");         // Formulario
  const uploadStatus = document.getElementById("uploadStatus");     // Estado
  const uploadPreview = document.getElementById("uploadPreview");   // Vista previa

  if (uploadForm) {                                                 // Si existe
    uploadForm.addEventListener("submit", async (event) => {        // Evento enviar
      event.preventDefault();                                       // Evita recarga
      if (!uploadStatus) return;                                    // Si no hay estado, termina

      uploadStatus.textContent = "Subiendo archivo...";             // Mensaje de carga
      uploadPreview.innerHTML = "";                                 // Limpia vista previa

      const fileInput = document.getElementById("uploadFile");      // Input archivo

      if (!fileInput || !fileInput.files || fileInput.files.length === 0) { // Si no hay archivo
        uploadStatus.textContent = "Por favor selecciona una imagen.";      // Error
        return;
      }

      const formData = new FormData();                              // Crea FormData
      formData.append("file", fileInput.files[0]);                  // Agrega archivo

      try {                                                         // Intenta subir
        const response = await fetch("/api/upload", {               // Petición POST
          method: "POST",
          body: formData,                                           // Envía FormData
        });

        const result = await response.json();                       // Respuesta JSON

        if (!response.ok) {                                         // Si hubo error
          uploadStatus.textContent = result.error || "Error al subir el archivo.";
          return;
        }

        uploadStatus.textContent = "¡Archivo subido con éxito!";    // Éxito
        uploadPreview.innerHTML = `                                 // Vista previa
          <p class="text-light-50">Archivo disponible en:
            <a href="${result.url}" target="_blank">${result.url}</a>
          </p>
          <img src="${result.url}" class="img-fluid rounded shadow" alt="Vista previa de archivo subido">
        `;

        uploadForm.reset();                                         // Limpia formulario

      } catch (error) {                                             // Error en petición
        uploadStatus.textContent = "No se pudo subir el archivo. Intenta nuevamente más tarde.";
      }
    });
  }
});
