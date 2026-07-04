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

  const categoryLabels: Record<string, string> = {
    actions: "Actions",
    forms: "Forms",
    "data-display": "Data Display",
    feedback: "Feedback",
    navigation: "Navigation",
    overlay: "Overlay",
    layout: "Layout",
  };

  function formatFilterResult(count: number) {
    const statusLabel =
      activeStatus === "all"
        ? ""
        : activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1);
    const categoryLabel =
      activeCategory === "all" ? "" : categoryLabels[activeCategory] ?? activeCategory;

    const filters: string[] = [];
    if (statusLabel) filters.push(statusLabel);
    if (categoryLabel) filters.push(categoryLabel);

    const filterSuffix =
      filters.length > 0 ? ` (${filters.join(" + ")})` : "";

    return `Showing ${count} component${count === 1 ? "" : "s"}${filterSuffix}`;
  }

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
    resultEl.textContent = formatFilterResult(visibleCount);

    // Update aria-pressed and active class for status buttons (filter bar + summary cards).
    statusButtons.forEach((button) => {
      const isActive = button.dataset.statusFilter === activeStatus;
      button.setAttribute("aria-pressed", String(isActive));
      button.classList.toggle("is-active", isActive);
    });

    // Update aria-pressed and active class for category buttons.
    categoryButtons.forEach((button) => {
      const isActive = button.dataset.categoryFilter === activeCategory;
      button.setAttribute("aria-pressed", String(isActive));
      button.classList.toggle("is-active", isActive);
    });

    // Sync any inline category filter chips that may exist on cards.
    document.querySelectorAll<HTMLButtonElement>("[data-category-chip]").forEach((chip) => {
      const isActive = chip.dataset.categoryChip === activeCategory;
      chip.setAttribute("aria-pressed", String(isActive));
      chip.classList.toggle("is-active", isActive);
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

  // Allow clicking category chips inside cards to filter the gallery.
  document.querySelectorAll<HTMLButtonElement>("[data-category-chip]").forEach((chip) => {
    chip.addEventListener("click", () => {
      activeCategory = chip.dataset.categoryChip ?? "all";
      updateFilter();

      // Move focus to the category filter bar for keyboard users.
      const firstCategoryButton = document.querySelector<HTMLButtonElement>(
        "[data-category-filter][aria-pressed='true']"
      );
      firstCategoryButton?.focus();
    });
  });

  updateFilter();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initComponentFilter);
} else {
  initComponentFilter();
}
