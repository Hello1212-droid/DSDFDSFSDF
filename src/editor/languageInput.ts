import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { isLangEnabled, getActiveScript } from "../utils/langState";
import { transliterateWord } from "../utils/scripts";

export const languageInputKey = new PluginKey("languageInput");

/**
 * Finds the contiguous Latin word ending just before `pos` and replaces it with
 * its Indic-script transliteration (in a single transaction with any pending text).
 */
function transliterateBefore(tr: any, pos: number): boolean {
  const doc = tr.doc;
  let start = pos;
  while (start > 0) {
    const ch = doc.textBetween(start - 1, start, "\n");
    if (/[a-zA-Z]/.test(ch)) start -= 1;
    else break;
  }
  if (start >= pos) return false;
  const word = doc.textBetween(start, pos, "\n");
  const script = getActiveScript();
  const converted = transliterateWord(word, script);
  if (!converted || converted === word) return false;
  tr.replaceWith(start, pos, tr.doc.type.schema.text(converted));
  return true;
}

/**
 * ProseMirror plugin for live Hinglish → Indic transliteration.
 * Letters are inserted normally; on a space, punctuation or Enter, the
 * preceding word is converted to the selected Indian script.
 */
export const LanguageInputExtension = Extension.create({
  name: "languageInput",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: languageInputKey,
        props: {
          handleTextInput(view, from, _to, text) {
            if (!isLangEnabled()) return false;
            // Single Latin letters just insert normally.
            if (/^[a-zA-Z]$/.test(text)) return false;
            // Space / punctuation / multi-char: convert the preceding word, then insert text.
            const { tr } = view.state;
            transliterateBefore(tr, from);
            tr.insert(from, view.state.schema.text(text));
            view.dispatch(tr);
            return true;
          },
          handleKeyDown(view, event) {
            if (!isLangEnabled()) return false;
            // Convert the current word when Enter or any punctuation key is pressed.
            if (
              event.key === "Enter" ||
              (event.key.length === 1 && !/[a-zA-Z0-9]/.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey)
            ) {
              const { tr } = view.state;
              if (transliterateBefore(tr, view.state.selection.from)) {
                view.dispatch(tr);
              }
              return false;
            }
            return false;
          },
        },
      }),
    ];
  },
});
