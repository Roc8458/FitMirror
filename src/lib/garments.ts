import type { Garment, GarmentCategory } from "./types";

const sizes = (base: { chest?: number; waist?: number; hip?: number; length?: number; inseam?: number; hem?: number }) => ({
  S: Object.fromEntries(Object.entries(base).map(([k, v]) => [k, (v ?? 0) - (k === "length" || k === "inseam" ? 1 : 4)])),
  M: base,
  L: Object.fromEntries(Object.entries(base).map(([k, v]) => [k, (v ?? 0) + (k === "length" || k === "inseam" ? 1 : 4)])),
  XL: Object.fromEntries(Object.entries(base).map(([k, v]) => [k, (v ?? 0) + (k === "length" || k === "inseam" ? 2 : 8)])),
});

const make = (
  id: string,
  name: string,
  category: GarmentCategory,
  color: string,
  accent: string,
  base: Parameters<typeof sizes>[0],
  silhouette: Garment["silhouette"] = "regular",
  fabric = { thickness: 2, stretch: 2, stiffness: 2, drape: 3 },
): Garment => ({
  id,
  name,
  category,
  color,
  accent,
  sizes: sizes(base),
  defaultSize: "M",
  fabric,
  silhouette,
});

export const garments: Garment[] = [
  make("inner-rib", "罗纹背心", "inner", "#e9e1d3", "#8f8373", { chest: 82, waist: 74, length: 58 }, "fitted", { thickness: 1, stretch: 5, stiffness: 1, drape: 4 }),
  make("inner-black", "黑色背心", "inner", "#242322", "#101010", { chest: 84, waist: 76, length: 60 }, "fitted"),
  make("tee-white", "净白短袖", "top", "#f5f2e9", "#b8b2a5", { chest: 104, waist: 102, length: 70 }, "regular"),
  make("tee-ink", "水墨印花T恤", "top", "#d9d4c8", "#2f302e", { chest: 112, waist: 110, length: 73 }, "relaxed"),
  make("shirt-blue", "雾蓝牛津衬衫", "top", "#8ba3ad", "#e1e8e8", { chest: 110, waist: 106, length: 75 }, "relaxed", { thickness: 2, stretch: 1, stiffness: 4, drape: 2 }),
  make("shirt-stripe", "细条纹衬衫", "top", "#d5d8d2", "#586a70", { chest: 108, waist: 104, length: 74 }, "regular"),
  make("hoodie-ash", "灰调连帽衫", "coat", "#74746f", "#d1cfc8", { chest: 118, waist: 114, length: 71 }, "oversized", { thickness: 5, stretch: 2, stiffness: 3, drape: 2 }),
  make("jacket-red", "朱砂短夹克", "coat", "#a83c2d", "#52251f", { chest: 112, waist: 104, length: 61 }, "regular", { thickness: 4, stretch: 1, stiffness: 5, drape: 1 }),
  make("trench-sand", "砂岩风衣", "coat", "#b49b78", "#6b5b46", { chest: 116, waist: 112, length: 103 }, "relaxed", { thickness: 3, stretch: 1, stiffness: 4, drape: 3 }),
  make("coat-charcoal", "炭黑长外套", "coat", "#343636", "#171818", { chest: 120, waist: 116, length: 112 }, "oversized", { thickness: 5, stretch: 1, stiffness: 4, drape: 3 }),
  make("pants-straight", "深灰直筒裤", "pants", "#494b49", "#242625", { waist: 78, hip: 102, length: 103, inseam: 76, hem: 44 }, "regular"),
  make("pants-wide", "象牙阔腿裤", "pants", "#ddd6c5", "#a99f8a", { waist: 76, hip: 108, length: 106, inseam: 78, hem: 58 }, "relaxed", { thickness: 3, stretch: 1, stiffness: 3, drape: 4 }),
  make("jeans-indigo", "靛蓝牛仔裤", "pants", "#334e61", "#172d3b", { waist: 80, hip: 100, length: 104, inseam: 77, hem: 38 }, "regular", { thickness: 4, stretch: 2, stiffness: 5, drape: 1 }),
  make("cargo-olive", "橄榄工装裤", "pants", "#66705a", "#333a2d", { waist: 82, hip: 108, length: 102, inseam: 75, hem: 42 }, "relaxed", { thickness: 4, stretch: 1, stiffness: 4, drape: 2 }),
  make("belt-leather", "茶色皮带", "belt", "#6f4934", "#c5a66d", { waist: 88 }, "regular"),
  make("belt-black", "窄黑皮带", "belt", "#252422", "#9e9b91", { waist: 86 }, "regular"),
  make("cap-black", "短檐棒球帽", "hat", "#292a29", "#6f716e", {}, "regular"),
  make("beanie-red", "朱红针织帽", "hat", "#a24133", "#641f18", {}, "regular"),
  make("glasses-round", "琥珀圆框", "glasses", "#6c4837", "#c4a27d", {}, "regular"),
  make("glasses-silver", "银色细框", "glasses", "#9b9c99", "#343535", {}, "regular"),
  make("socks-white", "白色中筒袜", "socks", "#eeeae0", "#9d988d", {}, "regular"),
  make("socks-red", "砖红罗纹袜", "socks", "#8e392f", "#57221d", {}, "regular"),
  make("shoes-runner", "复古跑鞋", "shoes", "#d8d3c5", "#b24332", {}, "regular"),
  make("shoes-loafer", "黑色乐福鞋", "shoes", "#252524", "#858078", {}, "regular"),
];

export const categories: { id: GarmentCategory; label: string }[] = [
  { id: "hat", label: "帽子" },
  { id: "glasses", label: "眼镜" },
  { id: "inner", label: "内搭" },
  { id: "top", label: "外搭" },
  { id: "coat", label: "外套" },
  { id: "belt", label: "腰带" },
  { id: "pants", label: "裤子" },
  { id: "socks", label: "袜子" },
  { id: "shoes", label: "鞋子" },
];
