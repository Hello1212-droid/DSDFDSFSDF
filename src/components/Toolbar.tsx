import { useLekhana } from "../editor/context";
import { ColorButton } from "./ColorButton";
import { FONTS, FONT_SIZES, LINE_SPACINGS, TEXT_COLORS, HIGHLIGHT_COLORS } from "../utils/fonts";
import { cn } from "../utils/cn";
import { useEditorState } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Eraser,
  List,
  ListOrdered,
  ListChecks,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Code,
  Table,
  Image,
  Link,
  Minus,
  IndianRupee,
  Calendar,
  Paintbrush,
  Highlighter,
  TextQuote,
} from "lucide-react";
import { useState } from "react";

function SplitBtn({ label, onSelect }: { label: string; onSelect: (v: string) => void }) {
  return (
    <div className="lk-select-wrap">
      <select value="" onChange={(e) => { onSelect(e.target.value); e.target.value = ""; }}>
        <option value="" disabled hidden>{label}</option>
        <optgroup label="Heading">
          {[1, 2, 3, 4, 5, 6].map((l) => (
            <option key={l} value={`h${l}`}>Heading {l}</option>
          ))}
        </optgroup>
        <option value="p">Normal</option>
        <option value="blockquote">Quote</option>
        <option value="pre">Code block</option>
      </select>
    </div>
  );
}

