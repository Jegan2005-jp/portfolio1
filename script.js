const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = siteNav ? [...siteNav.querySelectorAll("a")] : [];
const sectionLinks = [...document.querySelectorAll("[data-section-link]")];
const sections = [...document.querySelectorAll("section[data-section]")];
const revealSections = [...document.querySelectorAll(".reveal")];
const interactiveCards = [...document.querySelectorAll(".interactive-card")];
const skillChips = [...document.querySelectorAll(".skill-chip")];
const skillHint = document.getElementById("skillHint");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    siteNav?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const photo = document.getElementById("profilePhoto");
if (photo) {
  photo.addEventListener("error", () => {
    photo.classList.add("has-error");
  });
}

const typedPrefix = document.getElementById("typedPrefix");
const typedName = document.getElementById("typedName");
const typedCursor = document.getElementById("typedCursor");

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function runTypingOnce() {
  if (!typedPrefix || !typedName || !typedCursor) return;

  const prefixHtml = typedPrefix.getAttribute("data-text") || "";
  const prefixText = prefixHtml.replaceAll("&rsquo;", "’").replaceAll("&amp;", "&");
  const nameText = typedName.getAttribute("data-text") || "";

  if (prefersReducedMotion()) {
    typedPrefix.textContent = prefixText;
    typedName.textContent = nameText;
    typedCursor.classList.add("done");
    return;
  }

  typedPrefix.textContent = "";
  typedName.textContent = "";

  const full = prefixText + nameText;
  const prefixLen = prefixText.length;
  let i = 0;

  const stepMs = 42; // smooth, professional speed
  const timer = setInterval(() => {
    i += 1;
    const current = full.slice(0, i);
    typedPrefix.textContent = current.slice(0, Math.min(prefixLen, current.length));
    typedName.textContent = current.length > prefixLen ? current.slice(prefixLen) : "";

    if (i >= full.length) {
      clearInterval(timer);
      setTimeout(() => typedCursor.classList.add("done"), 500);
    }
  }, stepMs);
}

window.addEventListener("DOMContentLoaded", runTypingOnce, { once: true });

interactiveCards.forEach((card) => {
  const toggleCard = () => card.classList.toggle("active");
  card.addEventListener("click", toggleCard);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleCard();
    }
  });
});

skillChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    skillChips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    const description = chip.getAttribute("data-skill-desc") || "";
    if (skillHint) skillHint.textContent = `${chip.textContent} -> ${description}`;
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.14 }
);

revealSections.forEach((section) => revealObserver.observe(section));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("data-section");
      sectionLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("data-section-link") === id);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0.1 }
);

sections.forEach((section) => sectionObserver.observe(section));
