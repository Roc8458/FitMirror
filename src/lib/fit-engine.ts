import type { BodyProfile, FitResult, Garment, PoseId } from "./types";

export function estimateBody(profile: BodyProfile) {
  const bmi = profile.weight / Math.pow(profile.height / 100, 2);
  const typeFactor = { slim: -3, balanced: 0, curvy: 5, strong: 4 }[profile.bodyType];
  const genderFactor = profile.gender === "female" ? -3 : 3;
  return {
    bmi,
    chest: 78 + bmi * 0.75 + typeFactor + genderFactor,
    waist: 57 + bmi * 0.92 + typeFactor,
    hip: 77 + bmi * 0.83 + (profile.bodyType === "curvy" ? 8 : 2),
    torso: profile.height * 0.35,
    leg: profile.height * 0.46,
  };
}

export function analyzeFit(profile: BodyProfile, garment: Garment, size: string, pose: PoseId): FitResult {
  const body = estimateBody(profile);
  const m = garment.sizes[size] ?? garment.sizes[garment.defaultSize];
  const circumference = garment.category === "pants" ? (m.hip ?? m.waist) : (m.chest ?? m.waist);
  const bodyCirc = garment.category === "pants" ? body.hip : body.chest;
  const ease = circumference ? circumference - bodyCirc : 12;
  const fit = ease < 2 ? "紧身" : ease < 10 ? "合身" : ease < 20 ? "微宽松" : "宽松";
  const targetLength = garment.category === "pants" ? body.leg * 1.2 : body.torso * 1.15;
  const actualLength = garment.category === "pants" ? (m.length ?? targetLength) : (m.length ?? targetLength);
  const delta = actualLength - targetLength;
  const length = delta < -4 ? "偏短" : delta > 5 ? "偏长" : "适中";
  const poseStress = { front: 0, side: 1, back: 1, walk: 3, akimbo: 4, lookdown: 2, sit: 5 }[pose];
  const materialFold = garment.fabric.drape + garment.fabric.thickness - garment.fabric.stiffness;
  const wrinkle = garment.category === "pants"
    ? delta > 4 ? "裤脚轻微堆积" : poseStress >= 4 ? "膝部与裆部褶皱明显" : "裤线自然"
    : poseStress >= 4 ? "腋下与腰腹形成动作褶" : materialFold > 3 ? "自然垂坠" : "轮廓较挺括";
  return { garmentId: garment.id, fit, length, wrinkle, score: Math.max(35, Math.min(98, 90 - Math.abs(ease - 10) - Math.abs(delta) * 1.4)) };
}
