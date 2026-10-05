// Stateful visual cases complement the generated API variants in browser-visual-parity.cjs.
const steps = [
  { key: "details", label: "1. Dane kontaktowe", status: "complete" },
  {
    key: "verification",
    label: "2. Weryfikacja dokumentow",
    status: "during",
    active: true,
  },
  { key: "summary", label: "3. Podsumowanie wniosku", status: "default" },
  { key: "approval", label: "4. Zatwierdzenie", status: "disabled" },
  { key: "archive", label: "5. Archiwum", status: "hidden" },
];
const breadcrumbItems = [
  { label: "Strona glowna", path: "/" },
  { label: "Dokumentacja wszystkich komponentow", path: "/components" },
  { label: "Nawigacja i struktura aplikacji", path: "/components/navigation" },
  { label: "Szczegoly komponentu" },
];
const menuItems = [
  { id: "edit", label: "Edytuj dokument", icon: "edit", shortcut: "Ctrl+E" },
  { id: "blocked", label: "Niedostepna operacja", disabled: true },
  { id: "divider", type: "separator" },
  {
    id: "notifications",
    type: "checkbox",
    label: "Powiadomienia",
    checked: true,
  },
  {
    id: "compact",
    type: "radio",
    label: "Widok kompaktowy",
    group: "density",
    checked: true,
  },
  {
    id: "comfortable",
    type: "radio",
    label: "Widok wygodny",
    group: "density",
    checked: false,
  },
  { id: "remove", label: "Usun dokument", variant: "danger" },
];
const longDescription =
  "Dodatkowe informacje o etapie oraz warunkach, ktore trzeba spelnic przed kontynuowaniem pracy.";

async function openPopover(page) {
  await page.locator("[aria-expanded='false']").first().click();
  await page.locator(":popover-open").waitFor({ state: "visible" });
}

async function openDropdown(page) {
  await page.locator(".peaui-dropdown-menu__trigger").click();
  await page.getByRole("menu").waitFor({ state: "visible" });
  // Menu positioning must not leave a previous pointer coordinate hovering an item.
  await page.mouse.move(0, 0);
}

async function focusTooltip(page) {
  await page.locator(".peaui-info-tooltip").focus();
  await page.getByRole("tooltip").waitFor({ state: "visible" });
}

