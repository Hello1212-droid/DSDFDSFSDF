import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import { EDITOR_EXTENSIONS } from "./extensions";
import {
  deleteDoc,
  getActiveId,
  getDoc,
  listDocs,
  newDoc,
  saveDoc,
  setActiveId,
  uid,
} from "../utils/storage";
import type { DocMeta, EditorView } from "../types";
import { exportAsDocx, exportAsTxt, downloadJson } from "../utils/export";

export type DialogId =
  | "open"
  | "template"
  | "pageSetup"
  | "find"
  | "link"
  | "table"
  | "image"
  | "about"
  | null;

interface LekhanaContextValue {
  editor: Editor | null;
  doc: DocMeta;
  setDoc: (d: DocMeta) => void;
  docs: DocMeta[];
  refreshDocs: () => void;
  zoom: number;
  setZoom: (z: number) => void;
  view: EditorView;
  setView: (v: EditorView) => void;
  dialog: DialogId;
  openDialog: (d: DialogId) => void;
  closeDialog: () => void;
  toast: (msg: string) => void;
  toasts: Array<{ id: string; msg: string }>;
  dismissToast: (id: string) => void;
  renameDoc: (name: string) => void;
  saveNow: () => void;
  createDoc: () => void;
  openDocById: (id: string) => void;
  removeDoc: (id: string) => void;
  loadTemplate: (content: string) => void;
  exportDocx: () => void;
  exportTxt: () => void;
  exportHtml: () => void;
  exportJson: () => void;
  hasChanges: boolean;
}

const Ctx = createContext<LekhanaContextValue | null>(null);

export function useLekhana() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLekhana must be used within LekhanaProvider");
  return v;
}

export function LekhanaProvider({ children }: { children: ReactNode }) {
  const [doc, setDocState] = useState<DocMeta>(() => {
    const active = getActiveId();
    const found = active ? getDoc(active) : undefined;
    return found || newDoc();
  });
  const docRef = useRef(doc);
  docRef.current = doc;

  const [docs, setDocs] = useState<DocMeta[]>(() => listDocs());
  const [zoom, setZoom] = useState(1);
  const [view, setView] = useState<EditorView>("print");
  const [dialog, setDialog] = useState<DialogId>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; msg: string }>>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshDocs = useCallback(() => setDocs(listDocs()), []);

  const toast = useCallback((msg: string) => {
    const id = uid();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);
  const dismissToast = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const editor = useEditor({
    extensions: EDITOR_EXTENSIONS,
    content: doc.content,
    editorProps: {
      attributes: {
        class:
          "lk-prose focus:outline-none",
        spellcheck: "true",
      },
    },
    immediatelyRender: false,
    onUpdate: () => {
      setHasChanges(true);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        if (docRef.current && editor) {
          const next = {
            ...docRef.current,
            content: editor.getHTML(),
            updatedAt: Date.now(),
          };
          setDocState(next);
          saveDoc(next);
          setHasChanges(false);
          refreshDocs();
        }
      }, 700);
    },
  });

  // Persist active document id
  useEffect(() => {
    if (doc.id) setActiveId(doc.id);
  }, [doc.id]);

  const setDoc = useCallback((d: DocMeta) => {
    setDocState(d);
    setHasChanges(false);
  }, []);

  const saveNow = useCallback(() => {
    if (!editor || !docRef.current) return;
    const next = {
      ...docRef.current,
      content: editor.getHTML(),
      updatedAt: Date.now(),
    };
    setDocState(next);
    saveDoc(next);
    setHasChanges(false);
    refreshDocs();
  }, [editor, refreshDocs]);

  const renameDoc = useCallback((name: string) => {
    setDocState((d) => {
      const next = { ...d, name: name || "Untitled document" };
      saveDoc(next);
      return next;
    });
  }, []);

  const createDoc = useCallback(() => {
    const d = newDoc();
    setDocState(d);
    setActiveId(d.id);
    editor?.commands.setContent(d.content);
    editor?.commands.focus();
    setHasChanges(false);
    refreshDocs();
    toast("New document created");
  }, [editor, refreshDocs, toast]);

  const openDocById = useCallback(
    (id: string) => {
      const d = getDoc(id);
      if (!d) return;
      setDocState(d);
      setActiveId(id);
      editor?.commands.setContent(d.content);
      editor?.commands.focus();
      setHasChanges(false);
      refreshDocs();
    },
    [editor, refreshDocs],
  );

  const removeDoc = useCallback(
    (id: string) => {
      deleteDoc(id);
      refreshDocs();
      if (id === docRef.current?.id) {
        const rest = listDocs();
        const target = rest[0] || newDoc();
        setDocState(target);
        setActiveId(target.id);
        editor?.commands.setContent(target.content);
      }
    },
    [editor, refreshDocs],
  );

  const loadTemplate = useCallback(
    (content: string) => {
      editor?.commands.setContent(content);
      editor?.commands.focus();
      setHasChanges(true);
      toast("Template applied");
    },
    [editor, toast],
  );

  const exportDocx = useCallback(() => {
    if (!editor) return;
    exportAsDocx(editor.getJSON(), docRef.current);
    toast("Exported as .docx");
  }, [editor, toast]);
  const exportTxt = useCallback(() => {
    if (!editor) return;
    exportAsTxt(editor.getJSON(), docRef.current);
    toast("Exported as .txt");
  }, [editor, toast]);
  const exportHtml = useCallback(() => {
    if (!editor) return;
    import("../utils/export").then(({ downloadHtml }) => {
      downloadHtml(editor.getHTML(), docRef.current.name);
      toast("Exported as .html");
    });
  }, [editor, toast]);
  const exportJson = useCallback(() => {
    if (!editor) return;
    downloadJson(editor.getJSON(), docRef.current.name);
    toast("Exported as .json");
  }, [editor, toast]);

  const openDialog = useCallback((d: DialogId) => setDialog(d), []);
  const closeDialog = useCallback(() => setDialog(null), []);

  const value = useMemo<LekhanaContextValue>(
    () => ({
      editor,
      doc,
      setDoc,
      docs,
      refreshDocs,
      zoom,
      setZoom,
      view,
      setView,
      dialog,
      openDialog,
      closeDialog,
      toast,
      toasts,
      dismissToast,
      renameDoc,
      saveNow,
      createDoc,
      openDocById,
      removeDoc,
      loadTemplate,
      exportDocx,
      exportTxt,
      exportHtml,
      exportJson,
      hasChanges,
    }),
    [
      editor, doc, setDoc, docs, refreshDocs, zoom, view, dialog, openDialog, closeDialog,
      toast, toasts, dismissToast, renameDoc, saveNow, createDoc, openDocById, removeDoc,
      loadTemplate, exportDocx, exportTxt, exportHtml, exportJson, hasChanges,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export { EditorContent };
