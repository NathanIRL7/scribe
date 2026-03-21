const form = document.getElementById("form");
const fehlerEl = document.getElementById("fehler");
const btn = document.getElementById("btn");

document.addEventListener("DOMContentLoaded", async function () {
    const { data: { user } } = await window.supabase.auth.getUser();
    if(!user) {
        window.location.href = "auth.html";
        return;
    }
    const { data } = await window.supabase.from("user_profil").select("*").eq("user_id", user.id).maybeSingle();
    if ( data ) {
        document.getElementById("name").value = data.name || "";
        document.getElementById("firma").value = data.firma || "";
        document.getElementById("rolle").value = data.rolle || "";
    }
});

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    fehlerEl.textContent = "";
    btn.disabled = true;
    btn.textContent = "Speichert...";

    const name = document.getElementById("name").value;
    const firma = document.getElementById("firma").value;
    const rolle = document.getElementById("rolle").value;

    try {
        const { data: { user }} = await window.supabase.auth.getUser();
        if(!user) {
            window.location.href = "auth.html";
            return;
        }
        const { error } = await window.supabase.from("user_profil").upsert(
            { user_id: user.id, name, firma, rolle },
            { onConflict: "user_id" }
        );
        if(error) throw error;
        window.location.href = "dashboard.html";
    }   catch (err) {
        fehlerEl.textContent = err.message || "Fehler beim Speichern";
    }

    btn.disabled = false;
    btn.textContent = "Speichern";
});
    

