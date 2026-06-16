# FitMirror

手机优先的 AI 换装 MVP。包含参数化 2D 人物、轻量 3D 轮廓、7 个姿势、24 件预制服装、尺寸/褶皱规则、异步生成任务与 FASHN 适配层。

## 启动

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`，服装台账位于 `/admin`。

未配置 `FASHN_API_KEY` 时使用本地异步模拟。真实 FASHN Try-On Max 还需要将模特图和商品图上传至可访问的对象存储，并在生成请求中提供 `modelImage` 与 `productImage` URL。

当前任务缓存保存在进程内，仅适合演示。生产环境应替换为 PostgreSQL + Redis/队列，并通过 webhook 或状态轮询持久化任务结果。
