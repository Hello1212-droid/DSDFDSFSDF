import { useRef, useState } from "react";
import { useLekhana } from "../../editor/context";
import { Modal, Field } from "../ui";
import { Upload } from "lucide-react";

export function ImageDialog() {
  const { closeDialog, editor } = useLekhana();
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const insertSrc = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
    closeDialog();
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => insertSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onUrl = async () => {
    if (!url) return;
    setBusy(true);
    // Preload to validate
    const img = new Image();
    img.onload = () => { setBusy(false); insertSrc(url); };
    img.onerror = () => { setBusy(false); alert("Could not load that image URL."); };
    img.src = url;
  };

  return (
    <Modal
      title="Insert image"
      onClose={closeDialog}
      size="sm"
      footer={
        <>
          <button className="lk-btn-ghost" onClick={closeDialog}>Cancel</button>
        </>
      }
    >
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}
      >
        <Upload className="mx-auto text-gray-400 mb-2" size={26} />
        <p className="text-[13px] text-gray-600">Click to upload, or drag &amp; drop an image</p>
        <p className="text-[11px] text-gray-400 mt-1">PNG, JPG, GIF · up to 5 MB</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>

      <div className="my-3 flex items-center gap-2 text-gray-400 text-[11px]">
        <span className="flex-1 h-px bg-gray-200" /> OR <span className="flex-1 h-px bg-gray-200" />
      </div>

      <Field label="Or paste an image URL">
        <div className="flex gap-2">
          <input className="lk-input" placeholder="https://…/image.png" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button className="lk-btn-primary shrink-0" onClick={onUrl} disabled={busy || !url}>
            {busy ? "…" : "Insert"}
          </button>
        </div>
      </Field>
    </Modal>
  );
}
