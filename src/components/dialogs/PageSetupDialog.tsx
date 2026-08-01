import { useState } from "react";
import { useLekhana } from "../../editor/context";
import { Modal, Field, Toggle, NumberInput } from "../ui";
import type { Margins, Orientation, PageSize } from "../../types";
import { DEFAULT_MARGINS } from "../../utils/storage";

const SIZES: Array<{ id: PageSize; label: string }> = [
  { id: "a4", label: "A4 (210 × 297 mm)" },
  { id: "letter", label: "Letter (8.5 × 11 in)" },
  { id: "legal", label: "Legal (8.5 × 14 in)" },
  { id: "a5", label: "A5 (148 × 210 mm)" },
];

export function PageSetupDialog() {
  const { closeDialog, doc, setDoc, saveNow } = useLekhana();
  const [pageSize, setPageSize] = useState<PageSize>(doc.pageSize);
  const [orientation, setOrientation] = useState<Orientation>(doc.orientation);
  const [margins, setMargins] = useState<Margins>({ ...doc.margins });

  const setM = (k: keyof Margins, v: number) => setMargins((m) => ({ ...m, [k]: v }));

  const apply = () => {
    setDoc({ ...doc, pageSize, orientation, margins });
    setTimeout(saveNow, 0);
    closeDialog();
  };

  return (
    <Modal
      title="Page setup"
      onClose={closeDialog}
      footer={
        <>
          <button className="lk-btn-ghost" onClick={closeDialog}>Cancel</button>
          <button className="lk-btn-primary" onClick={apply}>Apply</button>
        </>
      }
    >
      <Field label="Paper size">
        <select className="lk-input" value={pageSize} onChange={(e) => setPageSize(e.target.value as PageSize)}>
          {SIZES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Orientation">
        <div className="lk-radio-group">
          <Toggle label="Portrait" checked={orientation === "portrait"} onChange={(v) => v && setOrientation("portrait")} />
          <Toggle label="Landscape" checked={orientation === "landscape"} onChange={(v) => v && setOrientation("landscape")} />
        </div>
      </Field>

      <div className="lk-label" style={{ marginTop: 4 }}>Margins (mm)</div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Top">
          <NumberInput value={margins.top} onChange={(v) => setM("top", v)} min={0} max={100} />
        </Field>
        <Field label="Bottom">
          <NumberInput value={margins.bottom} onChange={(v) => setM("bottom", v)} min={0} max={100} />
        </Field>
        <Field label="Left">
          <NumberInput value={margins.left} onChange={(v) => setM("left", v)} min={0} max={100} />
        </Field>
        <Field label="Right">
          <NumberInput value={margins.right} onChange={(v) => setM("right", v)} min={0} max={100} />
        </Field>
      </div>

      <button
        className="lk-btn-ghost text-[12px] mt-1"
        onClick={() => setMargins({ ...DEFAULT_MARGINS })}
      >
        Reset to default (25.4 mm)
      </button>
    </Modal>
  );
}
