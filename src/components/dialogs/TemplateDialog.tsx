import { TEMPLATES } from "../../utils/templates";
import { useLekhana } from "../../editor/context";
import { Modal } from "../ui";
import {
  FilePlus,
  FileText,
  ScrollText,
  FileSignature,
  IdCard,
  CreditCard,
  ShieldAlert,
  Receipt,
  User,
  FileCheck,
  Languages,
  Mail,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  FilePlus,
  FileText,
  ScrollText,
  FileSignature,
  IdCard,
  CreditCard,
  ShieldAlert,
  Receipt,
  User,
  FileCheck,
  Languages,
  Mail,
};

export function TemplateDialog() {
  const { closeDialog, loadTemplate } = useLekhana();

  return (
    <Modal title="New from template" onClose={closeDialog} size="lg">
      <p className="text-[13px] text-gray-500 mb-3">
        Templates for the documents Indians create most often. Selecting one replaces the current page —
        make sure you have saved your work.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {TEMPLATES.map((t) => {
          const Icon = ICONS[t.icon] || FileText;
          return (
            <button
              key={t.id}
              className="lk-list-item w-full text-left"
              onClick={() => { loadTemplate(t.content); closeDialog(); }}
            >
              <span className="w-9 h-9 rounded-lg bg-emerald-50 grid place-items-center text-emerald-600 shrink-0">
                <Icon size={18} />
              </span>
              <span className="min-w-0">
                <div className="font-medium text-gray-800 text-[13px] leading-tight">{t.title}</div>
                <div className="text-[11px] text-gray-500 line-clamp-2">{t.description}</div>
              </span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
