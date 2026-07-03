function initCopyButtons() {
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-copy]");

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const text = button.dataset.copy ?? "";
      const originalLabel = button.getAttribute("aria-label") ?? "Copy";

      try {
        await navigator.clipboard.writeText(text);
        button.setAttribute("aria-label", "Copied");
        button.textContent = "✓";
      } catch {
        // Fallback: select the text so the user can copy manually.
        const code = button.previousElementSibling;
        if (code && code instanceof HTMLElement) {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(code);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
        button.setAttribute("aria-label", "Select all (copy manually)");
      }

      window.setTimeout(() => {
        button.setAttribute("aria-label", originalLabel);
        button.textContent = "";
        restoreIcon(button);
      }, 2000);
    });
  });
}

function restoreIcon(button: HTMLButtonElement) {
  // Re-render the copy SVG icon since textContent replaced it.
  button.innerHTML = `
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 4v8h8V4H4zm0-1h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/>
      <path d="M2 6h1v7a1 1 0 0 0 1 1h7v1a1 1 0 0 1-1 1H3a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1z"/>
    </svg>
  `;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCopyButtons);
} else {
  initCopyButtons();
}
