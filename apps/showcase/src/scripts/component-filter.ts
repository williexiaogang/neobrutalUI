function initComponentFilter() {
  const gallery = document.querySelector<HTMLElement>("[data-gallery]");
  const resultText = document.querySelector<HTMLElement>("[data-filter-result]");
  const noResults = document.querySelector<HTMLElement>("[data-no-results]");

  if (!gallery || !resultText || !noResults) {
    return;
  }

  // Narrowed variables for closure use.
  const resultEl = resultText;
  const emptyEl = noResults;

  const statusButtons = document.querySelectorAll<HTMLButtonElement>(
    "[data-status-filter]"
  );
  const categoryButtons = document.querySelectorAll<HTMLButtonElement>(
    "[data-category-filter]"
  );

  let activeStatus = "all";
  let activeCategory = "all";

  const cards = Array.from(
    gallery.querySelectorAll<HTMLElement>("[data-component-card]")
  );

  function updateFilter() {
    let visibleCount = 0;

    cards.forEach((card) => {
      const status = card.dataset.status ?? "";
      const category = card.dataset.category ?? "";
      const matchesStatus = activeStatus === "all" || status === activeStatus;
      const matchesCategory =
        activeCategory === "all" || category === activeCategory;
      const matches = matchesStatus && matchesCategory;

      card.hidden = !matches;
      if (matches) visibleCount++;
    });

    emptyEl.hidden = visibleCount > 0;
    resultEl.textContent = `Showing ${visibleCount} component${
      visibleCount === 1 ? "" : "s"
    }`;

    // Update aria-pressed states for status buttons (filter bar + summary cards).
    statusButtons.forEach((button) => {
      const isActive = button.dataset.statusFilter === activeStatus;
      button.setAttribute("aria-pressed", String(isActive));
      button.classList.toggle("is-active", isActive);
    });

    categoryButtons.forEach((button) => {
      const isActive = button.dataset.categoryFilter === activeCategory;
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  statusButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeStatus = button.dataset.statusFilter ?? "all";
      updateFilter();
    });
  });

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.categoryFilter ?? "all";
      updateFilter();
    });
  });

  updateFilter();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initComponentFilter);
} else {
  initComponentFilter();
}
