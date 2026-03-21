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
  if (kontakte && kontakte.length > 0) {
    kontakte.forEach(function (k) {
      const opt = document.createElement("option");
      opt.value = k.id;
      opt.textContent = (k.name || "?") + (k.firma ? " – " + k.firma : "");
      opt.dataset.name = k.name || "";
      opt.dataset.firma = k.firma || "";
      select.appendChild(opt);
    });
    select.addEventListener("change", function () {
      const opt = select.options[select.selectedIndex];
      if (opt.value) {
        document.getElementById("empfaenger").value = opt.dataset.name || "";
        document.getElementById("firma").value = opt.dataset.firma || "";
      }
    });
  }
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  fehlerEl.textContent = "";
  btn.disabled = true;
  btn.textContent = "Generiert...";

  const empfaenger = document.getElementById("empfaenger").value;
  const firma = document.getElementById("firma").value;
  const thema = document.getElementById("thema").value;

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
      ausfuehrlich: "ausführlich und detailliert"
    };
    const stilBeschreibung = stilText[stil] || stilText.locker;
    const zusaetzlich = beschreibung ? " " + beschreibung : "";

    const email = `Hallo ${empfaenger},\n\n` +
      `ich habe von ${firma || "Ihrem Unternehmen"} gehört und würde gerne mit dir in Kontakt treten.\n\n` +
      `${thema}\n\n` +
      `Ich schreibe normalerweise ${stilBeschreibung}.${zusaetzlich}${signatur}`;

    emailText.textContent = email;
    ergebnisBox.style.display = "block";

    const { error: insertError } = await window.supabase.from("generierte_emails").insert({
      user_id: user.id,
      empfaenger,
      firma,
      thema,
      email_text: email,
      typ: "kalt"
    });
    if (insertError) throw insertError;
  } catch (err) {
    fehlerEl.textContent = err.message || "Fehler beim Generieren";
  }

  btn.disabled = false;
  btn.textContent = "E-Mail generieren";
});

kopierenBtn.addEventListener("click", function () {
  const text = emailText.textContent;
  navigator.clipboard.writeText(text).then(function () {
    kopierenBtn.textContent = "Kopiert!";
    setTimeout(function () { kopierenBtn.textContent = "In Zwischenablage kopieren"; }, 2000);
  });
});
