import { useEffect, useState } from "react";
import { useLekhana } from "../../editor/context";
import { Modal, Field } from "../ui";

export function LinkDialog() {
  const { closeDialog, editor } = useLekhana();
  const existing = editor?.getAttributes("link")?.href as string | undefined;
  const [url, setUrl] = useState(existing || "");
  const [text, setText] = useState("");

  useEffect(() => {
    if (editor && !text) setText(editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, " ") || "");
  }, [editor, text]);

  const apply = () => {
    if (!editor) return;
    const href = /^[a-zA-Z]+:\/\//.test(url) ? url : url ? `https://${url}` : url;
    if (href) {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    closeDialog();
  };

  const remove = () => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    closeDialog();
  };

  return (
    <Modal
      title="Insert link"
      onClose={closeDialog}
      footer={
        <>
          {existing && <button className="lk-btn-ghost" onClick={remove}>Remove link</button>}
          <button className="lk-btn-ghost" onClick={closeDialog}>Cancel</button>
          <button className="lk-btn-primary" onClick={apply}>Apply</button>
        </>
      }
    >
      <Field label="URL">
        <input
          className="lk-input"
          autoFocus
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
        />
      </Field>
      <Field label="Text to display">
        <input
          className="lk-input"
          placeholder="Link text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Field>
      <p className="text-[12px] text-gray-500 -mt-1">
        {existing ? "Update the selected link or remove it." : "Select text in the document first to link it, or type display text."}
      </p>
    </Modal>
  );
}
