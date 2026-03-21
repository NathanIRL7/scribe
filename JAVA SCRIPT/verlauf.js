const listeEl = document.getElementById("liste");
const leerEl = document.getElementById("leer");

document.addEventListener("DOMContentLoaded", async function () {
    const { data: { user } } = await window.supabase.auth.getUser();
    if(!user) {
        window.location.href = "auth.html";
        return;
    }

    const { data, error } = await window.supabase
    .from("generierte_emails")
    .select("id, empfaenger, firma, thema, typ, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false } )
    .limit(20);

  if (error) {
    listeEl.innerHTML = "<p class='fehler'>" + error.message + "</p>";
    return;
  }

  if (!data || data.length === 0) {
    leerEl.style.display = "block";
    return;
  }

  if (!data || data.lenght === 0) {
    leerEl.style.display = "block";
    return;
  }

  listeEl.innerHTML = data.map(function (row) {
    const datum = new Date(row.created_at).toLocaleDateString("de-DE")
    return "<div class='tool-card' style='margin-bottom:1rem;'><strong>" + (row.empfaenger || "?") + "</strong> - " + (row.firma || "") + "<br><small>" + datum + " . " + (row.typ || "")+ "</small><div>";
  }).join("");
});