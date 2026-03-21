const form = document.getElementById("form");
const fehlerEl = document.getElementById("fehler");
const btn = document.getElementById("btn");
const ergebnisBox = document.getElementById("ergebnis");
const emailText = document.getElementById("email-text");
const kopierenBtn = document.getElementById("kopieren");

document.addEventListener("DOMContentLoaded", async function () {
    const { data: { user } } = await window.supabase.auth.getUser();
    if (!user) {
        window.location.href = "auth.html";
        return;
    }
    const { data: kontakte } = await window.supabase.from("kontakte").select("*").eq("user_id", user.id).order("name");
    const select = document.getElementById("kontakt-auswahl");
    if (kontakte && kontakte.length > 0 ) {
        kontakte.forEach(function (k)  {
            const opt = document.createElement("option");
            opt.value = k.id;
            opt.textContent = (k.name || "?") + (k.firma ? " - " + k.firma : "");
            opt.dataset.name = k.name || "";
            opt.dataset.firma = k.firma || "";
            select.appendChild(opt);
        });
        select.addEventListener("change", function () {
            const opt = select.options[select.selectedIndex];
            if(opt.value) {
                document.getElementById("empfänger").value = opt.dataset.name || "";
                document.getElementById("unternehmen").value = opt.dataset.firma || "";
            }
        });
    }
});

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    fehlerEl.textContent = "";
    btn.disabled = true;
    btn.textContent = "Generiert...";

    const empfänger = document.getElementById("empfänger").value;
    const firma = document.getElementById("unternehmen").value;
    const bezug = document.getElementById("bezug").value;
    const nachfrage = document.getElementById("nachfrage").value;

    try {
        const { data: { user } } = await window.supabase.auth.getUser();
        if (!user) {
            window.location.href = "auth.html";
            return;
    }
    const { data: stilData } = await window.supabase.from("schreibstil").select("*").eq("user_id", user.id).maybeSingle();
    const stil = stilData?.stil || "locker";
    const beschreibung = stilData?.beschreibung || "";

    const { data: profilData } = await window.supabase.from("user_profil").select("*").eq("user_id", user.id).maybeSingle();
    const signatur = profilData?.name ? "\n\nViele Grüße\n" + profilData.name : "\n\nViele Grüße";

    const stilText = {
        locker: "freundlich und locker",
        formell: "formell und professionell",
        kurz: "kurz und präzise",
        ausführlich: "ausführlich und detailliert"
    };
    const stilBeschreibung = stilText[stil] || stilText.locker;
    const zustätzlich = beschreibung ? " " + beschreibung : "";

    const bezugsText = bezug ? "wegen des Bezugs  " + bezug + "." : ".";
    const email = `Hallo ${empfänger},\n\n` +
      `ich habe vor Kurzem geschrieben${bezugsText}\n\n` +
      `ich schreibe normalerweise ${stilBeschreibung}.${zustätzlich}${signatur}`;

    emailText.textContent = email;
    ergebnisBox.style.display = "block";

    const { error: insertError } = await window.supabase.from("generierte_emails").insert({
        user_id: user.id,
        empfaenger: empfänger,
        firma,
        thema: nachfrage, 
        email_text: email,
        typ: "follow-up"
    });
    if (insertError) throw insertError;
  } catch (err) {
    fehlerEl.textContent = err.message || "Fehler beim Generieren";
  }

  btn.disabled = false;
  btn.textContent = "Follow-up generieren";
});

kopierenBtn.addEventListener("click", function () {
    const text = emailText.textContent;
    navigator.clipboard.writeText(text).then(function () {
        kopierenBtn.textContent = "Kopiert!";
        setTimeout(function () { kopierenBtn.textContent = "In Zwischenablage kopieren"; }, 2000);
    });
});