export function Toolbar() {
  const { editor, openDialog } = useLekhana();
  const [lsOpen, setLsOpen] = useState(false);

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      if (!e) return null;
      const ts = e.getAttributes("textStyle") || {};
      return {
        bold: e.isActive("bold"),
        italic: e.isActive("italic"),
        underline: e.isActive("underline"),
        strike: e.isActive("strike"),
        code: e.isActive("code"),
        sub: e.isActive("subscript"),
        sup: e.isActive("superscript"),
        bullet: e.isActive("bulletList"),
        ordered: e.isActive("orderedList"),
        task: e.isActive("taskList"),
        align: e.isActive({ textAlign: "left" }) ? "left" : e.isActive({ textAlign: "center" }) ? "center" : e.isActive({ textAlign: "right" }) ? "right" : e.isActive({ textAlign: "justify" }) ? "justify" : null,
        fontSize: ts.fontSize,
        fontFamily: ts.fontFamily,
        color: ts.color,
        highlight: e.getAttributes("highlight")?.color || null,
        link: e.isActive("link"),
        lineHeight: e.isActive("paragraph") || e.isActive("heading") ? (e.getAttributes("paragraph")?.lineHeight || e.getAttributes("heading")?.lineHeight || null) : null,
        history: { undo: e.can().undo(), redo: e.can().redo() },
      };
    },
  });

  const t = state ?? {
    bold: false, italic: false, underline: false, strike: false, code: false, sub: false, sup: false,
    bullet: false, ordered: false, task: false, align: null, fontSize: null, fontFamily: null,
    color: null, highlight: null, link: false, lineHeight: null,
    history: { undo: false, redo: false },
  };

  if (!editor) return null;

  const onLine = (v: string) => {
    editor.chain().focus().setLineHeight(v).run();
    setLsOpen(false);
  };

  const insertDate = () => {
    const d = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
    editor.chain().focus().insertContent(d).run();
  };

  return (
    <div className="lk-ribbon">
      {/* Font group */}
      <div className="lk-group">
        <div className="lk-select-wrap">
          <select
            title="Font family"
            value={t.fontFamily || ""}
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          >
            <option value="" disabled>Font</option>
            {FONTS.map((f) => (
              <option key={f.value} value={f.stack} style={{ fontFamily: f.stack }}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div className="lk-select-wrap">
          <select
            title="Font size"
            value={t.fontSize || ""}
            onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          >
            <option value="" disabled>Size</option>
            {FONT_SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Character formatting */}
      <div className="lk-group">
        <button className={cn("lk-btn", t.bold && "active")} title="Bold (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </button>
        <button className={cn("lk-btn", t.italic && "active")} title="Italic (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </button>
        <button className={cn("lk-btn", t.underline && "active")} title="Underline (Ctrl+U)" onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <Underline size={16} />
        </button>
        <button className={cn("lk-btn", t.strike && "active")} title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={16} />
        </button>
        <button className={cn("lk-btn", t.sub && "active")} title="Subscript" onClick={() => editor.chain().focus().toggleSubscript().run()}>
          <Subscript size={15} />
        </button>
        <button className={cn("lk-btn", t.sup && "active")} title="Superscript" onClick={() => editor.chain().focus().toggleSuperscript().run()}>
          <Superscript size={15} />
        </button>
        <button className={cn("lk-btn", t.code && "active")} title="Inline code" onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code size={16} />
        </button>
      </div>

      {/* Text color & highlight */}
      <div className="lk-group">
        <ColorButton
          active={!!t.color && t.color !== "inherit"}
          activeColor={t.color}
          title="Text color"
          underline
          button={<Paintbrush size={16} />}
          colors={TEXT_COLORS}
          onPick={(v) => editor.chain().focus().setColor(v === "inherit" ? "inherit" : v).run()}
          onCustom={(v) => editor.chain().focus().setColor(v).run()}
        />
        <ColorButton
          active={!!t.highlight}
          activeColor={t.highlight}
          title="Highlight color"
          underline
          button={<Highlighter size={16} />}
          colors={HIGHLIGHT_COLORS}
          onPick={(v) => (v ? editor.chain().focus().toggleHighlight({ color: v }).run() : editor.chain().focus().unsetHighlight().run())}
          onCustom={(v) => editor.chain().focus().toggleHighlight({ color: v }).run()}
        />
        <button className="lk-btn" title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          <Eraser size={16} />
        </button>
      </div>

      {/* Paragraph */}
      <div className="lk-group">
        <button className={cn("lk-btn", t.bullet && "active")} title="Bulleted list" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </button>
        <button className={cn("lk-btn", t.ordered && "active")} title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </button>
        <button className={cn("lk-btn", t.task && "active")} title="To-do list" onClick={() => editor.chain().focus().toggleTaskList().run()}>
          <ListChecks size={16} />
        </button>
      </div>

      {/* Alignment */}
      <div className="lk-group">
        {[
          { v: "left", icon: <AlignLeft size={16} />, label: "Align left (Ctrl+L)" },
          { v: "center", icon: <AlignCenter size={16} />, label: "Align center (Ctrl+E)" },
          { v: "right", icon: <AlignRight size={16} />, label: "Align right (Ctrl+R)" },
          { v: "justify", icon: <AlignJustify size={16} />, label: "Justify (Ctrl+J)" },
        ].map((a) => (
          <button
            key={a.v}
            className={cn("lk-btn", t.align === a.v && "active")}
            title={a.label}
            onClick={() => editor.chain().focus().setTextAlign(a.v).run()}
          >
            {a.icon}
          </button>
        ))}
        {/* Line spacing */}
        <div className="relative">
          <button className="lk-btn" title="Line spacing" onClick={() => setLsOpen((o) => !o)}>
            <TextQuote size={16} />
          </button>
          {lsOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 w-[150px]" onMouseDown={(e) => e.stopPropagation()}>
              {LINE_SPACINGS.map((l) => (
                <button key={l.value} className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-100" onClick={() => onLine(l.value)}>
                  Line spacing {l.label}
                </button>
              ))}
              <button className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-100 border-t border-gray-100" onClick={() => { editor.chain().focus().unsetLineHeight().run(); setLsOpen(false); }}>
                Default spacing
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Styles */}
      <div className="lk-group">
        <SplitBtn label="Styles" onSelect={(v) => {
          if (v === "p") editor.chain().focus().setParagraph().run();
          else if (v === "blockquote") editor.chain().focus().toggleBlockquote().run();
          else if (v === "pre") editor.chain().focus().toggleCodeBlock().run();
          else editor.chain().focus().toggleHeading({ level: parseInt(v.slice(1)) as any }).run();
        }} />
      </div>

      {/* Insert */}
      <div className="lk-group">
        <button className="lk-btn" title="Insert table" onClick={() => openDialog("table")}><Table size={16} /></button>
        <button className="lk-btn" title="Insert image" onClick={() => openDialog("image")}><Image size={16} /></button>
        <button className={cn("lk-btn", t.link && "active")} title="Insert link (Ctrl+K)" onClick={() => openDialog("link")}><Link size={16} /></button>
        <button className="lk-btn" title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={16} /></button>
        <button className="lk-btn" title="Insert ₹ symbol" onClick={() => editor.chain().focus().insertContent("₹ ").run()}><IndianRupee size={16} /></button>
        <button className="lk-btn" title="Insert today's date" onClick={insertDate}><Calendar size={16} /></button>
      </div>
    </div>
  );
}
