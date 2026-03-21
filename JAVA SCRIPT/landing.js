// Landing – wenn schon eingeloggt, direkt zum Dashboard

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const { data: { user } } = await window.supabase.auth.getUser();
    if (user) {
      window.location.href = "dashboard.html";
    }
  } catch (err) {
    console.error(err);
  }
});
