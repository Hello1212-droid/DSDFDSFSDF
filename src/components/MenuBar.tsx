import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLekhana } from "../editor/context";
import { cn } from "../utils/cn";
import {
  Bold,
  Calendar,
  Check,
  Eraser,
  File,
  FileDown,
  FileJson2,
  FileText,
  FolderOpen,
  Globe,
  Image,
  IndianRupee,
  Info,
  Italic,
  Keyboard,
  LayoutTemplate,
  Link,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Printer,
  Redo2,
  Ruler,
  Save,
  Search,
  Strikethrough,
  Table,
  Underline,
  Undo2,
  ZoomIn,
  ZoomOut,
  CaseSensitive,
  Hash,
  Languages,
  Sheet,
  Settings,
  SquareSplitHorizontal,
  Volume2,
  VolumeX,
  Sigma,
  PenTool,
} from "lucide-react";
import { toggleSpeak, stopSpeaking, isSpeechSupported } from "../utils/tts";

function Dropdown({ label, children }: { label: string; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div className={cn("lk-menu-item", open && "open")} onClick={() => setOpen((o) => !o)}>{label}</div>
      {open && <div className="lk-menu-dropdown">{children(() => setOpen(false))}</div>}
    </div>
  );
}

function Row({
  icon,
  children,
  shortcut,
  onClick,
  disabled,
  checked,
}: {
  icon?: ReactNode;
  children: ReactNode;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  checked?: boolean;
}) {
  return (
    <div className={cn("lk-menu-row", disabled && "disabled")} onClick={() => !disabled && onClick?.()}>
      <span className="lk-menu-icon">{icon}</span>
      <span>{children}</span>
      {shortcut && <span className="shortcut">{shortcut}</span>}
      {checked && (
        <span className="lk-menu-check" style={{ display: "grid", placeItems: "center", color: "#2563eb", marginLeft: "auto" }}>
          <Check size={14} />
        </span>
      )}
    </div>
  );
}

