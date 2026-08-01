import { useEffect, useState } from "react";
import { useLekhana } from "../../editor/context";
import { Modal } from "../ui";

interface Stats {
  words: number;
  chars: number;
  charsNoSpace: number;
  paragraphs: number;
  lines: number;
  pages: number;
  readingMin: number;
}

export function WordCountDialog() {
  const { closeDialog, editor } = useLekhana();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!editor) return;
    const doc = editor.state.doc;
    const text = doc.textBetween(0, doc.content.size, " ");
    const cc = editor.storage.characterCount as { words: () => number; characters: () => number };
    let paragraphs = 0;
    let pages = 0;
    doc.descendants((n) => {
      if (n.type.name === "paragraph" && n.textContent.trim()) paragraphs++;
      if (n.type.name === "page") pages++;
    });
    const words = cc.words();
    setStats({
      words,
      chars: text.length,
      charsNoSpace: text.replace(/\s/g, "").length,
      paragraphs,
      lines: text.split("\n").length,
      pages: pages || 1,
      readingMin: Math.max(1, Math.round(words / 200)),
    });
  }, [editor]);

  const rows = [
    ["Pages", stats?.pages ?? 0],
    ["Words", stats?.words ?? 0],
    ["Characters (with spaces)", stats?.chars ?? 0],
    ["Characters (no spaces)", stats?.charsNoSpace ?? 0],
    ["Paragraphs", stats?.paragraphs ?? 0],
    ["Lines", stats?.lines ?? 0],
    ["Estimated reading time", stats ? `${stats.readingMin} min` : "0 min"],
  ] as Array<[string, string | number]>;

  return (
    <Modal title="Word count" onClose={closeDialog} size="sm">
      <div className="divide-y divide-gray-50">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-2 text-[13px]">
            <span className="text-gray-600">{k}</span>
            <span className="font-semibold text-gray-900 tabular">{v}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-gray-400 mt-3">
        Word count updates as you type. Open this again from <b>View → Word count</b>.
      </p>
    </Modal>
  );
}
