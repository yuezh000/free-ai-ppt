# FreeAIPPT 每日模板创建与发布 Prompt

你正在维护 FreeAIPPT 项目。请自主完成“搜索免费 PPT 模板 → 研究设计方向 → 创建原创模板 → 建设 SEO 资源页 → 测试 → 发布上线”的完整流程。

## 项目目标

持续扩充 <https://freeaippt.space/templates> 的免费 PPT 模板资源库，为每个常用 PPT 类别增加原创、可编辑、可下载的 PPTX 模板及对应 SEO 页面。

## 一、运行前检查

1. 进入 FreeAIPPT 仓库根目录。
2. 阅读仓库中的 `AGENTS.md`，并严格遵守环境、编译、临时文件和部署要求。
3. 检查 Git 状态：
   - 如果存在不属于本次任务的未提交修改，停止执行并记录原因。
   - 工作区干净时执行 `git pull --ff-only`。
4. 检查现有内容：
   - `lib/templates.ts`
   - `lib/template-i18n.ts`
   - `docs/free-template-research-*.md`
   - `public/templates/files`
   - `public/templates/previews`
5. 不得重复已有模板名称、搜索意图、参考来源或高度相似的视觉方向。

## 二、模板类别

以网站当前已经存在的模板类别为准。默认类别包括：

1. Business Plan
2. Startup Pitch Deck
3. Company Profile
4. Marketing Plan
5. Project Proposal
6. Sales Report
7. Lesson Plan
8. Thesis Defense
9. Clinical Case
10. AI & Technology
11. Creative Portfolio
12. Product Roadmap

每次运行时，每个类别最多新增一个模板。若某类别找不到合适、可信且与现有内容不重复的参考，则跳过该类别，不要强行凑数。

## 三、网络研究

针对每个类别搜索一个公开可访问的免费 PPT 模板页面，优先选择：

- Slidesgo
- SlidesCarnival
- Canva
- Microsoft Create
- Adobe Express
- PresentationGO
- SlidesMania
- 其他可信模板网站

搜索时重点覆盖：

- `free PowerPoint template`
- `free PPT template download`
- `editable PowerPoint template`
- `free [category] presentation template`
- `free trial`
- `no sign up`
- 具体场景长尾关键词

必须实际打开参考页面，确认：

1. 页面仍然可以访问。
2. 页面确实提供免费模板或免费使用入口。
3. 主题属于目标类别。
4. 与 FreeAIPPT 已有模板不存在明显重复。
5. 记录页面标题、URL、类别、调研日期。

禁止仅根据搜索结果摘要编造模板信息。

## 四、原创性边界

外部模板只能用于观察以下抽象特征：

- 大致色彩家族
- 明暗关系
- 信息密度
- 正式、活泼、科技、编辑感等整体氛围
- 标题与正文的层级关系
- 内容节奏和演示场景

严禁复制或导入：

- 原始 PPTX、POTX 或 Google Slides 文件
- 原模板中的图片、照片、插画、图标、字体
- 原模板的装饰元素、背景纹理、贴纸或图案
- 原模板的图表、时间线、地图、表格或信息图
- 原模板的文字、标题、数据、案例和页面顺序
- 可识别的单页布局、构图比例或连续页面组合
- 从参考网站截取的模板预览图片

参考文件和网页截图不得进入项目仓库。临时研究材料只能放在 `/tmp/codex` 下。

## 五、创建原创模板

每个新模板必须：

1. 从空白画布开始创建。
2. 使用 PptxGenJS 和 PowerPoint 原生元素生成。
3. 仅使用系统字体和原生形状。
4. 包含恰好 8 张 16:9 幻灯片。
5. 所有文字、形状、颜色和布局均可编辑。
6. 使用原创英文占位文案。
7. 所有示例数字必须明显属于占位数据。
8. 不得包含未经验证的真实企业、医疗或研究结论。
9. 不得依赖需要额外下载的字体或第三方素材。
10. 新模板之间以及与现有模板之间必须具有明显不同的视觉系统。

每套模板至少覆盖：

- 封面
- 背景或问题
- 核心内容
- 数据或证据
- 方法、方案或过程
- 计划、时间线或结构
- 风险、限制或下一步
- 总结及 CTA

为每个模板定义：

- `slug`
- `name`
- `shortName`
- `category`
- `categorySlug`
- `description`
- `longDescription`
- `accent`
- `dark`
- `soft`
- `tags`
- `slides`
- `included`
- `bestFor`

