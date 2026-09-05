# FreePPT 建站计划书

## 1. 产品定位

FreePPT 是一个极简 AI 演示文稿生成工具。用户用一句话描述需求，或上传 Word、PowerPoint、Excel、PDF 和图片等参考材料，系统完成内容整理、结构生成与视觉排版，最终同时交付可编辑的 PPTX 和可分享的 HTML 演示文稿。

核心承诺：**第一次免费，无订阅，用一次付一次。**

## 2. 目标用户与场景

- 临时需要汇报材料的职场用户：周报、方案、项目复盘、销售提案。
- 教师与学生：课程、研究报告、课堂展示。
- 小团队和自由职业者：客户提案、产品介绍、融资材料初稿。
- 已有文档但缺少设计时间的用户：Word/PDF/Excel 转 PPT。

## 3. MVP 范围

### 用户流程

1. 用户注册或登录，获得 1 次免费生成额度。
2. 在首页输入生成要求，可附加最多 8 个文件，单次总文件建议限制 25 MB。
3. 提交后创建生成任务，进入队列页。
4. 后台解析附件、生成大纲、内容和页面设计。
5. 完成后提供 `.pptx` 与 HTML 两个下载项。
6. 免费次数用完后，按次或购买次数包。

### 快速原型范围

- 首页生成器、文件选择/拖拽、文件标签删除。
- 队列和已完成任务的视觉状态。
- Pricing 页面及套餐选择。
- 所有提交、下载、登录和支付动作展示 Coming Soon 等候名单弹窗。
- 不接入真实数据库、文件存储、AI、支付或用户系统。

## 4. 定价

| 套餐 | 价格 | 单次成本 | 折扣 |
|---|---:|---:|---:|
| 注册试用 | $0 / 1 次 | $0 | — |
| 单次生成 | $5 / 次 | $5 | — |
| 10 次包 | $40 | $4 | 20% |
| 25 次包 | $75 | $3 | 40% |

次数长期有效；每次生成同时包含 PPTX 和 HTML。正式上线前需明确失败任务是否退还次数，建议自动退还。

## 5. 页面和 SEO 架构

- `/`：产品主页，后期主攻 `ai presentation maker`。
- `/pricing`：定价与购买次数。
- `/queue`：用户任务列表。
- `/resources`：SEO 内容中心，聚合 FAQ、Blog、工具组合、Tutorials 和模板。
- 后续 SEO 工具落地页：`/ai-presentation-maker-from-text`、`/word-to-ppt`、`/pdf-to-ppt`、`/free-ai-presentation-maker`、`/ai-presentation-maker-online`。
- Free PPT 模板中心：`/templates`，通过行业、场景、风格和受众分类覆盖模板型搜索需求。

首发 SEO 优先级以 Ahrefs 结果为依据：先覆盖 `ai presentation maker from text`（KD 19）和 `word to ppt ai`（KD 12），再挑战 `ai presentation maker free`（KD 27）。

### 5.1 SEO 内容类型

1. **FAQ**：围绕 PPT 制作、尺寸、格式、字体、图片、演讲和导出问题覆盖长尾词；每页直接回答一个问题，并使用 FAQ 结构化数据。
2. **Blog**：发布 PPT 制作经验、案例拆解和 YouTube 长视频摘要，覆盖行业词、KOL 名称与方法论关键词。
3. **工具组合**：讲解 ChatGPT、Claude、Gemini、新 AGI 模型或 Agent 与 FreePPT 的组合流程，覆盖新模型和工具趋势词。
4. **Tutorials**：围绕本工具的使用流程、输入格式和具体场景制作教程，重点覆盖 `free`、`free trial` 和场景词。
5. **Free PPT Templates**：提供可预览、可下载、可编辑的免费 PPT 模板，以高购买/下载意图的模板关键词获取自然流量，并把访问者引导到 AI 生成器进行个性化改写。

### 5.2 Free PPT 模板页信息架构

模板采用“中心页 → 分类页 → 模板详情页”三级结构：

