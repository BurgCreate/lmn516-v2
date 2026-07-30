import type { ReactNode } from "react";
import { GardenOrnament } from "@/components/garden";

type GardenSectionFrameProps = {
  children: ReactNode;
  variant: "notes" | "archive" | "about";
  marker: string;
};

const ornamentByVariant = {
  notes: "wildflower",
  archive: "vine",
  about: "bellflower",
} as const;

export default function GardenSectionFrame({
  children,
  variant,
  marker,
}: GardenSectionFrameProps) {
  const ornament = ornamentByVariant[variant];

  return (
    <div className={`garden-section-frame garden-section-frame-${variant}`}>
      <span className="garden-section-marker">{marker}</span>

      <GardenOrnament
        variant={ornament}
        className="garden-section-ornament garden-section-ornament-left"
      />
      <GardenOrnament
        variant={ornament}
        className="garden-section-ornament garden-section-ornament-right"
      />

      {children}
    </div>
  );
}
