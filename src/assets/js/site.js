const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.focus();
    }
  });
}

const filterForm = document.querySelector("[data-event-filters]");

if (filterForm) {
  const cards = Array.from(document.querySelectorAll("[data-event-card]"));
  const sections = Array.from(document.querySelectorAll("[data-event-section]"));

  const applyFilters = () => {
    const formData = new FormData(filterForm);
    const search = String(formData.get("search") || "").trim().toLowerCase();
    const category = String(formData.get("category") || "");
    const month = String(formData.get("month") || "");

    cards.forEach((card) => {
      const matchesSearch = !search || card.dataset.search.includes(search);
      const matchesCategory = !category || card.dataset.category === category;
      const matchesMonth = !month || card.dataset.month === month;
      const isVisible = matchesSearch && matchesCategory && matchesMonth;

      card.hidden = !isVisible;
    });

    sections.forEach((section) => {
      const visibleCards = section.querySelectorAll("[data-event-card]:not([hidden])").length;
      const countNode = section.querySelector("[data-event-count]");
      const emptyNode = section.querySelector("[data-filter-empty]");

      if (countNode) {
        countNode.textContent = `${visibleCards} item${visibleCards === 1 ? "" : "s"}`;
      }

      if (emptyNode) {
        emptyNode.hidden = visibleCards !== 0;
      }
    });
  };

  filterForm.addEventListener("input", applyFilters);
  filterForm.addEventListener("change", applyFilters);
  filterForm.addEventListener("reset", () => {
    window.requestAnimationFrame(applyFilters);
  });
}

