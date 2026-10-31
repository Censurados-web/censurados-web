// Menú desplegable en móvil
(function () {
  var boton = document.querySelector('.boton-menu');
  var menu = document.getElementById('menu');
  if (!boton || !menu) return;
  boton.addEventListener('click', function () {
    var abierto = menu.classList.toggle('abierto');
    boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    boton.textContent = abierto ? 'Cerrar' : 'Menú';
  });
})();
