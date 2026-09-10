import type { Locale } from "@/lib/i18n";

type TemplateSeoCopy = {
  categoryTitle: (name: string) => string;
  categoryDescription: (name: string) => string;
  templateDescription: (name: string) => string;
  templateAbout: (name: string, category: string) => string;
  byline: string;
  trustTitle: string;
  trustBody: string;
  included: string[];
  bestFor: (category: string) => string[];
  tags: (category: string) => string[];
  faqTitle: string;
  faq: (name: string) => Array<{ q: string; a: string }>;
  english: string;
};

export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
  ja: "ja_JP",
  ko: "ko_KR",
  fr: "fr_FR",
  es: "es_ES",
  ru: "ru_RU",
};

const copies: Record<Locale, TemplateSeoCopy> = {
  en: {
    categoryTitle: (name) => `Free ${name} PowerPoint Templates | FreeAIPPT`,
    categoryDescription: (name) => `Browse original ${name} PowerPoint templates with eight editable 16:9 slides. Download the PPTX free without signing up.`,
    templateDescription: (name) => `Download ${name}, an original eight-slide 16:9 PowerPoint template made with editable native elements. Free for personal and commercial presentations.`,
    templateAbout: (name, category) => `${name} is an original eight-slide structure designed by FreeAIPPT for ${category} presentations. It starts from a blank canvas and uses editable PowerPoint-native text and shapes. Replace all placeholder copy and figures with verified information before presenting.`,
    byline: "Designed and reviewed by FreeAIPPT",
    trustTitle: "Original design with a transparent creation process",
    trustBody: "Built from a blank canvas with native PowerPoint shapes and system fonts, then manually checked for readability, contrast, overflow, and editability. No source-template assets are included.",
    included: ["Cover", "Context or problem", "Core content", "Data or evidence", "Method or solution", "Plan or timeline", "Risks or next steps", "Summary and CTA"],
    bestFor: (category) => [`${category} presentations`, "Client and stakeholder meetings", "Internal team reviews", "Editable presentation starting points"],
    tags: (category) => [category, "PowerPoint", "Editable", "Free template"],
    faqTitle: "Frequently asked questions",
    faq: (name) => [
      { q: `Is ${name} free to download?`, a: "Yes. The PPTX can be downloaded without signing up and used in personal or commercial presentations under the template license." },
      { q: "Can every slide be edited?", a: "Yes. Text, colors, shapes, and layout elements are native PowerPoint objects. Replace the English placeholder content and sample figures with your own verified information." },
      { q: "How was this template created and reviewed?", a: "FreeAIPPT designed it from a blank 16:9 canvas using native shapes and system fonts, then manually reviewed all eight slides for readability, contrast, overflow, and editability." },
    ],
    english: "English",
  },
  "zh-CN": {
    categoryTitle: (name) => `免费${name} PowerPoint 模板下载 | FreeAIPPT`,
    categoryDescription: (name) => `浏览 FreeAIPPT 原创${name}模板。每套包含 8 页可编辑的 16:9 PowerPoint 版式，无需注册即可免费下载 PPTX。`,
    templateDescription: (name) => `免费下载${name}：8 页 16:9 原创 PowerPoint 模板，使用原生可编辑元素制作，可用于个人和商业演示。`,
    templateAbout: (name, category) => `${name}是 FreeAIPPT 为${category}场景原创设计的 8 页演示结构。模板从空白画布开始，使用 PowerPoint 原生文字和形状制作。演示前请用经过核实的信息替换所有占位文案与示例数字。`,
    byline: "由 FreeAIPPT 设计并审核",
    trustTitle: "原创设计，制作过程透明",
    trustBody: "模板从空白画布开始，使用 PowerPoint 原生形状和系统字体制作，并人工检查可读性、对比度、文字溢出和可编辑性；不包含参考模板素材。",
    included: ["封面", "背景或问题", "核心内容", "数据或证据", "方法或方案", "计划或时间线", "风险或下一步", "总结与行动建议"],
    bestFor: (category) => [`${category}演示`, "客户与利益相关者会议", "团队内部评审", "可编辑演示起点"],
    tags: (category) => [category, "PowerPoint", "可编辑", "免费模板"],
    faqTitle: "常见问题",
    faq: (name) => [
      { q: `${name}可以免费下载吗？`, a: "可以。无需注册即可下载 PPTX，并可依据模板许可用于个人或商业演示。" },
      { q: "每一页都可以编辑吗？", a: "可以。文字、颜色、形状和版式均为 PowerPoint 原生对象。请将英文占位内容和示例数字替换为你核实过的信息。" },
      { q: "这个模板如何制作和审核？", a: "FreeAIPPT 从空白 16:9 画布开始，使用原生形状和系统字体设计，并人工检查全部 8 页的可读性、对比度、文字溢出和可编辑性。" },
    ],
    english: "英语",
  },
  "zh-TW": {
    categoryTitle: (name) => `免費${name} PowerPoint 範本下載 | FreeAIPPT`,
    categoryDescription: (name) => `瀏覽 FreeAIPPT 原創${name}範本。每套包含 8 頁可編輯的 16:9 PowerPoint 版面，無需註冊即可免費下載 PPTX。`,
    templateDescription: (name) => `免費下載${name}：8 頁 16:9 原創 PowerPoint 範本，使用原生可編輯元素製作，可用於個人與商業簡報。`,
    templateAbout: (name, category) => `${name}是 FreeAIPPT 為${category}情境原創設計的 8 頁簡報結構。範本從空白畫布開始，使用 PowerPoint 原生文字和形狀製作。簡報前請以經過核實的資訊替換所有預留文字與示例數字。`,
    byline: "由 FreeAIPPT 設計並審核",
    trustTitle: "原創設計，製作過程透明",
    trustBody: "範本從空白畫布開始，使用 PowerPoint 原生形狀和系統字型製作，並人工檢查可讀性、對比度、文字溢出與可編輯性；不包含參考範本素材。",
    included: ["封面", "背景或問題", "核心內容", "資料或證據", "方法或方案", "計畫或時間軸", "風險或下一步", "總結與行動建議"],
    bestFor: (category) => [`${category}簡報`, "客戶與利害關係人會議", "團隊內部評審", "可編輯簡報起點"],
    tags: (category) => [category, "PowerPoint", "可編輯", "免費範本"],
    faqTitle: "常見問題",
    faq: (name) => [
      { q: `${name}可以免費下載嗎？`, a: "可以。無需註冊即可下載 PPTX，並可依照範本授權用於個人或商業簡報。" },
      { q: "每一頁都可以編輯嗎？", a: "可以。文字、色彩、形狀與版面皆為 PowerPoint 原生物件。請以核實過的資訊替換英文預留內容與示例數字。" },
      { q: "這個範本如何製作和審核？", a: "FreeAIPPT 從空白 16:9 畫布開始，使用原生形狀和系統字型設計，並人工檢查全部 8 頁的可讀性、對比度、文字溢出與可編輯性。" },
    ],
    english: "英文",
  },
  ja: {
    categoryTitle: (name) => `無料${name} PowerPointテンプレート | FreeAIPPT`,
    categoryDescription: (name) => `FreeAIPPTオリジナルの${name}テンプレート。編集可能な16:9スライド8枚を収録し、登録なしでPPTXを無料ダウンロードできます。`,
    templateDescription: (name) => `${name}を無料ダウンロード。編集可能なネイティブ要素で作られた、オリジナルの16:9 PowerPointテンプレート全8枚です。`,
    templateAbout: (name, category) => `${name}は、FreeAIPPTが${category}向けにゼロから設計した8枚構成のテンプレートです。PowerPointのネイティブな文字と図形のみで作られています。発表前に英語の仮テキストと数値を確認済みの情報へ置き換えてください。`,
    byline: "FreeAIPPTによるデザイン・レビュー",
    trustTitle: "制作方法を明示したオリジナルデザイン",
    trustBody: "空白のキャンバスからネイティブ図形とシステムフォントで制作し、読みやすさ、コントラスト、文字のはみ出し、編集性を人の目で確認しています。参照元の素材は含みません。",
    included: ["表紙", "背景・課題", "主要内容", "データ・根拠", "方法・解決策", "計画・タイムライン", "リスク・次のステップ", "まとめ・CTA"],
    bestFor: (category) => [`${category}の発表`, "顧客・関係者との会議", "チーム内レビュー", "編集可能な資料の土台"],
    tags: (category) => [category, "PowerPoint", "編集可能", "無料テンプレート"],
    faqTitle: "よくある質問",
    faq: (name) => [
      { q: `${name}は無料でダウンロードできますか？`, a: "はい。登録なしでPPTXをダウンロードでき、テンプレートライセンスに従って個人・商用のプレゼンに利用できます。" },
      { q: "すべてのスライドを編集できますか？", a: "はい。文字、色、図形、レイアウトはPowerPointのネイティブオブジェクトです。英語の仮テキストと数値は確認済みの情報に置き換えてください。" },
      { q: "どのように制作・確認されていますか？", a: "FreeAIPPTが空白の16:9キャンバスから制作し、全8枚の読みやすさ、コントラスト、文字のはみ出し、編集性を人の目で確認しています。" },
    ],
    english: "英語",
  },
  ko: {
    categoryTitle: (name) => `무료 ${name} PowerPoint 템플릿 | FreeAIPPT`,
    categoryDescription: (name) => `FreeAIPPT가 직접 만든 ${name} 템플릿입니다. 편집 가능한 16:9 슬라이드 8장을 회원가입 없이 무료로 다운로드하세요.`,
    templateDescription: (name) => `${name} 무료 다운로드. 편집 가능한 PowerPoint 기본 요소로 만든 독창적인 16:9 템플릿 8장입니다.`,
    templateAbout: (name, category) => `${name}은 FreeAIPPT가 ${category} 발표를 위해 빈 화면부터 설계한 8장 구성입니다. PowerPoint 기본 텍스트와 도형만 사용했습니다. 발표 전에 영문 예시 문구와 숫자를 검증된 정보로 바꾸세요.`,
    byline: "FreeAIPPT 디자인 및 검토",
    trustTitle: "제작 과정을 공개한 독창적인 디자인",
    trustBody: "빈 화면에서 PowerPoint 기본 도형과 시스템 글꼴로 제작한 뒤 가독성, 대비, 텍스트 넘침, 편집 가능 여부를 사람이 직접 확인했습니다. 참고 템플릿의 소재는 포함하지 않습니다.",
    included: ["표지", "배경 또는 문제", "핵심 내용", "데이터 또는 근거", "방법 또는 해결책", "계획 또는 일정", "위험 또는 다음 단계", "요약 및 CTA"],
    bestFor: (category) => [`${category} 발표`, "고객 및 이해관계자 회의", "팀 내부 검토", "편집 가능한 발표 시작점"],
    tags: (category) => [category, "PowerPoint", "편집 가능", "무료 템플릿"],
    faqTitle: "자주 묻는 질문",
    faq: (name) => [
      { q: `${name}을 무료로 받을 수 있나요?`, a: "네. 회원가입 없이 PPTX를 다운로드하고 템플릿 라이선스에 따라 개인 및 상업용 발표에 사용할 수 있습니다." },
      { q: "모든 슬라이드를 편집할 수 있나요?", a: "네. 텍스트, 색상, 도형, 레이아웃은 PowerPoint 기본 개체입니다. 영문 예시 문구와 숫자는 검증된 정보로 바꾸세요." },
      { q: "템플릿은 어떻게 제작하고 검토했나요?", a: "FreeAIPPT가 빈 16:9 화면에서 제작하고 전체 8장의 가독성, 대비, 텍스트 넘침, 편집 가능 여부를 사람이 직접 확인했습니다." },
    ],
    english: "영어",
  },
  fr: {
    categoryTitle: (name) => `Modèles PowerPoint ${name} gratuits | FreeAIPPT`,
    categoryDescription: (name) => `Découvrez les modèles ${name} originaux de FreeAIPPT : huit diapositives 16:9 modifiables et un PPTX gratuit sans inscription.`,
    templateDescription: (name) => `Téléchargez gratuitement ${name}, un modèle PowerPoint 16:9 original de huit diapositives, composé d’éléments natifs entièrement modifiables.`,
    templateAbout: (name, category) => `${name} est une structure originale de huit diapositives conçue par FreeAIPPT pour les présentations ${category}. Créée sur une page blanche, elle utilise uniquement du texte et des formes PowerPoint modifiables. Remplacez les exemples en anglais par des informations vérifiées avant de présenter.`,
    byline: "Conçu et vérifié par FreeAIPPT",
    trustTitle: "Un design original au processus transparent",
    trustBody: "Créé sur une page blanche avec des formes PowerPoint natives et des polices système, puis vérifié manuellement pour la lisibilité, le contraste, les débordements et la modification. Aucun élément du modèle de référence n’est inclus.",
    included: ["Couverture", "Contexte ou problème", "Contenu principal", "Données ou preuves", "Méthode ou solution", "Plan ou calendrier", "Risques ou prochaines étapes", "Résumé et appel à l’action"],
    bestFor: (category) => [`Présentations ${category}`, "Réunions clients et parties prenantes", "Revues d’équipe", "Point de départ modifiable"],
    tags: (category) => [category, "PowerPoint", "Modifiable", "Modèle gratuit"],
    faqTitle: "Questions fréquentes",
    faq: (name) => [
      { q: `${name} est-il téléchargeable gratuitement ?`, a: "Oui. Le PPTX est disponible sans inscription et peut être utilisé dans des présentations personnelles ou commerciales selon la licence." },
      { q: "Toutes les diapositives sont-elles modifiables ?", a: "Oui. Textes, couleurs, formes et mises en page sont des objets PowerPoint natifs. Remplacez les exemples en anglais par vos informations vérifiées." },
      { q: "Comment ce modèle a-t-il été créé et vérifié ?", a: "FreeAIPPT l’a conçu sur une page 16:9 blanche, puis a vérifié manuellement les huit diapositives : lisibilité, contraste, débordements et modification." },
    ],
    english: "Anglais",
  },
  es: {
    categoryTitle: (name) => `Plantillas PowerPoint gratis de ${name} | FreeAIPPT`,
    categoryDescription: (name) => `Explora plantillas originales de ${name} creadas por FreeAIPPT: ocho diapositivas 16:9 editables y descarga PPTX gratis sin registro.`,
    templateDescription: (name) => `Descarga gratis ${name}, una plantilla PowerPoint 16:9 original de ocho diapositivas con elementos nativos totalmente editables.`,
    templateAbout: (name, category) => `${name} es una estructura original de ocho diapositivas diseñada por FreeAIPPT para presentaciones de ${category}. Parte de un lienzo en blanco y utiliza texto y formas nativas de PowerPoint. Sustituye los ejemplos en inglés por información verificada antes de presentar.`,
    byline: "Diseñada y revisada por FreeAIPPT",
    trustTitle: "Diseño original con un proceso transparente",
    trustBody: "Creada desde un lienzo en blanco con formas nativas de PowerPoint y fuentes del sistema; después se revisaron manualmente la legibilidad, el contraste, los desbordamientos y la edición. No incluye recursos de la plantilla de referencia.",
    included: ["Portada", "Contexto o problema", "Contenido principal", "Datos o pruebas", "Método o solución", "Plan o cronograma", "Riesgos o próximos pasos", "Resumen y llamada a la acción"],
    bestFor: (category) => [`Presentaciones de ${category}`, "Reuniones con clientes y partes interesadas", "Revisiones internas", "Punto de partida editable"],
    tags: (category) => [category, "PowerPoint", "Editable", "Plantilla gratis"],
    faqTitle: "Preguntas frecuentes",
    faq: (name) => [
      { q: `¿Se puede descargar ${name} gratis?`, a: "Sí. Puedes descargar el PPTX sin registrarte y utilizarlo en presentaciones personales o comerciales según la licencia." },
      { q: "¿Se pueden editar todas las diapositivas?", a: "Sí. El texto, los colores, las formas y el diseño son objetos nativos de PowerPoint. Sustituye los ejemplos en inglés por información verificada." },
      { q: "¿Cómo se creó y revisó la plantilla?", a: "FreeAIPPT la diseñó desde un lienzo 16:9 en blanco y revisó manualmente las ocho diapositivas: legibilidad, contraste, desbordamientos y edición." },
    ],
    english: "Inglés",
  },
  ru: {
    categoryTitle: (name) => `Бесплатные шаблоны PowerPoint: ${name} | FreeAIPPT`,
    categoryDescription: (name) => `Оригинальные шаблоны ${name} от FreeAIPPT: восемь редактируемых слайдов 16:9 и бесплатный PPTX без регистрации.`,
    templateDescription: (name) => `Скачайте ${name} бесплатно: оригинальный шаблон PowerPoint 16:9 из восьми слайдов с полностью редактируемыми элементами.`,
    templateAbout: (name, category) => `${name} — оригинальная структура из восьми слайдов, созданная FreeAIPPT для презентаций ${category}. Она разработана с чистого листа только из редактируемого текста и стандартных фигур PowerPoint. Перед показом замените английские примеры проверенной информацией.`,
    byline: "Дизайн и проверка — FreeAIPPT",
    trustTitle: "Оригинальный дизайн с прозрачным процессом",
    trustBody: "Создан с чистого листа из стандартных фигур PowerPoint и системных шрифтов, затем вручную проверен на читаемость, контраст, переполнение текста и редактируемость. Материалы исходного шаблона не используются.",
    included: ["Обложка", "Контекст или проблема", "Основное содержание", "Данные или доказательства", "Метод или решение", "План или сроки", "Риски или следующие шаги", "Итог и призыв к действию"],
    bestFor: (category) => [`Презентации ${category}`, "Встречи с клиентами и заинтересованными сторонами", "Внутренние обзоры", "Редактируемая основа презентации"],
    tags: (category) => [category, "PowerPoint", "Редактируемый", "Бесплатный шаблон"],
    faqTitle: "Частые вопросы",
    faq: (name) => [
      { q: `Можно ли скачать ${name} бесплатно?`, a: "Да. PPTX доступен без регистрации и может использоваться в личных и коммерческих презентациях согласно лицензии." },
      { q: "Все слайды можно редактировать?", a: "Да. Текст, цвета, фигуры и макет являются стандартными объектами PowerPoint. Замените английские примеры проверенной информацией." },
      { q: "Как создан и проверен этот шаблон?", a: "FreeAIPPT разработал его с чистого листа 16:9 и вручную проверил все восемь слайдов на читаемость, контраст, переполнение и редактируемость." },
    ],
    english: "Английский",
  },
};

export function templateSeoCopy(locale: Locale) {
  return copies[locale];
}
