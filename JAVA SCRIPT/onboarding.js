const form = document.getElementById("form");
const fehlerEl = document.getElementById("fehler");
const btn = document.getElementById("btn");

document.addEventListener("DOMContentLoaded", async function () {
  const { data: { user } } = await window.supabase.auth.getUser();
  if (!user) {
    window.location.href = "auth.html";
    return;
  }
  const { data } = await window.supabase.from("schreibstil").select("*").eq("user_id", user.id).maybeSingle();
  if (data) {
    document.getElementById("stil").value = data.stil || "locker";
    document.getElementById("beschreibung").value = data.beschreibung || "";
  }
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  fehlerEl.textContent = "";
  btn.disabled = true;
  btn.textContent = "Speichert...";

  const stil = document.getElementById("stil").value;
  const beschreibung = document.getElementById("beschreibung").value;

  try {
    const { data: { user } } = await window.supabase.auth.getUser();
    if (!user) {
      window.location.href = "auth.html";
      return;
    }
    const { error } = await window.supabase.from("schreibstil").upsert(
      { user_id: user.id, stil, beschreibung },
      { onConflict: "user_id" }
    );
    if (error) throw error;
    window.location.href = "dashboard.html";
  } catch (err) {
    fehlerEl.textContent = err.message || "Fehler beim Speichern";
  }

  btn.disabled = false;
  btn.textContent = "Speichern";
});
