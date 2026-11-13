/* ============================================================
   VideoSite — app.js
   Carga la lista de videos desde /api/videos y gestiona la
   reproducción al hacer clic en el sidebar.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const videoList = document.getElementById('video-list');
  const main = document.getElementById('main');

  fetch('/api/videos')
    .then(response => response.json())
    .then(videos => {
      if (videos.length === 0) {
        const msg = document.createElement('li');
        msg.className = 'empty-message';
        msg.textContent = 'No hay videos disponibles';
        videoList.appendChild(msg);
        return;
      }

      videos.forEach(video => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = video.name;

        a.addEventListener('click', (e) => {
          e.preventDefault();
          playVideo(video, li);
        });

        li.appendChild(a);
        videoList.appendChild(li);
      });
    })
    .catch(() => {
      const msg = document.createElement('li');
      msg.className = 'empty-message';
      msg.textContent = 'Error al cargar los videos';
      videoList.appendChild(msg);
    });

  /**
   * Reproduce el video seleccionado en el área principal.
   * - Elimina el placeholder si existe.
   * - Reutiliza el elemento <video> existente o crea uno nuevo.
   * - Resalta el ítem activo en el sidebar.
   * @param {{ name: string, filename: string }} video
   * @param {HTMLElement} activeLi
   */
  function playVideo(video, activeLi) {
    // Eliminar el placeholder si todavía está presente
    const placeholder = document.getElementById('placeholder');
    if (placeholder) {
      placeholder.remove();
    }

    // Resaltar el ítem activo (quitar clase de cualquier otro)
    const allItems = videoList.querySelectorAll('li');
    allItems.forEach(li => li.classList.remove('active'));
    activeLi.classList.add('active');

    // Reutilizar el <video> existente o crear uno nuevo
    let player = document.getElementById('video-player');
    if (!player) {
      player = document.createElement('video');
      player.id = 'video-player';
      player.controls = true;
      main.appendChild(player);
    }

    // El campo filename ya viene URL-encoded desde el backend;
    // no aplicar encodeURIComponent para evitar doble codificación.
    player.src = '/videos/' + video.filename;
    player.play().catch(() => {
      // El navegador puede bloquear autoplay; los controles nativos
      // permiten al usuario iniciar la reproducción manualmente.
    });
  }
});
