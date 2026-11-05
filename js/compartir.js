// Botones de compartir del archivo vivo: copia el enlace o usa el menú del móvil.
(function () {
  document.querySelectorAll('.compartir').forEach(function (caja) {
    var url = caja.dataset.url;
    var titulo = caja.dataset.titulo;
    var boton = caja.querySelector('.copiar');
    if (!boton) return;

    // En móviles con menú de compartir nativo, el botón lo abre.
    if (navigator.share) {
      boton.textContent = 'Compartir…';
      boton.addEventListener('click', function () {
        navigator.share({ title: titulo, url: url }).catch(function () {});
      });
      return;
    }

    boton.addEventListener('click', function () {
      var hecho = function () {
        boton.textContent = 'Enlace copiado';
        setTimeout(function () { boton.textContent = 'Copiar enlace'; }, 2000);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(hecho, function () { window.prompt('Copia este enlace:', url); });
      } else {
        window.prompt('Copia este enlace:', url);
      }
    });
  });
})();
