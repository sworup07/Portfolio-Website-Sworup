/* ============================================================
   utils.js — HELPER FUNCTIONS
   Small reusable tools used by other files.
   If you need a new helper, add it here — not in other files.
   ============================================================ */


/* ========================= SMOOTH SCROLL ========================= */
/* Scrolls to any section by its HTML id.
   Renamed from scrollTo() — the old name conflicted with window.scrollTo() */
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}


/* ========================= FORM ERROR ========================= */
/* Marks an input as invalid and shows an error message below it */
function showError(input, id, msg) {
  input.classList.add("error");
  document.getElementById(id).textContent = msg;
}