export function MenuBar() {
  const {
    editor, createDoc, openDialog, exportDocx, exportTxt, exportHtml, exportJson,
    saveNow, zoom, setZoom, view, setView, toast,
  } = useLekhana();

  const openPDF = () => window.print();

  return (
    <div className="lk-menubar">
      <Dropdown label="File">
        {(close) => (
          <>
            <Row icon={<File size={16} />} shortcut="Ctrl+N" onClick={() => { createDoc(); close(); }}>New document</Row>
            <Row icon={<FolderOpen size={16} />} shortcut="Ctrl+O" onClick={() => { openDialog("open"); close(); }}>Open</Row>
            <Row icon={<LayoutTemplate size={16} />} shortcut="Ctrl+Shift+T" onClick={() => { openDialog("template"); close(); }}>New from template</Row>
            <div className="lk-menu-section" />
            <Row icon={<Save size={16} />} shortcut="Ctrl+S" onClick={() => { saveNow(); close(); }}>Save</Row>
            <div className="lk-menu-section" />
            <div className="lk-menu-label">Export</div>
            <Row icon={<FileDown size={16} />} shortcut="Ctrl+Shift+S" onClick={() => { exportDocx(); close(); }}>Save as Word (.docx)</Row>
            <Row icon={<Printer size={16} />} onClick={() => { openPDF(); close(); }}>Export as PDF / Print</Row>
            <Row icon={<FileText size={16} />} onClick={() => { exportTxt(); close(); }}>Save as text (.txt)</Row>
            <Row icon={<Globe size={16} />} onClick={() => { exportHtml(); close(); }}>Save as web page (.html)</Row>
            <Row icon={<FileJson2 size={16} />} onClick={() => { exportJson(); close(); }}>Save as JSON (backup)</Row>
            <div className="lk-menu-section" />
            <Row icon={<Settings size={16} />} shortcut="Ctrl+," onClick={() => { openDialog("settings"); close(); }}>Settings</Row>
            <Row icon={<Info size={16} />} onClick={() => { openDialog("about"); close(); }}>About Lekhana</Row>
          </>
        )}
      </Dropdown>

      <Dropdown label="Edit">
        {(close) => (
          <>
            <Row icon={<Undo2 size={16} />} shortcut="Ctrl+Z" disabled={!editor?.can().undo()} onClick={() => { editor?.chain().focus().undo().run(); close(); }}>Undo</Row>
            <Row icon={<Redo2 size={16} />} shortcut="Ctrl+Y" disabled={!editor?.can().redo()} onClick={() => { editor?.chain().focus().redo().run(); close(); }}>Redo</Row>
            <div className="lk-menu-section" />
            <Row icon={<Search size={16} />} shortcut="Ctrl+F" onClick={() => { openDialog("find"); close(); }}>Find</Row>
            <Row icon={<Search size={16} />} shortcut="Ctrl+H" onClick={() => { openDialog("find"); close(); }}>Replace</Row>
            <Row icon={<Check size={16} />} shortcut="Ctrl+A" onClick={() => { editor?.chain().focus().selectAll().run(); close(); }}>Select all</Row>
            <div className="lk-menu-section" />
            <Row icon={<Eraser size={16} />} onClick={() => { editor?.chain().focus().unsetAllMarks().clearNodes().run(); close(); }}>Clear all formatting</Row>
            {isSpeechSupported() && (
              <>
                <div className="lk-menu-section" />
                <Row icon={<Volume2 size={16} />} onClick={() => {
                  if (!editor) return;
                  const { from, to } = editor.state.selection;
                  const text = from !== to
                    ? editor.state.doc.textBetween(from, to, " ")
                    : editor.state.doc.textBetween(0, editor.state.doc.content.size, " ");
                  toggleSpeak(text); close();
                }}>Read aloud (from cursor / selection)</Row>
                <Row icon={<VolumeX size={16} />} onClick={() => { stopSpeaking(); close(); }}>Stop reading</Row>
              </>
            )}
          </>
        )}
      </Dropdown>

      <Dropdown label="View">
        {(close) => (
          <>
            <Row icon={<ZoomIn size={16} />} shortcut="Ctrl+=" onClick={() => { setZoom(Math.min(2, zoom + 0.1)); close(); }}>Zoom in</Row>
            <Row icon={<ZoomOut size={16} />} shortcut="Ctrl+-" onClick={() => { setZoom(Math.max(0.5, zoom - 0.1)); close(); }}>Zoom out</Row>
            <Row icon={<Check size={16} />} onClick={() => { setZoom(1); close(); }}>Zoom to 100%</Row>
            <div className="lk-menu-section" />
            <div className="lk-menu-label">View mode</div>
            <Row icon={<FileText size={16} />} checked={view === "print"} onClick={() => { setView("print"); close(); }}>Print layout</Row>
            <Row icon={<Search size={16} />} checked={view === "focus"} onClick={() => { setView("focus"); close(); }}>Focus mode</Row>
            <Row icon={<Globe size={16} />} checked={view === "web"} onClick={() => { setView("web"); close(); }}>Web layout</Row>
            <div className="lk-menu-section" />
            <Row icon={<Hash size={16} />} onClick={() => { openDialog("wordcount"); close(); }}>Word count…</Row>
            <Row icon={<Ruler size={16} />} onClick={() => { editor?.commands.scrollIntoView(); close(); }}>Go to cursor</Row>
          </>
        )}
      </Dropdown>

      <Dropdown label="Insert">
        {(close) => (
          <>
            <div className="lk-menu-label">Pages</div>
            <Row icon={<SquareSplitHorizontal size={16} />} shortcut="Ctrl+Enter" onClick={() => { editor?.chain().focus().insertPageBreak().run(); close(); }}>Page break</Row>
            <Row icon={<Sheet size={16} />} onClick={() => { editor?.chain().focus().addPageAtEnd().run(); close(); }}>New page at end</Row>
            <div className="lk-menu-section" />
            <div className="lk-menu-label">Elements</div>
            <Row icon={<Table size={16} />} onClick={() => { openDialog("table"); close(); }}>Table</Row>
            <Row icon={<Image size={16} />} onClick={() => { openDialog("image"); close(); }}>Image</Row>
            <Row icon={<Link size={16} />} shortcut="Ctrl+K" onClick={() => { openDialog("link"); close(); }}>Link</Row>
            <Row icon={<Sigma size={16} />} shortcut="Alt+=" onClick={() => { openDialog("equation"); close(); }}>Equation / formula…</Row>
            <Row icon={<PenTool size={16} />} onClick={() => { openDialog("mathinput"); close(); }}>Math input panel (handwrite)…</Row>
            <Row icon={<Languages size={16} />} onClick={() => { openDialog("keyboard"); close(); }}>Indian keyboard…</Row>
            <div className="lk-menu-section" />
            <Row icon={<Minus size={16} />} onClick={() => { editor?.chain().focus().setHorizontalRule().run(); close(); }}>Horizontal rule</Row>
            <Row icon={<IndianRupee size={16} />} onClick={() => { editor?.chain().focus().insertContent("₹ ").run(); close(); }}>Rupee symbol (₹)</Row>
            <Row icon={<Calendar size={16} />} onClick={() => { const d = new Date().toLocaleDateString("en-IN"); editor?.chain().focus().insertContent(d).run(); close(); }}>Today's date</Row>
          </>
        )}
      </Dropdown>

      <Dropdown label="Format">
        {(close) => (
          <>
            <div className="lk-menu-label">Font</div>
            <Row icon={<Bold size={16} />} shortcut="Ctrl+B" onClick={() => { editor?.chain().focus().toggleBold().run(); close(); }}>Bold</Row>
            <Row icon={<Italic size={16} />} shortcut="Ctrl+I" onClick={() => { editor?.chain().focus().toggleItalic().run(); close(); }}>Italic</Row>
            <Row icon={<Underline size={16} />} shortcut="Ctrl+U" onClick={() => { editor?.chain().focus().toggleUnderline().run(); close(); }}>Underline</Row>
            <Row icon={<Strikethrough size={16} />} onClick={() => { editor?.chain().focus().toggleStrike().run(); close(); }}>Strikethrough</Row>
            <div className="lk-menu-section" />
            <div className="lk-menu-label">Change case</div>
            <Row icon={<CaseSensitive size={16} />} onClick={() => { editor?.chain().focus().toUpperCase().run(); close(); }}>UPPERCASE</Row>
            <Row icon={<CaseSensitive size={16} />} onClick={() => { editor?.chain().focus().toLowerCase().run(); close(); }}>lowercase</Row>
            <Row icon={<CaseSensitive size={16} />} onClick={() => { editor?.chain().focus().toTitleCase().run(); close(); }}>Title Case</Row>
            <Row icon={<CaseSensitive size={16} />} onClick={() => { editor?.chain().focus().toSentenceCase().run(); close(); }}>Sentence case</Row>
            <div className="lk-menu-section" />
            <div className="lk-menu-label">Paragraph</div>
            <Row icon={<List size={16} />} onClick={() => { editor?.chain().focus().toggleBulletList().run(); close(); }}>Bulleted list</Row>
            <Row icon={<ListOrdered size={16} />} onClick={() => { editor?.chain().focus().toggleOrderedList().run(); close(); }}>Numbered list</Row>
            <Row icon={<ListChecks size={16} />} onClick={() => { editor?.chain().focus().toggleTaskList().run(); close(); }}>To-do list</Row>
            <div className="lk-menu-section" />
            <Row icon={<Ruler size={16} />} onClick={() => { openDialog("pageSetup"); close(); }}>Page setup…</Row>
          </>
        )}
      </Dropdown>

      <Dropdown label="Help">
        {(close) => (
          <>
            <Row icon={<Keyboard size={16} />} onClick={() => { openDialog("about"); close(); }}>Keyboard shortcuts &amp; about</Row>
            <Row icon={<Info size={16} />} onClick={() => { toast("Lekhana saves your work automatically to this browser."); close(); }}>How autosave works</Row>
          </>
        )}
      </Dropdown>
    </div>
  );
}
