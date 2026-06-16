import type { BodyProfile, OutfitSelection, PoseId } from "@/lib/types";
import { garments } from "@/lib/garments";

const poseClass: Record<PoseId, string> = {
  front: "pose-front", side: "pose-side", back: "pose-back", walk: "pose-walk", akimbo: "pose-akimbo", lookdown: "pose-lookdown", sit: "pose-sit",
};

export function BodyFigure({ profile, pose, outfit }: { profile: BodyProfile; pose: PoseId; outfit: OutfitSelection }) {
  const bmi = profile.weight / Math.pow(profile.height / 100, 2);
  const width = 0.84 + (bmi - 18) * 0.025 + (profile.bodyType === "curvy" ? 0.09 : profile.bodyType === "strong" ? 0.07 : 0);
  const height = 0.9 + (profile.height - 160) / 220;
  const selected = Object.values(outfit).flatMap((item) => item ? [garments.find((g) => g.id === item.garmentId)] : []).filter(Boolean);
  const color = (category: string, fallback: string) => selected.find((g) => g?.category === category)?.color ?? fallback;
  return (
    <div className={`figure ${poseClass[pose]} ${profile.gender}`} style={{ "--body-w": width, "--body-h": height } as React.CSSProperties} aria-label="可变身型人物示意">
      <div className="head"><span className="hair" /><span className="ear" /></div>
      <div className="neck" />
      <div className="torso" style={{ background: color("top", color("inner", "#d7c0ae")) }}><span className="collar" /></div>
      <div className="arm left" /><div className="arm right" />
      <div className="waist" style={{ background: color("belt", color("top", "#d7c0ae")) }} />
      <div className="leg left" style={{ background: color("pants", "#454744") }} />
      <div className="leg right" style={{ background: color("pants", "#454744") }} />
      <div className="shoe left" style={{ background: color("shoes", "#e8e2d7") }} />
      <div className="shoe right" style={{ background: color("shoes", "#e8e2d7") }} />
      {outfit.hat ? <div className="hat" style={{ background: color("hat", "#222") }} /> : null}
      {outfit.glasses ? <div className="glasses" /> : null}
      {outfit.coat ? <div className="coat" style={{ borderColor: color("coat", "#555") }} /> : null}
      <div className="folds"><i /><i /><i /></div>
    </div>
  );
}