module.exports = [
  {
    id: "navigation-card-locked-tooltip",
    name: "NavigationCard",
    props: {
      variant: "disabled",
      title: "Zatwierdzenie wniosku",
      description: longDescription,
    },
    prepare: focusTooltip,
  },
  {
    id: "navigation-card-static-long-mobile",
    name: "NavigationCard",
    width: 320,
    props: {
      path: "",
      title: "Szczegolowa weryfikacja dokumentacji",
      description: longDescription,
    },
  },
  ...[800, 320].map((width) => ({
    id: `navigation-stepper-all-statuses-${width}`,
    name: "NavigationStepper",
    width,
    props: { options: steps },
  })),
  {
    id: "navigation-tabs-label-content",
    name: "NavigationTabs",
    props: {
      ariaLabel: "Foldery wiadomosci",
      tabs: [
        { key: "inbox", label: "Skrzynka odbiorcza", active: true },
        { key: "archive", label: "Archiwum", isValid: false },
        { key: "settings", label: "Ustawienia", disabled: true },
      ],
    },
    slots: {
      "navigation-tabs-inbox-before": {
        tag: "span",
        text: "★",
        props: { "aria-hidden": "true" },
      },
      "navigation-tabs-inbox-after": {
        tag: "span",
        text: "3",
        props: { "aria-hidden": "true" },
      },
    },
    async prepare(page, framework) {
      if (framework === "react") {
        await page.evaluate(() =>
          window.display.update({
            renderTabBefore: { $fn: 'tab => tab.key === "inbox" ? "★" : null' },
            renderTabAfter: { $fn: 'tab => tab.key === "inbox" ? "3" : null' },
          }),
        );
      }
    },
  },
  {
    id: "navigation-tabs-long-mobile",
    name: "NavigationTabs",
    width: 320,
    props: {
      withBackround: false,
      tabs: [
        { key: "current", label: "Wszystkie dostepne dokumenty", active: true },
        { key: "history", label: "Historia ostatnich zmian", isValid: false },
      ],
    },
  },
  {
    id: "breadcrumbs-long-mobile",
    name: "Breadcrumbs",
    width: 320,
    props: { items: breadcrumbItems },
  },
  {
    id: "breadcrumbs-overflow-open-mobile",
    name: "Breadcrumbs",
    width: 320,
    props: { items: breadcrumbItems },
    prepare: openPopover,
  },
  {
    id: "message-error-long-mobile",
    name: "MessageText",
    width: 320,
    props: { variant: "error" },
    slots: { default: { tag: "span", text: longDescription } },
  },
  {
    id: "message-success-without-icon",
    name: "MessageText",
    props: { variant: "success", withIcon: false },
    slots: {
      default: { tag: "span", text: "Wszystkie zmiany zostaly zapisane." },
    },
  },
  {
    id: "message-own-icon",
    name: "MessageText",
    props: { variant: "info", ownIcon: "edit", withIcon: false },
    slots: {
      default: { tag: "span", text: "Ikona przekazana przez aplikacje" },
    },
  },
  ...["success", "error"].map((variant) => ({
    id: `toast-${variant}-closable-mobile`,
    name: "ToastAlert",
    width: 320,
    props: {
      variant,
      title: "Aktualizacja dokumentow",
      description: longDescription,
      canClose: true,
      withBorder: true,
      withShadow: true,
    },
  })),
  {
    id: "toast-description-only",
    name: "ToastAlert",
    props: { title: "", description: longDescription, canClose: true },
  },
  {
    id: "progress-empty-hidden-active",
    name: "ProgressIndicator",
    props: { steps: 0, active: 4, removeActive: true },
  },
  {
    id: "progress-clamped-complete",
    name: "ProgressIndicator",
    props: { steps: 3, active: 8, size: 64, strokeWidth: 6 },
  },
  {
    id: "popover-button-open-matching-width",
    name: "PopoverButton",
    props: { placement: "bottom-left", matchTriggerWidth: true },
    slots: {
      default: { tag: "span", text: "Pokaz szczegolowe informacje" },
      content: { tag: "p", text: longDescription },
    },
    prepare: openPopover,
  },
  {
    id: "popover-overlayer-open-native-trigger",
    name: "PopoverOverlayer",
    width: 320,
    props: { placement: "bottom-left", matchTriggerWidth: true },
    slots: {
      default: {
        tag: "button",
        text: "Pokaz informacje",
        props: { type: "button" },
      },
      content: { tag: "p", text: longDescription },
    },
    prepare: openPopover,
  },
  {
    id: "tooltip-focus-dark",
    name: "InfoTooltip",
    dark: true,
    props: { placement: "bottom-left" },
    slots: {
      default: { tag: "span", text: "Szczegoly etapu" },
      title: { tag: "span", text: "Dodatkowe informacje" },
      description: { tag: "span", text: longDescription },
    },
    prepare: focusTooltip,
  },
  {
    id: "dropdown-open-mixed-items",
    name: "DropdownMenu",
    props: { items: menuItems, triggerLabel: "Akcje dokumentu" },
    prepare: openDropdown,
  },
  {
    id: "dropdown-open-empty",
    name: "DropdownMenu",
    props: { items: [] },
    prepare: openDropdown,
  },
  {
    id: "dropdown-open-loading",
    name: "DropdownMenu",
    props: { loading: true },
    prepare: openDropdown,
  },
  {
    id: "menu-bar-overflow-open-mobile",
    name: "MenuBar",
    width: 320,
    props: {
      menus: [
        "Plik",
        "Edycja",
        "Dokumenty",
        "Ustawienia",
        "Pomoc i dokumentacja",
      ].map((label, index) => ({ id: String(index), label, items: menuItems })),
    },
    async prepare(page) {
      // Horizontal keyboard scrolling can move another trigger under an idle pointer.
      await page.mouse.move(0, 0);
      const trigger = page.getByRole("menubar").getByRole("menuitem").first();
      await trigger.focus();
      await trigger.press("End");
      await page.keyboard.press("ArrowDown");
      await page
        .getByRole("menu", { name: "Pomoc i dokumentacja", exact: true })
        .waitFor({ state: "visible" });
    },
  },
  {
    id: "command-palette-grouped-modal-mobile",
    name: "CommandPalette",
    width: 320,
    props: {
      mode: "modal",
      open: true,
      groups: [{ id: "documents", label: "Dokumenty" }],
      commands: [
        {
          id: "create",
          label: "Utworz dokument",
          description: "Rozpocznij nowy wniosek",
          icon: "plus",
          group: "documents",
          shortcut: ["Mod", "N"],
        },
        {
          id: "archive",
          label: "Archiwum dokumentow",
          description: "Wnioski z poprzednich lat",
          group: "documents",
          disabled: true,
        },
      ],
    },
    async prepare(page) {
      await page.getByRole("combobox").focus();
    },
  },
  ...["ModalDialog", "DrawerPanel"].map((name) => ({
    id: `${name}-long-content-mobile`,
    name,
    width: 320,
    props: { open: true },
    slots: {
      header: { tag: "h2", text: "Szczegolowe informacje o dokumentach" },
      default: { tag: "p", text: longDescription },
    },
  })),
];
