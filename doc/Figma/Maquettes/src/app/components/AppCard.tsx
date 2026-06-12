import { LucideIcon } from "lucide-react";

interface AppCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  category: string;
  onClick?: () => void;
}

export function AppCard({ name, description, icon: Icon, color, bgColor, category, onClick }: AppCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start gap-4 p-6 bg-white rounded-2xl border border-[rgba(59,40,0,0.08)] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left w-full cursor-pointer"
      style={{ "--hover-accent": color } as React.CSSProperties}
    >
      <div
        className="flex items-center justify-center w-14 h-14 rounded-xl transition-transform duration-200 group-hover:scale-105"
        style={{ backgroundColor: bgColor }}
      >
        <Icon size={26} style={{ color }} strokeWidth={1.8} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span
            className="text-[13px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#FEEAD3", color: "#8C6A40" }}
          >
            {category}
          </span>
        </div>
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#3B2800", lineHeight: 1.3, marginTop: "6px" }}>
          {name}
        </h3>
        <p style={{ fontSize: "13px", color: "#8C6A40", marginTop: "4px", lineHeight: 1.5 }}>{description}</p>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ backgroundColor: "#FFDD00" }}
      />
    </button>
  );
}
