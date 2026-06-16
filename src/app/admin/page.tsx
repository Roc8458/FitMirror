import Link from "next/link";
import { ArrowLeft, CheckCircle2, Database, ImageIcon, Ruler } from "lucide-react";
import { garments } from "@/lib/garments";

export default function AdminPage() {
  return (
    <main className="admin-shell">
      <header className="admin-head"><div><Link href="/"><ArrowLeft size={16} />返回试衣间</Link><h1>服装资产台账</h1><p>平台预制款 · 尺码与面料参数审核</p></div><button>新增服装资产</button></header>
      <section className="admin-stats"><article><Database /><span>服装资产<strong>{garments.length}</strong></span></article><article><Ruler /><span>尺码数据<strong>96 组</strong></span></article><article><ImageIcon /><span>商品图状态<strong>待接入对象存储</strong></span></article><article><CheckCircle2 /><span>动作测试<strong>7 个姿势</strong></span></article></section>
      <section className="admin-table"><div className="admin-table-head"><h2>首发服装</h2><span>当前为代码种子数据，接入 PostgreSQL 后可在线编辑</span></div><div className="table-scroll"><table><thead><tr><th>服装</th><th>分类</th><th>默认尺码</th><th>版型</th><th>厚度</th><th>弹性</th><th>垂坠</th><th>状态</th></tr></thead><tbody>{garments.map((garment) => <tr key={garment.id}><td><i style={{ background: garment.color }} />{garment.name}</td><td>{garment.category}</td><td>{garment.defaultSize}</td><td>{garment.silhouette}</td><td>{garment.fabric.thickness}/5</td><td>{garment.fabric.stretch}/5</td><td>{garment.fabric.drape}/5</td><td><b>已发布</b></td></tr>)}</tbody></table></div></section>
    </main>
  );
}
