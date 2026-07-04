# @neo-brutal-ui/interactions

Optional native JavaScript interactions for Neo-Brutal UI components. The package is framework-agnostic, tree-shakeable, and designed to pair with `@neo-brutal-ui/core`.

## Install

```sh
npm install @neo-brutal-ui/core @neo-brutal-ui/interactions
```

## Usage

Import only the interactions you need:

```js
import { createDialog } from "@neo-brutal-ui/interactions/dialog";

const dialog = document.querySelector("dialog");
const instance = createDialog(dialog);

document.querySelector("[data-open-dialog]").addEventListener("click", () => {
  instance.open();
});
```

Tabs use WAI-ARIA tab markup:

```js
import { createTabs } from "@neo-brutal-ui/interactions/tabs";

createTabs(document.querySelector("[data-nb-tabs]"));
```

## Entry Points

```js
import { createDialog, createTabs } from "@neo-brutal-ui/interactions";
import { createDialog } from "@neo-brutal-ui/interactions/dialog";
import { createTabs } from "@neo-brutal-ui/interactions/tabs";
import { createDropdown } from "@neo-brutal-ui/interactions/dropdown";
import { createDrawer } from "@neo-brutal-ui/interactions/drawer";
import { createTooltip } from "@neo-brutal-ui/interactions/tooltip";
import { createToastManager } from "@neo-brutal-ui/interactions/toast";
import { reveal, countUp, stagger } from "@neo-brutal-ui/interactions/animations";
```

The package has no runtime dependency on a frontend framework.

