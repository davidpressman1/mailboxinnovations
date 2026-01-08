// main.js

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Reveal on scroll
const els = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("in");
  });
}, { threshold: 0.12 });
els.forEach(el => io.observe(el));

// Load content.json and hydrate anything with data-k / data-k-html
(async function hydrate(){
  try{
    const res = await fetch("content.json", { cache: "no-store" });
    if(!res.ok) return;
    const data = await res.json();

    const get = (path) => {
      return path.split(".").reduce((acc, key) => {
        if (acc == null) return undefined;
        // array support
        if (key.match(/^\d+$/)) return acc[Number(key)];
        return acc[key];
      }, data);
    };

    document.querySelectorAll("[data-k]").forEach(el => {
      const v = get(el.getAttribute("data-k"));
      if (typeof v === "string") el.textContent = v;
    });

    document.querySelectorAll("[data-k-html]").forEach(el => {
      const v = get(el.getAttribute("data-k-html"));
      if (typeof v === "string") el.innerHTML = v;
    });
  } catch (e) {
    // ignore if content.json not present
  }
})();

// Send animation: FULL preview folds → flies into mailbox → reset
(function(){
  const btn = document.getElementById("sendBtn");
  const stage = document.getElementById("sendStage");
  const preview = document.getElementById("previewFrame");

  const RESET_MS = 10000;

  if(!btn || !stage || !preview) return;

  btn.addEventListener("click", () => {
    if(stage.classList.contains("is-sending")) return;

    stage.classList.add("is-sending");

    window.setTimeout(() => {
      stage.classList.remove("is-sending");

      // Force-clear lingering animation states (Safari/Chrome can stick sometimes)
      preview.style.animation = "none";
      void preview.offsetHeight;
      preview.style.animation = "";

      const body = preview.querySelector(".preview-body");
      if(body){
        body.style.animation = "none";
        void body.offsetHeight;
        body.style.animation = "";
        body.style.opacity = "";
        body.style.transform = "";
      }
    }, RESET_MS);
  });
})();
