// Am Ende von <body> einbinden. Entfernt Sidebar/Header, wenn Seite im Dashboard-iframe läuft.
(function () {
  if (window.self === window.top) return;
  document.documentElement.classList.add("spa-embed");
  var aside = document.getElementById("sidebar");
  var hdr = document.querySelector(".header");
  if (aside) aside.remove();
  if (hdr) hdr.remove();
  document.body.classList.remove("app-with-sidebar", "sidebar-collapsed");
  document.querySelectorAll(".page-content, .main").forEach(function (el) {
    el.style.marginLeft = "0";
    el.style.maxWidth = "100%";
  });

  // „Zurück zum Dashboard“ darf nicht dashboard.html im iframe laden (Dashboard im Dashboard).
  // Stattdessen: nur den iframe auf Home setzen.
  document.querySelectorAll('a[href="dashboard.html"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var frame = window.top.document.getElementById("app-frame");
      if (frame) {
        frame.src = "home.html";
      } else {
        window.top.location.href = "dashboard.html";
      }
    });
  });
})();
