// Ediciones: rejilla de carteles; al pulsar, la información completa en una ventana.
(function () {
  var eds = Array.prototype.slice.call(document.querySelectorAll('.edicion'));
  var dialogo = document.getElementById('dialogo-edicion');
  if (!eds.length || !dialogo) return;
  var hueco = dialogo.querySelector('.dialogo-contenido');
  var abierta = null;

  function abrir(ed, cambiarUrl) {
    cerrar(false);
    var det = ed.querySelector('.ed-detalle');
    det.hidden = false;
    hueco.appendChild(det);
    dialogo.style.setProperty('--color-ed', ed.style.getPropertyValue('--color-ed'));
    abierta = ed;
    if (dialogo.showModal) dialogo.showModal(); else dialogo.setAttribute('open', '');
    dialogo.scrollTop = 0;
    if (cambiarUrl !== false && history.replaceState) history.replaceState(null, '', '#' + ed.id);
  }
  function cerrar(cambiarUrl) {
    if (!abierta) return;
    var det = hueco.querySelector('.ed-detalle');
    if (det) { det.hidden = true; abierta.appendChild(det); }
    var ed = abierta; abierta = null;
    if (dialogo.open) dialogo.close();
    if (cambiarUrl !== false && history.replaceState) history.replaceState(null, '', location.pathname + '#festival');
    ed.querySelector('.ed-abrir').focus();
  }
  eds.forEach(function (ed) { ed.querySelector('.ed-abrir').addEventListener('click', function () { abrir(ed); }); });
  dialogo.querySelector('.cerrar').addEventListener('click', function () { cerrar(); });
  dialogo.addEventListener('close', function () { if (abierta) cerrar(); });
  dialogo.addEventListener('click', function (e) { if (e.target === dialogo) cerrar(); });
  // Enlaces internos dentro de la ficha (#fqi, #formacion…) cierran la ventana
  dialogo.addEventListener('click', function (e) { var en = e.target.closest && e.target.closest('a[href^="#"]'); if (en) cerrar(false); });

  function desdeUrl() {
    var el = location.hash && document.getElementById(location.hash.slice(1));
    if (el && el.classList.contains('edicion')) { document.getElementById('festival').scrollIntoView(); abrir(el, false); }
  }
  window.addEventListener('hashchange', desdeUrl);
  desdeUrl();
})();
