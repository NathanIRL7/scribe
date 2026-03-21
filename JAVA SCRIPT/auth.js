const form = document.getElementById("form");
const titel = document.getElementById("titel");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const fehlerEl = document.getElementById("fehler");
const btn = document.getElementById("btn");
const umschalter = document.getElementById("umschalter");

let istLogin = true;

//Nach Aktivierungs-Link : Supabase schickt User hierher mit Token in der URL.
//Session wiederherstellen und zum Dashboard weiterleiten.
document.addEventListener("DOMContentLoaded", async function () {
  if (!window.supbase || ! window.supabase.auth) return;
  try {
    const { data: { user } } = await window.supabase.auth.getSession();
    if (session) {
      window.location.href = "dashboard.html";
    }
  } catch (_) {}
});

umschalter.addEventListener("click", function () {
  istLogin = !istLogin;
  titel.textContent = istLogin ? "Login" : "Registrieren";
  btn.textContent = istLogin ? "Einloggen" : "Konto erstellen";
  umschalter.textContent = istLogin ? "Noch kein Konto? Registrieren" : "Schon ein Konto? Login";
  fehlerEl.textContent = "";
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  fehlerEl.textContent = "";
  btn.disabled = true;
  btn.textContent = "Lädt...";

  if (!window.supabase || !window.supabase.auth) {
    fehlerEl.textContent = "Supabase nicht bereit. Bitte URL und Key in supabase-config.js eintragen (von supabase.com → Projekt → Settings → API).";
    btn.disabled = false;
    btn.textContent = istLogin ? "Einloggen" : "Konto erstellen";
    return;
  }

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    if (istLogin) {
      const { error } = await window.supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = "dashboard.html";
    } else {
      const { error } = await window.supabase.auth.signUp({ email, password });
      if (error) throw error;
      fehlerEl.textContent = "";
      form.innerHTML = "<p style='color:green'>Check deine E-Mail! Klick auf den Link zur Aktivierung.</p>";
    }
  } catch (err) {
    fehlerEl.textContent = err.message;
    let msg = err.message;
    if (msg === "Invalid login credentials") {
      msg = "Falsche E-Mail oder Passwort. Hast du schon ein Konto? Klicke auf „Registrieren“.Nach der Registrierung: Prüfe deine E-Mail und klicke den Aktievierungs-Link:";
    }
    fehlerEl.textConent = msg;
  }

  btn.disabled = false;
  btn.textContent = istLogin ? "Einloggen" : "Konto erstellen";
});