- `/templates`：模板中心，目标词为 `free ppt templates`、`free powerpoint templates`、`presentation templates free`。
- `/templates/business`：行业或用途分类页，例如 Business、Education、Marketing、Sales、Startup、Medical、Technology。
- `/templates/minimalist`：风格分类页，例如 Minimalist、Modern、Creative、Professional、Cute、Dark、Aesthetic。
- `/templates/pitch-deck`：场景分类页，例如 Pitch Deck、Project Proposal、Company Profile、Lesson Plan、Thesis Defense、Annual Report、Timeline。
- `/templates/business-plan-presentation`：单个模板详情页，使用描述性 slug，不在 URL 中使用无意义模板编号。

每个模板只设置一个主分类 canonical URL；其他筛选组合使用客户端筛选或 `noindex, follow`，避免颜色、比例、页数等参数生成大量重复页面。首批只建立有独立搜索需求和足够内容的分类页。

### 5.3 模板详情页内容模块

每个模板详情页至少包含：

1. 唯一的 SEO 标题、描述、H1 和 150–300 字用途介绍。
2. 6–12 张真实幻灯片预览图；首图设置准确的 `alt`，其余图片使用与页面内容相关的描述。
3. 模板页数、比例、适用软件、字体、文件大小、语言和授权范围。
4. `Download free PPTX` 主按钮，以及 `Customize with AI` 次按钮。
5. 模板包含的页面清单，例如封面、目录、问题、方案、数据、时间线和结尾页。
6. 编辑教程、字体替换说明、图片来源和兼容性说明。
7. 3–5 个相关模板和至少一个相关 Tutorial/Blog 内链。
8. 面包屑、FAQ，以及 `BreadcrumbList`、`CreativeWork` 或适用的结构化数据。

模板下载应提供真正可编辑的 `.pptx`，不使用只有预览图或 PDF 的假下载。下载前不强制注册；点击 AI 定制或生成更多页面时再引导注册并使用首次免费额度。

### 5.4 首批模板主题

首批以明确用途、可复用性高、能够自然引导 AI 定制的主题为主：

| 优先级 | 模板主题 | 主要关键词方向 | 转化入口 |
|---|---|---|---|
| P0 | Business Plan | business plan ppt template free | 上传商业计划并生成完整演示 |
| P0 | Pitch Deck | free pitch deck template | 根据创业项目定制融资材料 |
| P0 | Company Profile | company profile ppt template free | 输入公司信息自动替换内容 |
| P0 | Project Proposal | project proposal ppt template free | 从 Word/PDF 提案生成 PPT |
| P0 | Thesis Defense | thesis defense ppt template free | 上传论文生成答辩演示 |
| P1 | Marketing Plan | marketing plan ppt template free | 生成营销策略和活动计划 |
| P1 | Sales Presentation | sales presentation template free | 根据产品资料生成销售提案 |
| P1 | Lesson Plan | education ppt templates free | 根据课程材料生成教学课件 |
| P1 | Annual Report | annual report ppt template free | 上传 Excel 生成年报图表 |
| P1 | Timeline | powerpoint timeline template free | 根据事件列表生成时间线 |

正式排期前使用 Ahrefs MCP 分别验证美国及目标语言市场的 Volume、KD、Traffic Potential、Parent Topic 和 SERP 结果。关键词数据只用于确定优先级，不在模板页中堆砌同义词。

### 5.5 模板质量与版权门槛

- 每套模板必须有独立设计和真实可编辑元素，不批量发布只换颜色或标题的近重复模板。
- 图片、插画、图标和字体必须允许商业分发；保存来源、作者、许可证和下载日期记录。
- 不使用未经授权的品牌 Logo、影视角色、网红肖像或第三方付费模板素材。
- 字体优先选择允许再分发的开源字体，并在详情页提供替代字体建议。
- 每个模板在 PowerPoint 中检查文本溢出、缺失字体、图片裁切、主题色、母版和 16:9 显示效果。
- 模板文件经过恶意文件扫描；下载响应提供准确 MIME、文件大小和校验值。

### 5.6 模板 SEO 与多语言策略

