"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Box, Check, CircleUserRound, Dices, Rotate3D, Sparkles, WandSparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { BodyFigure } from "./body-figure";
import { analyzeFit } from "@/lib/fit-engine";
import { categories, garments } from "@/lib/garments";
import type { BodyProfile, GarmentCategory, OutfitSelection, PoseId } from "@/lib/types";

const ThreePreview = dynamic(() => import("./three-preview"), {
  ssr: false,
  loading: () => <div className="three-loading">正在装载 3D 轮廓…</div>,
});

const poses: { id: PoseId; label: string; glyph: string }[] = [
  { id: "front", label: "正面", glyph: "│" },
  { id: "side", label: "侧面", glyph: ")" },
  { id: "back", label: "背面", glyph: "┃" },
  { id: "walk", label: "行走", glyph: "入" },
  { id: "akimbo", label: "叉腰", glyph: "大" },
  { id: "lookdown", label: "低头", glyph: "亼" },
  { id: "sit", label: "坐姿", glyph: "几" },
];

const bodyTypes = [
  { id: "slim", label: "纤细" },
  { id: "balanced", label: "匀称" },
  { id: "curvy", label: "曲线" },
  { id: "strong", label: "健壮" },
] as const;

const silhouetteLabel = {
  fitted: "修身",
  regular: "标准",
  relaxed: "宽松",
  oversized: "廓形",
};

