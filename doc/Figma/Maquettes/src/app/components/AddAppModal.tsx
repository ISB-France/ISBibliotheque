import { X, Plus } from "lucide-react";
import { useState } from "react";

interface AddAppModalProps {
  onClose: () => void;
  onAdd: (app: { name: string; description: string; category: string; url: string }) => void;
}

const CATEGORIES = ["Gestion", "Production", "RH", "Finance", "Qualité", "Logistique", "Commercial", "IT"];

export function AddAppModal({ onClose, onAdd }: AddAppModalProps) {
  const [form, setForm] = useState({ name: "", description: "", category: "Gestion", url: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#3B2800]/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#3B2800" }}>Ajouter une application</h2>
            <p style={{ fontSize: "13px", color: "#8C6A40", marginTop: "2px" }}>
              Référencer une nouvelle application dans le portail
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-[#FEEAD3] transition-colors"
          >
            <X size={18} color="#8C6A40" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#3B2800", display: "block", marginBottom: "6px" }}>
              Nom de l'application *
            </label>
            <input
              type="text"
              placeholder="Ex : Suivi production"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[rgba(59,40,0,0.15)] bg-[#FDFAF5] outline-none focus:border-[#FFDD00] focus:ring-2 focus:ring-[#FFDD00]/30 transition-all"
              style={{ fontSize: "14px", color: "#3B2800" }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#3B2800", display: "block", marginBottom: "6px" }}>
              Description courte
            </label>
            <input
              type="text"
              placeholder="Ex : Suivi des ordres de fabrication en temps réel"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[rgba(59,40,0,0.15)] bg-[#FDFAF5] outline-none focus:border-[#FFDD00] focus:ring-2 focus:ring-[#FFDD00]/30 transition-all"
              style={{ fontSize: "14px", color: "#3B2800" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#3B2800", display: "block", marginBottom: "6px" }}>
              Catégorie
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[rgba(59,40,0,0.15)] bg-[#FDFAF5] outline-none focus:border-[#FFDD00] focus:ring-2 focus:ring-[#FFDD00]/30 transition-all appearance-none cursor-pointer"
              style={{ fontSize: "14px", color: "#3B2800" }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#3B2800", display: "block", marginBottom: "6px" }}>
              URL de l'application
            </label>
            <input
              type="url"
              placeholder="https://app.isb-group.fr/..."
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[rgba(59,40,0,0.15)] bg-[#FDFAF5] outline-none focus:border-[#FFDD00] focus:ring-2 focus:ring-[#FFDD00]/30 transition-all"
              style={{ fontSize: "14px", color: "#3B2800" }}
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[rgba(59,40,0,0.15)] hover:bg-[#FEEAD3] transition-colors"
              style={{ fontSize: "14px", fontWeight: 500, color: "#8C6A40" }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 hover:brightness-95 transition-all"
              style={{ backgroundColor: "#FFDD00", color: "#3B2800", fontSize: "14px", fontWeight: 600 }}
            >
              <Plus size={16} />
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