- 英文模板 URL 作为首发版本；简体中文、繁体中文、日文、韩文、法语、西班牙语和俄语只有在标题、正文、FAQ 和模板内示例文字完成本地化后才进入 sitemap。
- 各语言页面使用独立 canonical，并通过互相对应的 `hreflang` 与 `x-default` 关联；未翻译页面不生成伪多语言副本。
- 模板预览图使用 WebP/AVIF、固定宽高和延迟加载；首屏主图可预加载，避免图片集合拖慢 Core Web Vitals。
- 模板中心和分类页使用分页或可抓取的“加载更多”链接，不让模板只能通过站内搜索发现。
- XML sitemap 按内容类型拆分为模板中心、模板详情和文章，并在模板发布或更新时同步 `lastmod`。
- 下架模板优先提供替代模板并做 301；没有替代内容时返回 410，不把所有失效 URL 重定向到模板中心。

### 5.7 模板页转化与衡量

模板页兼顾免费获取和产品转化，跟踪以下 PostHog 事件：

- `template_viewed`：模板详情访问，记录模板、分类和语言。
- `template_preview_opened`：用户查看大图或完整幻灯片预览。
- `template_downloaded`：免费 PPTX 下载成功。
- `template_customize_clicked`：点击 AI 定制。
- `template_generation_started`：从模板进入生成队列。

核心指标为模板页自然访问量、搜索点击率、预览率、下载率、AI 定制点击率、注册率和首次生成完成率。模板下载量不能单独作为成功标准，最终目标是把高意图访客转化为 AI 生成用户。

### 5.8 发布节奏

1. **第 1 周**：完成模板中心、分类页、详情页组件和 3 套 P0 模板，建立版权台账与下载追踪。
2. **第 2 周**：补齐其余 2 套 P0 模板，发布 Business、Pitch Deck、Company Profile 三个分类页。
3. **第 3–4 周**：每周发布 3–5 套 P1 模板，并为已有模板增加相关教程和站内链接。
4. **稳定期**：依据 Search Console 展现词、模板下载和 AI 定制率更新模板；每月淘汰或合并低质量重复页。

上线初期坚持“少而完整”：首批 5 套高质量模板优于一次生成数百个薄页面。模板页只有在文件、预览、独特说明、授权信息和下载链路全部就绪后才允许进入 sitemap。

## 6. 正式版技术建议

- 前端：Next.js + TypeScript，服务端渲染 SEO 页面。
- API：Next.js Route Handlers 或独立任务 API。
- 存储：S3 兼容对象存储，上传采用短期签名 URL。
- 数据库：PostgreSQL，保存用户、额度账本、任务、附件和产物。
- 队列：Redis + BullMQ，任务必须幂等并支持失败重试。
- 文档解析：隔离容器处理 Office/PDF；图片进入 OCR/视觉模型。
- PPTX：使用 PptxGenJS 或服务端模板引擎；HTML 使用同一中间页面模型渲染。
- 支付：Stripe Checkout；通过 webhook 原子增加额度。

## 7. 数据模型

- `users`：身份与注册时间。
- `credit_ledger`：赠送、购买、消耗和退还，使用账本而不是单一余额。
- `generation_jobs`：任务状态、提示词、错误、进度和时间戳。
- `assets`：上传文件及解析状态。
- `outputs`：PPTX/HTML 的存储位置、大小和过期策略。

## 8. 安全与成本控制

- 文件扩展名、MIME 和真实文件头三重校验；隔离解析并做恶意文件扫描。
- 上传链接和下载链接短期有效，禁止公开桶。
- 每个账号/IP 做速率限制；免费试用需防批量注册滥用。
- 提交任务时预扣额度，失败时自动退还。
- 保存模型与渲染耗时，确保单次边际成本显著低于 $5。

## 9. 迭代路线

1. **原型（当前）**：验证定位、操作流、定价和等候名单转化。
2. **Alpha**：注册、文件上传、真实任务队列、单一 PPT 模板、PPTX/HTML 输出。
3. **Beta**：Stripe 额度购买、更多模板、失败重试、邮件通知。
4. **增长版**：SEO 工具页、Free PPT 模板中心、Google Slides、团队额度和品牌模板。

## 10. 核心指标

- 首页到提交意向转化率。
- 注册到首次生成完成率。
- 首次免费生成到付费转化率。
- 任务成功率、P50/P95 生成时间和单次成本。
- PPTX/HTML 下载率及 30 天复购率。
- 模板自然搜索流量、免费模板下载率，以及模板访问到 AI 定制和首次生成的转化率。
