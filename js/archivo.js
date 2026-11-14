// Archivo vivo: buscador, filtros y ficha del caso en una ventana.
(function () {
  var fichas = Array.prototype.slice.call(document.querySelectorAll('.ficha-archivo'));
  if (!fichas.length) return;
  // Siempre de la edición más reciente a la más antigua (manteniendo el orden dentro de cada edición)
  fichas = fichas.map(function (li, i) { return { li: li, i: i }; })
    .sort(function (a, b) { return (b.li.dataset.ed - a.li.dataset.ed) || (a.i - b.i); })
    .map(function (o) { return o.li; });
  var lista = fichas[0].parentNode;
  fichas.forEach(function (li) { lista.appendChild(li); });
  var busca = document.getElementById('busca');
  var fAnio = document.getElementById('filtro-anio');
  var fPais = document.getElementById('filtro-pais');
  var contador = document.getElementById('contador');
  var vacio = document.getElementById('sin-resultados');
  var dialogo = document.getElementById('dialogo-caso');
  var hueco = dialogo.querySelector('.dialogo-contenido');
  var abierto = null;

  function normal(t) {
    return (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function filtrar() {
    var q = normal(busca.value).trim().split(/\s+/).filter(Boolean);
    var a = fAnio.value, p = normal(fPais.value);
    var n = 0;
    fichas.forEach(function (li) {
      var texto = normal(li.dataset.texto);
      var ok = q.every(function (w) { return texto.indexOf(w) !== -1; }) &&
               (!a || li.dataset.anio === a) &&
               (!p || normal(li.dataset.pais).indexOf(p) !== -1);
      li.hidden = !ok;
      if (ok) n++;
    });
    contador.textContent = n === fichas.length ? fichas.length + ' películas' : n + ' de ' + fichas.length + ' películas';
    vacio.hidden = n > 0;
  }

  function abrir(li, cambiarUrl) {
    cerrar(false);
    var caso = li.querySelector('.caso');
    caso.hidden = false;
    hueco.appendChild(caso);          // se mueve (no se copia) para conservar los botones de compartir
    abierto = li;
    if (dialogo.showModal) dialogo.showModal(); else dialogo.setAttribute('open', '');
    if (cambiarUrl !== false && history.replaceState) history.replaceState(null, '', '#' + li.id);
  }

  function cerrar(cambiarUrl) {
    if (!abierto) return;
    var caso = hueco.querySelector('.caso');
    if (caso) { caso.hidden = true; abierto.appendChild(caso); }
    var li = abierto; abierto = null;
    if (dialogo.open) dialogo.close();
    if (cambiarUrl !== false && history.replaceState) history.replaceState(null, '', location.pathname + '#archivo');
    li.querySelector('.abrir-caso').focus();
  }

  fichas.forEach(function (li) {
    li.querySelector('.abrir-caso').addEventListener('click', function () { abrir(li); });
  });
  dialogo.querySelector('.cerrar').addEventListener('click', function () { cerrar(); });
  dialogo.addEventListener('close', function () { if (abierto) cerrar(); });
  dialogo.addEventListener('click', function (e) { if (e.target === dialogo) cerrar(); });
  // Un enlace interno dentro del caso (p. ej. #testimonios) cierra la ventana y lleva a esa sección
  dialogo.addEventListener('click', function (e) { var en = e.target.closest && e.target.closest('a[href^="#"]'); if (en) cerrar(false); });

  [busca, fAnio, fPais].forEach(function (el) { el.addEventListener('input', filtrar); });
  filtrar();

  // Enlaces compartidos (#nombre-de-la-pelicula) abren directamente el caso
  function desdeUrl() {
    var id = location.hash.slice(1);
    var li = id && document.getElementById(id);
    if (li && li.classList.contains('ficha-archivo')) {
      document.getElementById('archivo').scrollIntoView();
      abrir(li, false);
    }
  }
  window.addEventListener('hashchange', desdeUrl);
  desdeUrl();
})();
