import { useState } from "react";
import {
  Search,
  Plus,
  Bell,
  ChevronDown,
  BarChart3,
  Users,
  Package,
  FileText,
  Truck,
  ClipboardList,
  Settings,
  ShieldCheck,
  Zap,
  Calendar,
  Wrench,
  BookOpen,
  LayoutGrid,
  LogOut,
  HelpCircle,
  User,
} from "lucide-react";
import { ISBLogo } from "./components/ISBLogo";
import { AppCard } from "./components/AppCard";
import { AddAppModal } from "./components/AddAppModal";

const INITIAL_APPS = [
  {
    id: 1,
    name: "Suivi de production",
    description: "Ordres de fabrication, avancement et alertes temps réel",
    icon: Zap,
    color: "#F08159",
    bgColor: "#FEF0EA",
    category: "Production",
  },
  {
    id: 2,
    name: "Gestion des stocks",
    description: "Inventaire, mouvements et seuils de réapprovisionnement",
    icon: Package,
    color: "#D19571",
    bgColor: "#FDF3EC",
    category: "Logistique",
  },
  {
    id: 3,
    name: "Ressources humaines",
    description: "Congés, fiches de paie et gestion des équipes",
    icon: Users,
    color: "#8C6A40",
    bgColor: "#FEEAD3",
    category: "RH",
  },
  {
    id: 4,
    name: "Tableaux de bord",
    description: "Indicateurs clés, performances et reporting consolidé",
    icon: BarChart3,
    color: "#3B2800",
    bgColor: "#FDD5A5",
    category: "Gestion",
  },
  {
    id: 5,
    name: "Facturation",
    description: "Devis, factures et suivi des paiements clients",
    icon: FileText,
    color: "#F08159",
    bgColor: "#FEF0EA",
    category: "Finance",
  },
  {
    id: 6,
    name: "Expéditions",
    description: "Planification livraisons, transporteurs et traçabilité",
    icon: Truck,
    color: "#D19571",
    bgColor: "#FDF3EC",
    category: "Logistique",
  },
  {
    id: 7,
    name: "Contrôle qualité",
    description: "Non-conformités, audits et fiches de contrôle",
    icon: ShieldCheck,
    color: "#8C6A40",
    bgColor: "#FEEAD3",
    category: "Qualité",
  },
  {
    id: 8,
    name: "Planification",
    description: "Capacité, planning de charge et ressources machine",
    icon: Calendar,
    color: "#3B2800",
    bgColor: "#FDD5A5",
    category: "Production",
  },
  {
    id: 9,
    name: "Achats",
    description: "Commandes fournisseurs, réceptions et évaluation",
    icon: ClipboardList,
    color: "#F08159",
    bgColor: "#FEF0EA",
    category: "Finance",
  },
  {
    id: 10,
    name: "Maintenance",
    description: "Interventions préventives, correctrices et GMAO",
    icon: Wrench,
    color: "#D19571",
    bgColor: "#FDF3EC",
    category: "Production",
  },
  {
    id: 11,
    name: "Base documentaire",
    description: "Procédures, normes et documents techniques partagés",
    icon: BookOpen,
    color: "#8C6A40",
    bgColor: "#FEEAD3",
    category: "Qualité",
  },
  {
    id: 12,
    name: "Administration IT",
    description: "Accès, droits utilisateurs et configuration système",
    icon: Settings,
    color: "#3B2800",
    bgColor: "#FDD5A5",
    category: "IT",
  },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Gestion: BarChart3,
  Production: Zap,
  RH: Users,
  Finance: FileText,
  Qualité: ShieldCheck,
  Logistique: Truck,
  Commercial: ClipboardList,
  IT: Settings,
};

