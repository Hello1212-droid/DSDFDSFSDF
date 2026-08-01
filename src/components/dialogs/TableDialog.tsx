import { useState } from "react";
import { useLekhana } from "../../editor/context";
import { Modal, Field, Toggle } from "../ui";

export function TableDialog() {
  const { closeDialog, editor } = useLekhana();
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [header, setHeader] = useState(true);

  const insert = () => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: header })
      .run();
    closeDialog();
  };

  return (
    <Modal
      title="Insert table"
      onClose={closeDialog}
      size="sm"
      footer={
        <>
          <button className="lk-btn-ghost" onClick={closeDialog}>Cancel</button>
          <button className="lk-btn-primary" onClick={insert}>Insert</button>
        </>
      }
    >
      <Field label="Rows">
        <input type="number" className="lk-input" min={1} max={20} value={rows} onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))} />
      </Field>
      <Field label="Columns">
        <input type="number" className="lk-input" min={1} max={10} value={cols} onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))} />
      </Field>
      <Toggle label="First row as header" checked={header} onChange={setHeader} />
    </Modal>
  );
}
