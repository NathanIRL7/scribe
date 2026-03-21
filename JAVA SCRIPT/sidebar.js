//Sidebar - Toggle ein-/ausklappen, aktive Seite setzen
//Nutze: <body> data-page="dashboard"> oder data-page="profil" etc.

document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const appWrap = document.body;

    if ( sidebar && sidebarToggle && appWrap) {
        sidebarToggle.addEventListener("click", function () {
            sidebar.classList.toggle("collapsed");
            appWrap.classList.toggle("sidebar-collapsed", sidebar.classList.contains("collapsed"));
            const icon = sidebarToggle.querySelector("i");
            if (icon) {
                icon.setAttribute("data-lucide", sidebar.classList.contains("collapsed") ? "panel-left-open" : "panel-left-close");
                if (typeof lucide !== "undefined") lucide.createIcons();
            }
        });
    }

    // Aktive Seite markieren (nicht wenn Dashboard iframe die Navigation steuert)
    if (document.getElementById("app-frame")) return;

    const page = appWrap.getAttribute("data-page");
    if (page) {
        document.querySelectorAll(".sidebar-link").forEach(function (link) {
            link.classList.remove("active");
            const href = link.getAttribute("href") || "";
            if (href.indexOf(page) !== -1) link.classList.add("active");
        });
    }
});