const ICON_COLORS: Record<string, { color: string; bgColor: string }> = {
  Gestion: { color: "#3B2800", bgColor: "#FDD5A5" },
  Production: { color: "#F08159", bgColor: "#FEF0EA" },
  RH: { color: "#8C6A40", bgColor: "#FEEAD3" },
  Finance: { color: "#F08159", bgColor: "#FEF0EA" },
  Qualité: { color: "#8C6A40", bgColor: "#FEEAD3" },
  Logistique: { color: "#D19571", bgColor: "#FDF3EC" },
  Commercial: { color: "#D19571", bgColor: "#FDF3EC" },
  IT: { color: "#3B2800", bgColor: "#FDD5A5" },
};

const ALL_CATEGORIES = ["Toutes", "Gestion", "Production", "RH", "Finance", "Qualité", "Logistique", "IT"];

export default function App() {
  const [apps, setApps] = useState(INITIAL_APPS);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Toutes");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [launchedApp, setLaunchedApp] = useState<string | null>(null);

  const filtered = apps.filter((app) => {
    const matchSearch =
      !search ||
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase()) ||
      app.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "Toutes" || app.category === activeCategory;
    return matchSearch && matchCategory;
  });

  function handleAddApp(data: { name: string; description: string; category: string; url: string }) {
    const colors = ICON_COLORS[data.category] || ICON_COLORS["Gestion"];
    const icon = ICON_MAP[data.category] || LayoutGrid;
    setApps((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: data.name,
        description: data.description || "Application interne ISB",
        icon,
        color: colors.color,
        bgColor: colors.bgColor,
        category: data.category,
      },
    ]);
  }

  function handleLaunch(name: string) {
    setLaunchedApp(name);
    setTimeout(() => setLaunchedApp(null), 2500);
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#FDFAF5",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: "rgba(253,250,245,0.96)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(59,40,0,0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <ISBLogo size={36} />
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#3B2800",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  lineHeight: 1,
                }}
              >
                ISB Group
              </div>
              <div style={{ fontSize: "11px", color: "#8C6A40", lineHeight: 1, marginTop: "2px" }}>
                Portail applicatif
              </div>
            </div>
          </div>

          <div className="h-6 w-px shrink-0" style={{ backgroundColor: "rgba(59,40,0,0.1)" }} />

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#8C6A40" }} />
            <input
              type="text"
              placeholder="Rechercher une application…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border outline-none transition-all"
              style={{
                fontSize: "13px",
                backgroundColor: "#FEEAD3",
                borderColor: search ? "#FFDD00" : "transparent",
                color: "#3B2800",
              }}
            />
          </div>

          <div className="flex-1" />

          {/* Notifications */}
          <button className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-[#FEEAD3] transition-colors">
            <Bell size={18} style={{ color: "#3B2800" }} />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: "#F08159" }}
            />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#FEEAD3] transition-colors"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#3B2800" }}
              >
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#FFDD00" }}>ML</span>
              </div>
              <span style={{ fontSize: "13px", fontWeight: 500, color: "#3B2800" }}>Marie Laurent</span>
              <ChevronDown
                size={14}
                style={{
                  color: "#8C6A40",
                  transform: userMenuOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-2xl border shadow-lg py-2 z-50"
                style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(59,40,0,0.08)" }}
              >
                <div className="px-4 py-2 border-b" style={{ borderColor: "rgba(59,40,0,0.08)" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#3B2800" }}>Marie Laurent</div>
                  <div style={{ fontSize: "12px", color: "#8C6A40" }}>Responsable SI</div>
                </div>
                {[
                  { icon: User, label: "Mon profil" },
                  { icon: Settings, label: "Préférences" },
                  { icon: HelpCircle, label: "Aide & support" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#FEEAD3] transition-colors text-left"
                  >
                    <Icon size={15} style={{ color: "#8C6A40" }} />
                    <span style={{ fontSize: "13px", color: "#3B2800" }}>{label}</span>
                  </button>
                ))}
                <div className="border-t my-1" style={{ borderColor: "rgba(59,40,0,0.08)" }} />
                <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#FEF0EA] transition-colors text-left">
                  <LogOut size={15} style={{ color: "#F08159" }} />
                  <span style={{ fontSize: "13px", color: "#F08159" }}>Se déconnecter</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page title + CTA */}
        <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
          <div>
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "28px",
                fontWeight: 800,
                color: "#3B2800",
                lineHeight: 1.2,
              }}
            >
              Applications internes
            </h1>
            <p style={{ fontSize: "15px", color: "#8C6A40", marginTop: "6px" }}>
              Retrouvez et lancez toutes vos applications métier ISB
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl hover:brightness-95 active:scale-95 transition-all shrink-0 shadow-sm"
            style={{
              backgroundColor: "#FFDD00",
              color: "#3B2800",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            Ajouter une application
          </button>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-xl transition-all"
              style={{
                fontSize: "13px",
                fontWeight: activeCategory === cat ? 600 : 400,
                backgroundColor: activeCategory === cat ? "#3B2800" : "#FEEAD3",
                color: activeCategory === cat ? "#FFDD00" : "#8C6A40",
                border: "none",
              }}
            >
              {cat}
            </button>
          ))}

          {filtered.length > 0 && (
            <span className="ml-auto" style={{ fontSize: "13px", color: "#8C6A40" }}>
              {filtered.length} application{filtered.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* App grid */}
        {filtered.length > 0 ? (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
          >
            {filtered.map((app) => (
              <AppCard
                key={app.id}
                name={app.name}
                description={app.description}
                icon={app.icon}
                color={app.color}
                bgColor={app.bgColor}
                category={app.category}
                onClick={() => handleLaunch(app.name)}
              />
            ))}

            {/* Add app tile */}
            <button
              onClick={() => setShowModal(true)}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed hover:border-[#FFDD00] hover:bg-white transition-all group min-h-[180px]"
              style={{ borderColor: "rgba(59,40,0,0.15)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors group-hover:bg-[#FFDD00]"
                style={{ backgroundColor: "#FEEAD3" }}
              >
                <Plus size={22} style={{ color: "#8C6A40" }} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#8C6A40" }}>
                Nouvelle application
              </span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "#FEEAD3" }}
            >
              <Search size={28} style={{ color: "#D19571" }} />
            </div>
            <div className="text-center">
              <p style={{ fontSize: "16px", fontWeight: 600, color: "#3B2800" }}>Aucune application trouvée</p>
              <p style={{ fontSize: "14px", color: "#8C6A40", marginTop: "4px" }}>
                Essayez un autre terme ou une autre catégorie
              </p>
            </div>
            <button
              onClick={() => { setSearch(""); setActiveCategory("Toutes"); }}
              className="px-4 py-2 rounded-xl transition-colors"
              style={{ backgroundColor: "#FEEAD3", color: "#3B2800", fontSize: "13px", fontWeight: 500 }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16" style={{ borderColor: "rgba(59,40,0,0.08)" }}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <ISBLogo size={22} />
            <span style={{ fontSize: "13px", color: "#8C6A40" }}>
              © 2026 ISB Group — Portail applicatif interne
            </span>
          </div>
          <div className="flex items-center gap-4">
            {["Support", "Documentation", "Conditions d'utilisation"].map((item) => (
              <a
                key={item}
                href="#"
                style={{ fontSize: "12px", color: "#8C6A40" }}
                className="hover:underline"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Launch toast */}
      {launchedApp && (
        <div
          className="fixed bottom-6 right-6 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl z-50"
          style={{
            backgroundColor: "#3B2800",
            color: "#FFDD00",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          <Zap size={16} fill="#FFDD00" />
          Lancement de {launchedApp}…
        </div>
      )}

      {/* Add App Modal */}
      {showModal && (
        <AddAppModal onClose={() => setShowModal(false)} onAdd={handleAddApp} />
      )}

      {/* Close user menu on outside click */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
      )}
    </div>
  );
}