export function FittingStudio() {
  const [profile, setProfile] = useState<BodyProfile>({ gender: "female", height: 168, weight: 58, bodyType: "balanced" });
  const [pose, setPose] = useState<PoseId>("front");
  const [category, setCategory] = useState<GarmentCategory>("top");
  const [view, setView] = useState<"2d" | "3d">("2d");
  const [outfit, setOutfit] = useState<OutfitSelection>({
    top: { garmentId: "tee-ink", size: "M" },
    pants: { garmentId: "pants-wide", size: "M" },
    shoes: { garmentId: "shoes-runner", size: "M" },
  });
  const [job, setJob] = useState<{ id?: string; status: "idle" | "queued" | "completed" | "error"; progress: number }>({ status: "idle", progress: 0 });

  const selectedGarments = useMemo(
    () => Object.values(outfit).flatMap((item) => (item ? [garments.find((g) => g.id === item.garmentId)] : [])).filter((g): g is NonNullable<typeof g> => Boolean(g)),
    [outfit],
  );
  const fits = useMemo(
    () => selectedGarments.map((g) => analyzeFit(profile, g, outfit[g.category]?.size ?? g.defaultSize, pose)),
    [profile, pose, outfit, selectedGarments],
  );
  const activeGarments = garments.filter((g) => g.category === category);
  const leadingFit = fits[0];

  const generate = async () => {
    setJob({ status: "queued", progress: 6 });
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: profile,
          pose,
          garments: selectedGarments,
          fitPrompt: fits.map((f) => `${f.fit}，${f.length}，${f.wrinkle}`).join("；"),
        }),
      });
      const data = await response.json();
      setJob({ id: data.id, status: data.status === "completed" ? "completed" : "queued", progress: data.progress ?? 8 });
      if (data.status !== "completed") poll(data.id);
    } catch {
      setJob({ status: "error", progress: 0 });
    }
  };

  const poll = (id: string) => {
    const timer = window.setInterval(async () => {
      const response = await fetch(`/api/generate?id=${id}`);
      const data = await response.json();
      setJob({ id, status: data.status, progress: data.progress });
      if (data.status === "completed") window.clearInterval(timer);
    }, 900);
  };

  const toggleGarment = (garmentId: string) => {
    const current = outfit[category];
    setOutfit((prev) => ({
      ...prev,
      [category]: current?.garmentId === garmentId ? undefined : { garmentId, size: garments.find((g) => g.id === garmentId)?.defaultSize ?? "M" },
    }));
    setJob({ status: "idle", progress: 0 });
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span>FitMirror</span>
          <small>AI 试穿实验室 / 衣镜</small>
        </div>
        <Link className="profile-button" href="/admin" aria-label="服装管理后台">
          <CircleUserRound size={20} />
        </Link>
      </header>

      <section className="hero-copy">
        <p>根据身型、姿势和服装尺寸，先看比例，再生成高清试穿图。</p>
        <span>AI 视觉参考，不代表实际试穿或精确尺码结论</span>
      </section>

      <section className="studio-grid">
        <aside className="body-panel panel" aria-label="身型参数">
          <div className="panel-title">
            <span>BODY</span>
            <h2>身型参数</h2>
          </div>
          <div className="segmented">
            <button className={profile.gender === "female" ? "active" : ""} onClick={() => setProfile({ ...profile, gender: "female" })}>女</button>
            <button className={profile.gender === "male" ? "active" : ""} onClick={() => setProfile({ ...profile, gender: "male" })}>男</button>
          </div>
          <label>身高 <b>{profile.height} cm</b><input type="range" min="150" max="195" value={profile.height} onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })} /></label>
          <label>体重 <b>{profile.weight} kg</b><input type="range" min="40" max="110" value={profile.weight} onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })} /></label>
          <div className="body-types">
            {bodyTypes.map((type) => <button key={type.id} className={profile.bodyType === type.id ? "active" : ""} onClick={() => setProfile({ ...profile, bodyType: type.id })}>{type.label}</button>)}
          </div>
          <div className="measure-note"><Dices size={16} /><span>使用模板估算视觉比例，不虚构厘米级测量精度。</span></div>
        </aside>

        <section className="canvas-panel" aria-label="试穿预览">
          <div className="canvas-toolbar">
            <div className="view-toggle">
              <button className={view === "2d" ? "active" : ""} onClick={() => setView("2d")}>2D 效果</button>
              <button className={view === "3d" ? "active" : ""} onClick={() => setView("3d")}><Rotate3D size={14} />3D 轮廓</button>
            </div>
            <span>LOOK 024</span>
          </div>
          <div className="mirror-label">FITTING MIRROR</div>
          <div className="measurement-line vertical"><span>{profile.height} CM</span></div>
          <div className="measurement-line horizontal" />
          <div className="model-stage">{view === "2d" ? <BodyFigure profile={profile} pose={pose} outfit={outfit} /> : <ThreePreview profile={profile} />}</div>
          <div className="quick-badge"><Sparkles size={13} />即时分层示意</div>
          {job.status !== "idle" && (
            <div className={`generation-state ${job.status}`}>
              <span>{job.status === "completed" ? <Check size={15} /> : <WandSparkles size={15} />}{job.status === "completed" ? "高清试穿图已生成" : job.status === "error" ? "生成失败，可再次尝试" : `高清图生成中 ${job.progress}%`}</span>
              <div><i style={{ width: `${job.progress}%` }} /></div>
            </div>
          )}
        </section>

        <aside className="pose-panel panel" aria-label="动作姿势">
          <div className="panel-title">
            <span>POSE</span>
            <h2>动作姿势</h2>
          </div>
          <div className="pose-list">
            {poses.map((item) => (
              <button key={item.id} className={pose === item.id ? "active" : ""} onClick={() => { setPose(item.id); setJob({ status: "idle", progress: 0 }); }}>
                <i>{item.glyph}</i>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </aside>
      </section>

      <section className="wardrobe panel" aria-label="叠穿衣橱">
        <div className="wardrobe-head">
          <div className="panel-title">
            <span>LAYER</span>
            <h2>叠穿衣橱</h2>
          </div>
          <p>每层最多选择一件 · 当前 {selectedGarments.length} 件</p>
        </div>
        <div className="category-tabs">
          {categories.map((item) => <button key={item.id} className={category === item.id ? "active" : ""} onClick={() => setCategory(item.id)}>{item.label}{outfit[item.id] ? <i /> : null}</button>)}
        </div>
        <div className="garment-row">
          <button className="garment-card empty" onClick={() => setOutfit((prev) => ({ ...prev, [category]: undefined }))}><X size={20} /><span>不穿此层</span></button>
          {activeGarments.map((g) => {
            const selected = outfit[category]?.garmentId === g.id;
            return (
              <button key={g.id} className={`garment-card ${selected ? "selected" : ""}`} onClick={() => toggleGarment(g.id)}>
                <div className="garment-art" style={{ "--cloth": g.color, "--accent": g.accent } as React.CSSProperties}><Box size={30} /></div>
                <strong>{g.name}</strong>
                <span>{g.defaultSize} · {silhouetteLabel[g.silhouette]}</span>
                {selected ? <b><Check size={12} /></b> : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="result-bar">
        <div className="fit-summary">
          <span>版型分析</span>
          {leadingFit ? <p><i />{leadingFit.fit} / {leadingFit.length} / {leadingFit.wrinkle}</p> : <p><i />请选择服装后查看版型趋势</p>}
          {fits.slice(1, 3).map((fit) => <p key={fit.garmentId}><i />{fit.fit} / {fit.wrinkle}</p>)}
        </div>
        <button className="generate-button" onClick={generate} disabled={job.status === "queued"}>
          <span>{job.status === "queued" ? "高清生成中" : "生成高清试穿图"}<small>{job.status === "queued" ? "已先展示即时示意" : "先出示意 · 后台生成高质量图"}</small></span>
          <WandSparkles size={23} />
        </button>
      </section>
      <footer><span>AI 视觉参考，不代表实际试穿或精确尺码结论</span><span>FitMirror 实验版 0.1</span></footer>
    </main>
  );
}