## 六、预览图与视觉检查

所有生成和编译操作必须按照 `AGENTS.md` 要求，在 aibox 的 Docker 环境中执行。

1. 运行模板生成脚本，输出可编辑 PPTX。
2. 使用 LibreOffice 将 PPTX 转换为 PDF。
3. 使用 `pdftoppm` 生成每页 JPG 预览。
4. 每套模板必须产生：
   - 1 个 PPTX
   - 8 张 JPG
5. 检查全部封面，并抽查每套模板至少两张内容页。
6. 检查：
   - 文字是否溢出或被截断
   - 对比度是否足够
   - 页面是否过于空洞
   - 图形是否互相遮挡
   - 页码和标题是否一致
   - 不同模板是否过于同质化
7. 视觉检查未通过时，修改生成脚本并重新生成。

## 七、SEO 资源页

将新模板加入现有模板系统，并为每个模板提供：

1. 分类页入口。
2. 独立模板详情页。
3. 唯一 canonical URL。
4. 针对搜索意图编写的 title 和 description。
5. 模板预览画廊。
6. `Download PPTX` 下载入口。
7. `Customize with AI` 入口，并正确携带 `template` 参数。
8. 使用场景、包含页面、模板说明和 FAQ。
9. `CreativeWork`、`BreadcrumbList`、`FAQPage` 等适用的 JSON-LD。
10. sitemap 收录。
11. 首页模板区域保持精简，不得因为模板增加而无限增长。
12. 保持英语、简体中文、繁体中文、日文、韩文、法文、西班牙文和俄文路由可用。
13. 所有按钮和关键交互增加稳定的 `data-testid`。

不得修改登录、支付、API、Feature Flag、WAITLIST 或任务队列逻辑。

## 八、研究记录

更新当天的研究记录：

```text
docs/free-template-research-YYYY-MM-DD.md
```

每个模板记录：

- FreeAIPPT 模板名称
- 类别
- 参考页面标题
- 参考 URL
- 仅借鉴的抽象设计信号
- 明确排除和未使用的原始元素
- 原创视觉系统说明

不得声称 FreeAIPPT 模板是参考网站模板的修改版、授权版本或衍生版本。

## 九、自动化测试

在 aibox Docker 中执行：

1. 源码 lint。
2. TypeScript 类型检查。
3. Next.js 完整生产构建。
4. 模板文件和预览图数量检查。
5. UI 自动化测试。
6. 模板目录测试至少验证：
   - 分类数量
   - 新模板卡片存在
   - 分类页跳转
   - 模板详情页
   - PPTX 下载链接
   - 中文路由不会跳回英文
7. 现有登录、任务提交、候选登记和管理员 UI 回归测试必须继续通过。

任何检查失败时不得发布。

## 十、发布上线

测试全部通过后：

1. 在 aibox Docker 中执行 Vercel production build。
2. 使用仓库现有的 Vercel 项目配置部署。
3. 将生产部署绑定到 <https://freeaippt.space>。
4. 不得修改现有域名、环境变量或 Vercel 项目归属。
5. 发布后逐项验证 HTTP 200：
   - `/templates`
   - 新分类页
   - 新模板详情页
   - 至少一个中文模板页
   - 新 PPTX 文件
   - `/sitemap.xml`
6. 检查 sitemap 中包含新分类页和模板详情页。

## 十一、Git 提交

只有线上验证通过后才能提交：

1. 再次执行 `git diff --check`。
2. 确认没有提交临时文件、来源模板、密钥、日志或测试产物。
3. 使用清晰的提交信息，例如：

   ```text
   feat: add daily original PPT template resources
   ```

4. 推送到 `origin/main`。
5. 禁止 force push、`reset --hard` 或覆盖用户修改。

## 十二、最终报告

任务完成后输出简洁报告，包含：

- 本次新增模板数量
- 新增模板及类别列表
- 每个模板的线上 URL
- 外部参考页面 URL
- 原创性检查结果
- PPTX 和预览图数量
- lint、build 和测试结果
- Vercel 部署地址
- sitemap URL 数量
- Git commit
- 跳过的类别及原因
- 失败时的具体阻塞点

如果本次没有找到满足原创性和质量要求的新模板，应保持线上和仓库不变，并明确报告“本次没有安全、合适的新模板可发布”。
