/**
 * The French file is the single source of truth for the message schema.
 * `tsc` fails the build if another locale drifts from it, which is what keeps
 * `getTranslations()` and `useTranslations()` type-safe everywhere else.
 *
 * Written with `typeof import(...)` rather than a top-level `import` so this
 * file stays a global script and the augmentation below is truly global.
 */
type Messages = typeof import("./messages/fr.json");

// Alias rather than `interface IntlMessages extends Messages {}` so the
// augmentation carries the exact key union without tripping
// @typescript-eslint/no-empty-object-type.
type IntlMessages = Messages;