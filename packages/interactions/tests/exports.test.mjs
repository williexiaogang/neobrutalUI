import assert from "node:assert/strict";
import { test } from "node:test";

const exportCases = [
  ["@neo-brutal-ui/interactions", ["createDialog", "createTabs", "createDropdown", "createDrawer", "createTooltip", "createToastManager", "createOtp", "createSegmentedControl", "createCodeBlock", "createDatePicker", "createCommandPalette", "reveal"]],
  ["@neo-brutal-ui/interactions/dialog", ["createDialog"]],
  ["@neo-brutal-ui/interactions/tabs", ["createTabs"]],
  ["@neo-brutal-ui/interactions/dropdown", ["createDropdown"]],
  ["@neo-brutal-ui/interactions/drawer", ["createDrawer"]],
  ["@neo-brutal-ui/interactions/tooltip", ["createTooltip"]],
  ["@neo-brutal-ui/interactions/toast", ["createToastManager"]],
  ["@neo-brutal-ui/interactions/otp", ["createOtp"]],
  ["@neo-brutal-ui/interactions/segmented-control", ["createSegmentedControl"]],
  ["@neo-brutal-ui/interactions/code-block", ["createCodeBlock"]],
  ["@neo-brutal-ui/interactions/date-picker", ["createDatePicker"]],
  ["@neo-brutal-ui/interactions/command-palette", ["createCommandPalette"]],
  ["@neo-brutal-ui/interactions/animations", ["reveal", "countUp", "stagger"]],
  ["@neo-brutal-ui/interactions/factory", ["createEventManager", "createStateManager"]],
  ["@neo-brutal-ui/interactions/types", []],
];

for (const [specifier, names] of exportCases) {
  test(`${specifier} imports`, async () => {
    const mod = await import(specifier);

    for (const name of names) {
      assert.equal(typeof mod[name], "function", `${specifier} should export ${name}`);
    }
  });
}
