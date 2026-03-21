const form = document.getElementById("form");
const fehlerEl = document.getElementById("fehler");
const btn = document.getElementById("btn");
const listeEl = document.getElementById("liste");
const leerEl = document.getElementById("leer");

async function kontakteLaden() {
    const { data: { user } } = await window.supabase.auth.getUser();
    if (!user) return;

    const { data } = await window.supabase
    .from("kontakte")
    .select("*")
    .eq("user_id", user.id)
    .order("name");
    
  if (!data || data.length === 0) {
    leerEl.style.display = "block";
    return;
  }

  leerEl.style.display = "none";
  listeEl.innerHTML = data.map(function (k) {
    return "<div class='kontakt-card'><span><strong>" + (k.name || "?") + "</strong> - " + (k.firma || "") + (k.email ? " (" + k.email + ")" : "") + "</span> <button type='button' class='btn-loeschen' data-id='" + k.id + "'>Löschen</button></div>";
  }).join("");

  document.querySelectorAll(".btn-loeschen").forEach(function (b) {
    b.addEventListener("click", async function () {
        loeschen(b.dataset.id);
    });
  });
}

async function loeschen(id) {
    const { error } = await window.supabase.from("kontakte").delete().eq("id", id);
    if (!error) kontakteLaden();
}

document.addEventListener("DOMContentLoaded", async function () {
    const { data: { user } } = await window.supabase.auth.getUser();
    if (!user) {
        window.location.href = "auth.html";
        return;
    }
    kontakteLaden();
});

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    fehlerEl.textContent = "";
    btn.disabled = true;

    const name = document.getElementById("name").value.trim();
    const firma = document.getElementById("firma").value.trim();
    const email = document.getElementById("email").value.trim();

    try {
        const { data: { user } }  = await window.supabase.auth.getUser();
        if (!user) {
            window.location.href = "auth.html";
            return;
        }
        const { error } = await window.supabase.from("kontakte").insert({
            user_id: user.id,
            name,
            firma: firma || null, 
            email: email || null 
        });
        if (error) throw error;
        document.getElementById("name").value = "";
        document.getElementById("firma").value = "";
        document.getElementById("email").value = "";
        kontakteLaden();
    }   catch (err) {
        fehlerEl.textContent = err.message || "Fehler beim Hinzufügen";
    } 

    btn.disabled = false;   
});