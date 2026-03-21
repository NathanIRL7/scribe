// Dashboard – prüft ob User eingeloggt ist, zeigt E-Mail, Logout

document.addEventListener("DOMContentLoaded", async function () {
  const userEmailEl = document.getElementById("user-email");
  const logoutBtn = document.getElementById("logout-btn");
  const chatToggle = document.getElementById("chat-toggle");
  const chatPanel = document.getElementById("chat-panel");
  const chatClose = document.getElementById("chat-close");
  const chatOverlay = document.getElementById("chat-overlay");

  function toggleChat() {
    if(chatPanel) chatPanel.classList.toggle("open");
  }

  function closeChat() {
    if(chatPanel) chatPanel.classList.remove("open");
  }
  
  if (chatToggle && chatPanel) {
    chatToggle.addEventListener("click", function (){
      chatPanel.classList.toggle("open");
    });
  }
  if(chatClose) chatClose.addEventListener("click",closeChat);
  if(chatOverlay) chatOverlay.addEventListener("click",closeChat);
  try {
    const { data: { user } } = await window.supabase.auth.getUser();

    if (!user) {
      window.location.href = "auth.html";
      return;
    }

    userEmailEl.textContent = user.email;
  } catch (err) {
    console.error(err);
    window.location.href = "auth.html";
  }

  logoutBtn.addEventListener("click", async function () {
    await window.supabase.auth.signOut();
    window.location.href = "index.html";
  });

  // Aktive Sidebar: welche Seite im iframe angezeigt wird
  const appFrame = document.getElementById("app-frame");
  function syncActiveFromIframe() {
    if (!appFrame) return;
    try {
      const url = appFrame.contentWindow.location.href || "";
      const file = (url.split("/").pop() || "").split("?")[0] || "";
      document.querySelectorAll(".sidebar-link").forEach(function (link) {
        link.classList.remove("active");
        const href = (link.getAttribute("href") || "").split("/").pop() || "";
        if (href === file) link.classList.add("active");
      });
    } catch (e) {
      /* z.B. file:// */
    }
  }
  if (appFrame) {
    appFrame.addEventListener("load", syncActiveFromIframe);
    setTimeout(syncActiveFromIframe, 0);
  }
});
