import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLekhana } from "../editor/context";
import { cn } from "../utils/cn";

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
}: {
  icon?: ReactNode;
  children: ReactNode;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className={cn("lk-menu-row", disabled && "disabled")} onClick={() => !disabled && onClick?.()}>
      <span className="lk-menu-icon">{icon}</span>
      <span>{children}</span>
      {shortcut && <span className="shortcut">{shortcut}</span>}
    </div>
  );
}

export function MenuBar() {
  const {
    editor, createDoc, openDialog, exportDocx, exportTxt, exportHtml, exportJson,
    saveNow, zoom, setZoom, view, setView, toast,
  } = useLekhana();

  const openPDF = () => {
    window.print();
  };

  return (
    <div className="lk-menubar">
      <Dropdown label="File">
        {(close) => (
          <>
            <Row icon={<span>📄</span>} shortcut="Ctrl+N" onClick={() => { createDoc(); close(); }}>New document</Row>
            <Row icon={<span>📂</span>} shortcut="Ctrl+O" onClick={() => { openDialog("open"); close(); }}>Open</Row>
            <Row icon={<span>🗂️</span>} shortcut="Ctrl+Shift+T" onClick={() => { openDialog("template"); close(); }}>New from template</Row>
            <div className="lk-menu-section" />
            <Row icon={<span>💾</span>} shortcut="Ctrl+S" onClick={() => { saveNow(); close(); }}>Save</Row>
            <div className="lk-menu-section" />
            <div className="lk-menu-label">Export</div>
            <Row icon={<span>📥</span>} shortcut="Ctrl+Shift+S" onClick={() => { exportDocx(); close(); }}>Save as Word (.docx)</Row>
            <Row icon={<span>🖨️</span>} onClick={() => { openPDF(); close(); }}>Export as PDF / Print</Row>
            <Row icon={<span>📃</span>} onClick={() => { exportTxt(); close(); }}>Save as text (.txt)</Row>
            <Row icon={<span>🌐</span>} onClick={() => { exportHtml(); close(); }}>Save as web page (.html)</Row>
            <Row icon={<span>🧩</span>} onClick={() => { exportJson(); close(); }}>Save as JSON (backup)</Row>
            <div className="lk-menu-section" />
            <Row icon={<span>ℹ️</span>} onClick={() => { openDialog("about"); close(); }}>About Lekhana</Row>
          </>
        )}
      </Dropdown>

      <Dropdown label="Edit">
        {(close) => (
          <>
            <Row shortcut="Ctrl+Z" disabled={!editor?.can().undo()} onClick={() => { editor?.chain().focus().undo().run(); close(); }}>Undo</Row>
            <Row shortcut="Ctrl+Y" disabled={!editor?.can().redo()} onClick={() => { editor?.chain().focus().redo().run(); close(); }}>Redo</Row>
            <div className="lk-menu-section" />
            <Row shortcut="Ctrl+F" onClick={() => { openDialog("find"); close(); }}>Find</Row>
            <Row shortcut="Ctrl+H" onClick={() => { openDialog("find"); close(); }}>Replace</Row>
            <Row shortcut="Ctrl+A" onClick={() => { editor?.chain().focus().selectAll().run(); close(); }}>Select all</Row>
            <div className="lk-menu-section" />
            <Row onClick={() => { editor?.chain().focus().unsetAllMarks().clearNodes().run(); close(); }}>Clear all formatting</Row>
          </>
        )}
      </Dropdown>

      <Dropdown label="View">
        {(close) => (
          <>
            <Row shortcut="Ctrl+=" onClick={() => { setZoom(Math.min(2, zoom + 0.1)); close(); }}>Zoom in</Row>
            <Row shortcut="Ctrl+-" onClick={() => { setZoom(Math.max(0.5, zoom - 0.1)); close(); }}>Zoom out</Row>
            <Row onClick={() => { setZoom(1); close(); }}>Zoom to 100%</Row>
            <div className="lk-menu-section" />
            <div className="lk-menu-label">View mode</div>
            <Row onClick={() => { setView("print"); close(); }}>{view === "print" ? "✓ " : ""}Print layout</Row>
            <Row onClick={() => { setView("focus"); close(); }}>{view === "focus" ? "✓ " : ""}Focus mode</Row>
            <Row onClick={() => { setView("web"); close(); }}>{view === "web" ? "✓ " : ""}Web layout</Row>
            <div className="lk-menu-section" />
            <Row onClick={() => { editor?.commands.scrollIntoView(); close(); }}>Go to cursor</Row>
          </>
        )}
      </Dropdown>

      <Dropdown label="Insert">
        {(close) => (
          <>
            <Row onClick={() => { openDialog("table"); close(); }}>Table</Row>
            <Row onClick={() => { openDialog("image"); close(); }}>Image</Row>
            <Row shortcut="Ctrl+K" onClick={() => { openDialog("link"); close(); }}>Link</Row>
            <div className="lk-menu-section" />
            <Row onClick={() => { editor?.chain().focus().setHorizontalRule().run(); close(); }}>Horizontal rule</Row>
            <Row onClick={() => { editor?.chain().focus().insertContent("₹ ").run(); close(); }}>Rupee symbol (₹)</Row>
            <Row onClick={() => { const d = new Date().toLocaleDateString("en-IN"); editor?.chain().focus().insertContent(d).run(); close(); }}>Today's date</Row>
          </>
        )}
      </Dropdown>

      <Dropdown label="Format">
        {(close) => (
          <>
            <div className="lk-menu-label">Font</div>
            <Row shortcut="Ctrl+B" onClick={() => { editor?.chain().focus().toggleBold().run(); close(); }}>Bold</Row>
            <Row shortcut="Ctrl+I" onClick={() => { editor?.chain().focus().toggleItalic().run(); close(); }}>Italic</Row>
            <Row shortcut="Ctrl+U" onClick={() => { editor?.chain().focus().toggleUnderline().run(); close(); }}>Underline</Row>
            <Row onClick={() => { editor?.chain().focus().toggleStrike().run(); close(); }}>Strikethrough</Row>
            <div className="lk-menu-section" />
            <div className="lk-menu-label">Paragraph</div>
            <Row onClick={() => { editor?.chain().focus().toggleBulletList().run(); close(); }}>Bulleted list</Row>
            <Row onClick={() => { editor?.chain().focus().toggleOrderedList().run(); close(); }}>Numbered list</Row>
            <Row onClick={() => { editor?.chain().focus().toggleTaskList().run(); close(); }}>To-do list</Row>
            <div className="lk-menu-section" />
            <Row onClick={() => { openDialog("pageSetup"); close(); }}>Page setup…</Row>
          </>
        )}
      </Dropdown>

      <Dropdown label="Help">
        {(close) => (
          <>
            <Row onClick={() => { openDialog("about"); close(); }}>Keyboard shortcuts &amp; about</Row>
            <Row onClick={() => { toast("Lekhana saves your work automatically to this browser."); close(); }}>How autosave works</Row>
          </>
        )}
      </Dropdown>
    </div>
  );
}
