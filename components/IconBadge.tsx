import {
  BookOpen,
  Building2,
  CheckCircle2,
  CircuitBoard,
  Headphones,
  Laptop,
  LucideIcon,
  NotebookPen,
  Radio,
  ShieldCheck,
  Smartphone,
  Users,
  Zap
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "building-2": Building2,
  "circuit-board": CircuitBoard,
  headphones: Headphones,
  laptop: Laptop,
  "notebook-pen": NotebookPen,
  radio: Radio,
  "shield-check": ShieldCheck,
  smartphone: Smartphone,
  users: Users,
  zap: Zap
};

type IconBadgeProps = {
  name?: string;
  label?: string;
};

export function IconBadge({ name = "check", label }: IconBadgeProps) {
  const Icon = iconMap[name] || CheckCircle2;

  return (
    <span
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-primary"
      aria-label={label}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  );
}
