import { useEffect } from "react";
import { LekhanaProvider, useLekhana } from "./editor/context";
import { TitleBar } from "./components/TitleBar";
import { MenuBar } from "./components/MenuBar";
import { Toolbar } from "./components/Toolbar";
import { Ruler } from "./components/Ruler";
import { StatusBar } from "./components/StatusBar";
import { PageArea } from "./components/PageArea";
import { OpenDialog } from "./components/dialogs/OpenDialog";
import { TemplateDialog } from "./components/dialogs/TemplateDialog";
import { PageSetupDialog } from "./components/dialogs/PageSetupDialog";
import { FindReplaceDialog } from "./components/dialogs/FindReplaceDialog";
import { LinkDialog } from "./components/dialogs/LinkDialog";
import { TableDialog } from "./components/dialogs/TableDialog";
import { ImageDialog } from "./components/dialogs/ImageDialog";
import { AboutDialog } from "./components/dialogs/AboutDialog";

function DialogHost() {
  const { dialog } = useLekhana();
  switch (dialog) {
    case "open": return <OpenDialog />;
    case "template": return <TemplateDialog />;
    case "pageSetup": return <PageSetupDialog />;
    case "find": return <FindReplaceDialog />;
    case "link": return <LinkDialog />;
    case "table": return <TableDialog />;
    case "image": return <ImageDialog />;
    case "about": return <AboutDialog />;
    default: return null;
  }
}

function ToastHost() {
  const { toasts, dismissToast } = useLekhana();
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dismissToast(t.id)}
          className="pointer-events-auto bg-gray-900 text-white text-[13px] px-4 py-2 rounded-lg shadow-lg cursor-pointer"
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function KeyboardShortcuts() {
  const { editor, saveNow, exportDocx, openDialog, zoom, setZoom } = useLekhana();
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      if (key === "s" && e.shiftKey) { e.preventDefault(); exportDocx(); }
      else if (key === "s") { e.preventDefault(); saveNow(); }
      else if (key === "p") { e.preventDefault(); window.print(); }
      else if (key === "f" || key === "h") { e.preventDefault(); openDialog("find"); }
      else if (key === "o") { e.preventDefault(); openDialog("open"); }
      else if (key === "=" || key === "+") { e.preventDefault(); setZoom(Math.min(2, zoom + 0.1)); }
      else if (key === "-") { e.preventDefault(); setZoom(Math.max(0.5, zoom - 0.1)); }
      else if (key === "0") { e.preventDefault(); setZoom(1); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [editor, saveNow, exportDocx, openDialog, zoom, setZoom]);

  return null;
}

function Shell() {
  return (
    <div className="lk-workspace">
      <TitleBar />
      <MenuBar />
      <Toolbar />
      <Ruler />
      <PageArea />
      <StatusBar />
      <DialogHost />
      <ToastHost />
      <KeyboardShortcuts />
    </div>
  );
}

export default function App() {
  return (
    <LekhanaProvider>
      <Shell />
    </LekhanaProvider>
  );
}
