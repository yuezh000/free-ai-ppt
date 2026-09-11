import type { Locale } from "@/lib/i18n";
import type { PptTemplate, TemplateCategory } from "@/lib/templates";

export type TemplateCopy = {
  nav: string; business: string; home: string;
  badge: string; title1: string; title2: string; lead: string;
  noSignup: string; editable: string; widescreen: string; freeUse: string;
  newFree: string; libraryTitle: string; libraryLead: string; browseBusiness: string;
  businessBadge: string; businessTitle1: string; businessTitle2: string; businessLead: string; choose: string;
  freeEditable: string; slides: string; preview: string; previewTitle: string; previewLead: string;
  about: string; aboutTitle: string; bestFor: string; details: string; format: string; ratio: string; language: string; fonts: string; license: string; readLicense: string;
  included: string; includedTitle: string; ready: string; readyLead: string; more: string; related: string;
  download: string; customize: string; terms: string; previous: string; next: string; close: string;
};

const en: TemplateCopy = {
  nav: "Templates", business: "Business", home: "Home", badge: "FREE POWERPOINT TEMPLATES", title1: "Start with a strong story.", title2: "Make it yours.", lead: "Download genuinely editable presentation templates, built for real business conversations—not just attractive thumbnails.",
  noSignup: "No sign-up", editable: "Editable PPTX", widescreen: "16:9 widescreen", freeUse: "Free to use", newFree: "NEW & FREE", libraryTitle: "Professional templates for your next presentation", libraryLead: "Every deck includes eight purposeful layouts, editable native PowerPoint elements, and clear placeholder content.", browseBusiness: "Browse business templates",
  businessBadge: "BUSINESS TEMPLATES", businessTitle1: "Free business", businessTitle2: "PowerPoint templates", businessLead: "Editable presentation structures for planning, pitching, selling, and introducing your company with clarity.", choose: "Choose a business presentation template",
  freeEditable: "FREE · EDITABLE · 16:9", slides: "8 slides · PPTX", preview: "Preview template", previewTitle: "Eight layouts included", previewLead: "Click any slide to inspect it at a larger size.", about: "ABOUT THIS TEMPLATE", aboutTitle: "A practical structure you can make your own", bestFor: "Best for", details: "Template details", format: "Format", ratio: "Ratio", language: "Language", fonts: "Fonts", license: "License", readLicense: "Read template license", included: "WHAT'S INCLUDED", includedTitle: "A complete eight-slide story", ready: "Ready to build your presentation?", readyLead: "Download the editable file now, or use AI to adapt the structure to your content.", more: "MORE FREE TEMPLATES", related: "Related business presentation templates", download: "Download free PPTX", customize: "Customize with AI", terms: "No sign-up · Editable slides · Free personal & commercial use", previous: "Previous", next: "Next", close: "Close preview",
};

const copies: Record<Locale, TemplateCopy> = {
  en,
  "zh-CN": { ...en, nav:"模板",business:"商务",home:"首页",badge:"免费 POWERPOINT 模板",title1:"从清晰的故事开始。",title2:"打造你的专属演示。",lead:"免费下载真正可编辑的演示模板，专为真实商务沟通设计，而不只是好看的缩略图。",noSignup:"无需注册",editable:"可编辑 PPTX",widescreen:"16:9 宽屏",freeUse:"免费使用",newFree:"全新 · 免费",libraryTitle:"为下一次演示选择专业模板",libraryLead:"每套模板包含 8 个实用版式、可编辑的 PowerPoint 原生元素和清晰的占位内容。",browseBusiness:"浏览商务模板",businessBadge:"商务模板",businessTitle1:"免费商务",businessTitle2:"PowerPoint 模板",businessLead:"适用于商业规划、路演、销售和公司介绍的可编辑演示结构。",choose:"选择商务演示模板",freeEditable:"免费 · 可编辑 · 16:9",slides:"8 页 · PPTX",preview:"预览模板",previewTitle:"包含 8 个版式",previewLead:"点击任意幻灯片查看大图。",about:"关于此模板",aboutTitle:"实用结构，自由定制",bestFor:"适用场景",details:"模板详情",format:"格式",ratio:"比例",language:"语言",fonts:"字体",license:"许可",readLicense:"查看模板许可",included:"包含内容",includedTitle:"完整的 8 页叙事结构",ready:"准备制作演示了吗？",readyLead:"立即下载可编辑文件，或使用 AI 根据你的内容调整结构。",more:"更多免费模板",related:"相关商务演示模板",download:"免费下载 PPTX",customize:"使用 AI 定制",terms:"无需注册 · 幻灯片可编辑 · 个人和商业用途免费",previous:"上一页",next:"下一页",close:"关闭预览" },
  "zh-TW": { ...en, nav:"範本",business:"商務",home:"首頁",badge:"免費 POWERPOINT 範本",title1:"從清晰的故事開始。",title2:"打造你的專屬簡報。",lead:"免費下載真正可編輯的簡報範本，專為真實商務溝通設計。",noSignup:"無需註冊",editable:"可編輯 PPTX",widescreen:"16:9 寬螢幕",freeUse:"免費使用",newFree:"全新 · 免費",libraryTitle:"為下一次簡報選擇專業範本",libraryLead:"每套範本包含 8 個實用版面、可編輯元素和清晰的預留內容。",browseBusiness:"瀏覽商務範本",businessBadge:"商務範本",businessTitle1:"免費商務",businessTitle2:"PowerPoint 範本",businessLead:"適用於商業規劃、提案、銷售和公司介紹的可編輯簡報結構。",choose:"選擇商務簡報範本",freeEditable:"免費 · 可編輯 · 16:9",slides:"8 頁 · PPTX",preview:"預覽範本",previewTitle:"包含 8 個版面",previewLead:"點擊任一投影片查看大圖。",about:"關於此範本",aboutTitle:"實用結構，自由調整",bestFor:"適用情境",details:"範本詳情",format:"格式",ratio:"比例",language:"語言",fonts:"字型",license:"授權",readLicense:"查看範本授權",included:"包含內容",includedTitle:"完整的 8 頁敘事結構",ready:"準備製作簡報了嗎？",readyLead:"立即下載可編輯檔案，或使用 AI 調整內容。",more:"更多免費範本",related:"相關商務簡報範本",download:"免費下載 PPTX",customize:"使用 AI 自訂",terms:"無需註冊 · 投影片可編輯 · 個人與商業用途免費",previous:"上一頁",next:"下一頁",close:"關閉預覽" },
  ja: { ...en, nav:"テンプレート",business:"ビジネス",home:"ホーム",badge:"無料 POWERPOINT テンプレート",title1:"強いストーリーから始めよう。",title2:"自分らしく仕上げよう。",lead:"実際のビジネスに使える、完全編集可能なプレゼンテーションテンプレートを無料でダウンロードできます。",noSignup:"登録不要",editable:"編集可能な PPTX",widescreen:"16:9 ワイド",freeUse:"無料で利用可能",newFree:"新着 · 無料",libraryTitle:"次のプレゼンに使えるプロ向けテンプレート",libraryLead:"各デッキには、8種類の実用的なレイアウトと編集可能なPowerPoint要素が含まれます。",browseBusiness:"ビジネステンプレートを見る",businessBadge:"ビジネステンプレート",businessTitle1:"無料ビジネス",businessTitle2:"PowerPoint テンプレート",businessLead:"企画、ピッチ、営業、会社紹介に使える編集可能な構成です。",choose:"ビジネステンプレートを選ぶ",freeEditable:"無料 · 編集可能 · 16:9",slides:"8枚 · PPTX",preview:"テンプレートを確認",previewTitle:"8種類のレイアウト",previewLead:"スライドをクリックして拡大表示できます。",about:"このテンプレートについて",aboutTitle:"自由に調整できる実用的な構成",bestFor:"おすすめ用途",details:"テンプレート詳細",format:"形式",ratio:"比率",language:"言語",fonts:"フォント",license:"ライセンス",readLicense:"ライセンスを確認",included:"収録内容",includedTitle:"8枚で構成されたストーリー",ready:"プレゼンを作成しますか？",readyLead:"編集可能なファイルをダウンロードするか、AIで内容に合わせて調整できます。",more:"その他の無料テンプレート",related:"関連するビジネステンプレート",download:"無料 PPTX をダウンロード",customize:"AIでカスタマイズ",terms:"登録不要 · 編集可能 · 個人・商用利用無料",previous:"前へ",next:"次へ",close:"プレビューを閉じる" },
  ko: { ...en, nav:"템플릿",business:"비즈니스",home:"홈",badge:"무료 POWERPOINT 템플릿",title1:"탄탄한 이야기로 시작하세요.",title2:"나만의 발표로 완성하세요.",lead:"실제 비즈니스 대화를 위해 설계된 완전 편집 가능한 프레젠테이션 템플릿을 무료로 받으세요.",noSignup:"가입 불필요",editable:"편집 가능한 PPTX",widescreen:"16:9 와이드",freeUse:"무료 사용",newFree:"신규 · 무료",libraryTitle:"다음 발표를 위한 전문 템플릿",libraryLead:"각 자료에는 8개의 실용적인 레이아웃과 편집 가능한 PowerPoint 요소가 포함됩니다.",browseBusiness:"비즈니스 템플릿 보기",businessBadge:"비즈니스 템플릿",businessTitle1:"무료 비즈니스",businessTitle2:"PowerPoint 템플릿",businessLead:"기획, 피칭, 영업 및 회사 소개를 위한 편집 가능한 구조입니다.",choose:"비즈니스 발표 템플릿 선택",freeEditable:"무료 · 편집 가능 · 16:9",slides:"8장 · PPTX",preview:"템플릿 미리보기",previewTitle:"8개 레이아웃 포함",previewLead:"슬라이드를 클릭해 크게 확인하세요.",about:"템플릿 소개",aboutTitle:"자유롭게 수정하는 실용적인 구조",bestFor:"추천 용도",details:"템플릿 정보",format:"형식",ratio:"비율",language:"언어",fonts:"글꼴",license:"라이선스",readLicense:"라이선스 보기",included:"포함 내용",includedTitle:"8장으로 완성되는 이야기",ready:"발표를 만들 준비가 되셨나요?",readyLead:"편집 가능한 파일을 받거나 AI로 내용에 맞게 수정하세요.",more:"더 많은 무료 템플릿",related:"관련 비즈니스 발표 템플릿",download:"무료 PPTX 다운로드",customize:"AI로 맞춤 설정",terms:"가입 불필요 · 편집 가능 · 개인 및 상업용 무료",previous:"이전",next:"다음",close:"미리보기 닫기" },
  fr: { ...en, nav:"Modèles",business:"Entreprise",home:"Accueil",badge:"MODÈLES POWERPOINT GRATUITS",title1:"Commencez par une histoire forte.",title2:"Personnalisez-la.",lead:"Téléchargez des modèles réellement modifiables, conçus pour de vraies présentations professionnelles.",noSignup:"Sans inscription",editable:"PPTX modifiable",widescreen:"Format 16:9",freeUse:"Utilisation gratuite",newFree:"NOUVEAU · GRATUIT",libraryTitle:"Des modèles professionnels pour votre prochaine présentation",libraryLead:"Chaque présentation contient huit mises en page utiles et des éléments PowerPoint modifiables.",browseBusiness:"Voir les modèles professionnels",businessBadge:"MODÈLES PROFESSIONNELS",businessTitle1:"Modèles PowerPoint",businessTitle2:"professionnels gratuits",businessLead:"Des structures modifiables pour planifier, convaincre, vendre et présenter votre entreprise.",choose:"Choisissez un modèle professionnel",freeEditable:"GRATUIT · MODIFIABLE · 16:9",slides:"8 diapositives · PPTX",preview:"Aperçu du modèle",previewTitle:"Huit mises en page incluses",previewLead:"Cliquez sur une diapositive pour l’agrandir.",about:"À PROPOS DU MODÈLE",aboutTitle:"Une structure pratique à personnaliser",bestFor:"Idéal pour",details:"Détails du modèle",format:"Format",ratio:"Ratio",language:"Langue",fonts:"Polices",license:"Licence",readLicense:"Lire la licence",included:"CONTENU INCLUS",includedTitle:"Une histoire complète en huit diapositives",ready:"Prêt à créer votre présentation ?",readyLead:"Téléchargez le fichier ou adaptez sa structure à votre contenu avec l’IA.",more:"AUTRES MODÈLES GRATUITS",related:"Modèles professionnels associés",download:"Télécharger le PPTX gratuit",customize:"Personnaliser avec l’IA",terms:"Sans inscription · Modifiable · Usage personnel et commercial gratuit",previous:"Précédent",next:"Suivant",close:"Fermer l’aperçu" },
  es: { ...en, nav:"Plantillas",business:"Negocios",home:"Inicio",badge:"PLANTILLAS POWERPOINT GRATIS",title1:"Empieza con una historia sólida.",title2:"Hazla tuya.",lead:"Descarga plantillas realmente editables, diseñadas para presentaciones profesionales reales.",noSignup:"Sin registro",editable:"PPTX editable",widescreen:"Pantalla 16:9",freeUse:"Uso gratuito",newFree:"NUEVO · GRATIS",libraryTitle:"Plantillas profesionales para tu próxima presentación",libraryLead:"Cada presentación incluye ocho diseños útiles y elementos nativos editables de PowerPoint.",browseBusiness:"Ver plantillas de negocios",businessBadge:"PLANTILLAS DE NEGOCIOS",businessTitle1:"Plantillas PowerPoint",businessTitle2:"de negocios gratis",businessLead:"Estructuras editables para planificar, presentar, vender y explicar tu empresa.",choose:"Elige una plantilla de negocios",freeEditable:"GRATIS · EDITABLE · 16:9",slides:"8 diapositivas · PPTX",preview:"Ver plantilla",previewTitle:"Ocho diseños incluidos",previewLead:"Haz clic en una diapositiva para ampliarla.",about:"SOBRE ESTA PLANTILLA",aboutTitle:"Una estructura práctica que puedes adaptar",bestFor:"Ideal para",details:"Detalles de la plantilla",format:"Formato",ratio:"Proporción",language:"Idioma",fonts:"Fuentes",license:"Licencia",readLicense:"Leer licencia",included:"QUÉ INCLUYE",includedTitle:"Una historia completa en ocho diapositivas",ready:"¿Listo para crear tu presentación?",readyLead:"Descarga el archivo editable o adapta su estructura con IA.",more:"MÁS PLANTILLAS GRATIS",related:"Plantillas de negocios relacionadas",download:"Descargar PPTX gratis",customize:"Personalizar con IA",terms:"Sin registro · Editable · Uso personal y comercial gratuito",previous:"Anterior",next:"Siguiente",close:"Cerrar vista previa" },
  ru: { ...en, nav:"Шаблоны",business:"Бизнес",home:"Главная",badge:"БЕСПЛАТНЫЕ ШАБЛОНЫ POWERPOINT",title1:"Начните с сильной истории.",title2:"Сделайте её своей.",lead:"Скачивайте редактируемые шаблоны, созданные для реальных деловых презентаций.",noSignup:"Без регистрации",editable:"Редактируемый PPTX",widescreen:"Формат 16:9",freeUse:"Бесплатно",newFree:"НОВОЕ · БЕСПЛАТНО",libraryTitle:"Профессиональные шаблоны для следующей презентации",libraryLead:"Каждый файл содержит восемь практичных макетов и редактируемые элементы PowerPoint.",browseBusiness:"Смотреть бизнес-шаблоны",businessBadge:"БИЗНЕС-ШАБЛОНЫ",businessTitle1:"Бесплатные бизнес-",businessTitle2:"шаблоны PowerPoint",businessLead:"Редактируемые структуры для планирования, питчей, продаж и представления компании.",choose:"Выберите бизнес-шаблон",freeEditable:"БЕСПЛАТНО · 16:9",slides:"8 слайдов · PPTX",preview:"Посмотреть шаблон",previewTitle:"Восемь макетов",previewLead:"Нажмите на слайд, чтобы увеличить его.",about:"О ШАБЛОНЕ",aboutTitle:"Практичная структура для ваших задач",bestFor:"Подходит для",details:"Параметры шаблона",format:"Формат",ratio:"Соотношение",language:"Язык",fonts:"Шрифты",license:"Лицензия",readLicense:"Открыть лицензию",included:"ЧТО ВКЛЮЧЕНО",includedTitle:"Полная история из восьми слайдов",ready:"Готовы создать презентацию?",readyLead:"Скачайте файл или адаптируйте структуру под свой материал с помощью ИИ.",more:"ЕЩЁ БЕСПЛАТНЫЕ ШАБЛОНЫ",related:"Похожие бизнес-шаблоны",download:"Скачать PPTX бесплатно",customize:"Настроить с ИИ",terms:"Без регистрации · Можно редактировать · Бесплатно для личного и коммерческого использования",previous:"Назад",next:"Далее",close:"Закрыть просмотр" },
};

export const templateCopy = (locale: Locale) => copies[locale];

const localizedNames: Partial<Record<Locale, Record<string, [string, string]>>> = {
  "zh-CN": {
    "business-plan-presentation":["免费商业计划 PowerPoint 模板","商业计划"], "startup-pitch-deck":["免费创业融资路演 PPT 模板","创业路演"], "company-profile-presentation":["免费公司介绍 PowerPoint 模板","公司介绍"],
    "marketing-plan-presentation":["免费营销计划 PowerPoint 模板","营销计划"], "project-proposal-presentation":["免费项目提案 PowerPoint 模板","项目提案"], "sales-report-presentation":["免费销售报告 PowerPoint 模板","销售报告"],
    "lesson-plan-presentation":["免费教学课件 PowerPoint 模板","教学课件"], "thesis-defense-presentation":["免费论文答辩 PowerPoint 模板","论文答辩"], "clinical-case-presentation":["免费医疗病例 PowerPoint 模板","医疗病例"],
    "artificial-intelligence-presentation":["免费人工智能 PowerPoint 模板","人工智能"], "creative-portfolio-presentation":["免费创意作品集 PowerPoint 模板","创意作品集"], "product-roadmap-presentation":["免费产品路线图 PowerPoint 模板","产品路线图"],
  },
  "zh-TW": {
    "business-plan-presentation":["免費商業計畫 PowerPoint 範本","商業計畫"], "startup-pitch-deck":["免費新創募資簡報範本","新創簡報"], "company-profile-presentation":["免費公司介紹 PowerPoint 範本","公司介紹"],
    "marketing-plan-presentation":["免費行銷計畫 PowerPoint 範本","行銷計畫"], "project-proposal-presentation":["免費專案提案 PowerPoint 範本","專案提案"], "sales-report-presentation":["免費銷售報告 PowerPoint 範本","銷售報告"],
    "lesson-plan-presentation":["免費教學課件 PowerPoint 範本","教學課件"], "thesis-defense-presentation":["免費論文答辯 PowerPoint 範本","論文答辯"], "clinical-case-presentation":["免費臨床病例 PowerPoint 範本","臨床病例"],
    "artificial-intelligence-presentation":["免費人工智慧 PowerPoint 範本","人工智慧"], "creative-portfolio-presentation":["免費創意作品集 PowerPoint 範本","創意作品集"], "product-roadmap-presentation":["免費產品路線圖 PowerPoint 範本","產品路線圖"],
  },
  ja: {
    "business-plan-presentation":["無料ビジネスプラン PowerPoint テンプレート","ビジネスプラン"], "startup-pitch-deck":["無料スタートアップ向けピッチ資料","スタートアップ・ピッチ"], "company-profile-presentation":["無料会社紹介 PowerPoint テンプレート","会社紹介"],
    "marketing-plan-presentation":["無料マーケティング計画 PowerPoint テンプレート","マーケティング計画"], "project-proposal-presentation":["無料プロジェクト提案 PowerPoint テンプレート","プロジェクト提案"], "sales-report-presentation":["無料営業レポート PowerPoint テンプレート","営業レポート"],
    "lesson-plan-presentation":["無料授業計画 PowerPoint テンプレート","授業計画"], "thesis-defense-presentation":["無料論文審査 PowerPoint テンプレート","論文審査"], "clinical-case-presentation":["無料臨床症例 PowerPoint テンプレート","臨床症例"],
    "artificial-intelligence-presentation":["無料 AI PowerPoint テンプレート","AI・テクノロジー"], "creative-portfolio-presentation":["無料クリエイティブポートフォリオ","ポートフォリオ"], "product-roadmap-presentation":["無料プロダクトロードマップ PowerPoint","製品ロードマップ"],
  },
  ko: {
    "business-plan-presentation":["무료 사업계획서 PowerPoint 템플릿","사업계획서"], "startup-pitch-deck":["무료 스타트업 피치덱 템플릿","스타트업 피치덱"], "company-profile-presentation":["무료 회사소개 PowerPoint 템플릿","회사소개"],
    "marketing-plan-presentation":["무료 마케팅 계획 PowerPoint 템플릿","마케팅 계획"], "project-proposal-presentation":["무료 프로젝트 제안 PowerPoint 템플릿","프로젝트 제안"], "sales-report-presentation":["무료 영업 보고서 PowerPoint 템플릿","영업 보고서"],
    "lesson-plan-presentation":["무료 수업 계획 PowerPoint 템플릿","수업 계획"], "thesis-defense-presentation":["무료 학위 논문 발표 PowerPoint 템플릿","논문 발표"], "clinical-case-presentation":["무료 임상 사례 PowerPoint 템플릿","임상 사례"],
    "artificial-intelligence-presentation":["무료 인공지능 PowerPoint 템플릿","인공지능"], "creative-portfolio-presentation":["무료 크리에이티브 포트폴리오 템플릿","포트폴리오"], "product-roadmap-presentation":["무료 제품 로드맵 PowerPoint 템플릿","제품 로드맵"],
  },
  fr: {
    "business-plan-presentation":["Modèle PowerPoint gratuit de business plan","Business plan"], "startup-pitch-deck":["Modèle gratuit de pitch deck startup","Pitch deck startup"], "company-profile-presentation":["Modèle PowerPoint gratuit de présentation d’entreprise","Présentation d’entreprise"],
    "marketing-plan-presentation":["Modèle PowerPoint gratuit de plan marketing","Plan marketing"], "project-proposal-presentation":["Modèle PowerPoint gratuit de proposition de projet","Proposition de projet"], "sales-report-presentation":["Modèle PowerPoint gratuit de rapport commercial","Rapport commercial"],
    "lesson-plan-presentation":["Modèle PowerPoint gratuit de plan de cours","Plan de cours"], "thesis-defense-presentation":["Modèle PowerPoint gratuit de soutenance","Soutenance de thèse"], "clinical-case-presentation":["Modèle PowerPoint gratuit de cas clinique","Cas clinique"],
    "artificial-intelligence-presentation":["Modèle PowerPoint gratuit sur l’intelligence artificielle","Intelligence artificielle"], "creative-portfolio-presentation":["Modèle PowerPoint gratuit de portfolio créatif","Portfolio créatif"], "product-roadmap-presentation":["Modèle PowerPoint gratuit de feuille de route produit","Feuille de route produit"],
  },
  es: {
    "business-plan-presentation":["Plantilla PowerPoint gratis de plan de negocio","Plan de negocio"], "startup-pitch-deck":["Plantilla gratis de pitch deck para startups","Pitch deck de startup"], "company-profile-presentation":["Plantilla PowerPoint gratis de perfil de empresa","Perfil de empresa"],
    "marketing-plan-presentation":["Plantilla PowerPoint gratis de plan de marketing","Plan de marketing"], "project-proposal-presentation":["Plantilla PowerPoint gratis de propuesta de proyecto","Propuesta de proyecto"], "sales-report-presentation":["Plantilla PowerPoint gratis de informe de ventas","Informe de ventas"],
    "lesson-plan-presentation":["Plantilla PowerPoint gratis de plan de clase","Plan de clase"], "thesis-defense-presentation":["Plantilla PowerPoint gratis para defensa de tesis","Defensa de tesis"], "clinical-case-presentation":["Plantilla PowerPoint gratis de caso clínico","Caso clínico"],
    "artificial-intelligence-presentation":["Plantilla PowerPoint gratis de inteligencia artificial","Inteligencia artificial"], "creative-portfolio-presentation":["Plantilla PowerPoint gratis de portafolio creativo","Portafolio creativo"], "product-roadmap-presentation":["Plantilla PowerPoint gratis de hoja de ruta de producto","Hoja de ruta de producto"],
  },
  ru: {
    "business-plan-presentation":["Бесплатный шаблон бизнес-плана PowerPoint","Бизнес-план"], "startup-pitch-deck":["Бесплатный шаблон питч-дека стартапа","Питч-дек стартапа"], "company-profile-presentation":["Бесплатный шаблон презентации компании","О компании"],
    "marketing-plan-presentation":["Бесплатный шаблон маркетингового плана PowerPoint","Маркетинговый план"], "project-proposal-presentation":["Бесплатный шаблон проектного предложения PowerPoint","Проектное предложение"], "sales-report-presentation":["Бесплатный шаблон отчёта о продажах PowerPoint","Отчёт о продажах"],
    "lesson-plan-presentation":["Бесплатный шаблон плана урока PowerPoint","План урока"], "thesis-defense-presentation":["Бесплатный шаблон защиты диссертации PowerPoint","Защита диссертации"], "clinical-case-presentation":["Бесплатный шаблон клинического случая PowerPoint","Клинический случай"],
    "artificial-intelligence-presentation":["Бесплатный шаблон PowerPoint об искусственном интеллекте","Искусственный интеллект"], "creative-portfolio-presentation":["Бесплатный шаблон творческого портфолио PowerPoint","Творческое портфолио"], "product-roadmap-presentation":["Бесплатный шаблон дорожной карты продукта PowerPoint","Дорожная карта продукта"],
  },
};

const localizedDailyNames: Partial<Record<Locale, Record<string, [string, string]>>> = {
  "zh-CN": {
    "vintage-small-business-plan":["免费复古小企业商业计划 PowerPoint 模板","复古小企业商业计划"], "retail-startup-pitch-deck":["免费零售创业融资路演 PPT 模板","零售创业路演"], "modern-company-overview-presentation":["免费现代公司概览 PowerPoint 模板","现代公司概览"],
    "campaign-marketing-plan-presentation":["免费营销活动计划 PowerPoint 模板","营销活动计划"], "blueprint-project-proposal":["免费蓝图风项目提案 PowerPoint 模板","蓝图风项目提案"], "sales-performance-review-presentation":["免费销售业绩复盘 PowerPoint 模板","销售业绩复盘"],
    "yellow-lesson-plan-presentation":["免费黄色教学计划 PowerPoint 模板","黄色教学计划"], "green-thesis-defense-presentation":["免费绿色论文答辩 PowerPoint 模板","绿色论文答辩"], "modern-clinical-case-presentation":["免费现代临床病例 PowerPoint 模板","现代临床病例"],
    "ai-strategy-presentation":["免费 AI 战略 PowerPoint 模板","AI 战略"], "y2k-creative-portfolio":["免费 Y2K 创意作品集 PowerPoint 模板","Y2K 创意作品集"], "quarterly-product-roadmap":["免费季度产品路线图 PowerPoint 模板","季度产品路线图"],
  },
  "zh-TW": {
    "vintage-small-business-plan":["免費復古小型企業商業計畫 PowerPoint 範本","復古小型企業商業計畫"], "retail-startup-pitch-deck":["免費零售新創募資簡報範本","零售新創簡報"], "modern-company-overview-presentation":["免費現代公司概覽 PowerPoint 範本","現代公司概覽"],
    "campaign-marketing-plan-presentation":["免費行銷活動計畫 PowerPoint 範本","行銷活動計畫"], "blueprint-project-proposal":["免費藍圖風專案提案 PowerPoint 範本","藍圖風專案提案"], "sales-performance-review-presentation":["免費銷售績效檢討 PowerPoint 範本","銷售績效檢討"],
    "yellow-lesson-plan-presentation":["免費黃色教學計畫 PowerPoint 範本","黃色教學計畫"], "green-thesis-defense-presentation":["免費綠色論文答辯 PowerPoint 範本","綠色論文答辯"], "modern-clinical-case-presentation":["免費現代臨床病例 PowerPoint 範本","現代臨床病例"],
    "ai-strategy-presentation":["免費 AI 策略 PowerPoint 範本","AI 策略"], "y2k-creative-portfolio":["免費 Y2K 創意作品集 PowerPoint 範本","Y2K 創意作品集"], "quarterly-product-roadmap":["免費季度產品路線圖 PowerPoint 範本","季度產品路線圖"],
  },
  ja: {
    "vintage-small-business-plan":["無料ヴィンテージ小規模事業計画 PowerPoint テンプレート","小規模事業計画"], "retail-startup-pitch-deck":["無料小売スタートアップ向けピッチ資料","小売スタートアップ・ピッチ"], "modern-company-overview-presentation":["無料モダン会社概要 PowerPoint テンプレート","モダン会社概要"],
    "campaign-marketing-plan-presentation":["無料キャンペーン計画 PowerPoint テンプレート","キャンペーン計画"], "blueprint-project-proposal":["無料ブループリント型プロジェクト提案テンプレート","ブループリント型提案"], "sales-performance-review-presentation":["無料営業実績レビュー PowerPoint テンプレート","営業実績レビュー"],
    "yellow-lesson-plan-presentation":["無料イエロー授業計画 PowerPoint テンプレート","イエロー授業計画"], "green-thesis-defense-presentation":["無料グリーン論文審査 PowerPoint テンプレート","グリーン論文審査"], "modern-clinical-case-presentation":["無料モダン臨床症例 PowerPoint テンプレート","モダン臨床症例"],
    "ai-strategy-presentation":["無料 AI 戦略 PowerPoint テンプレート","AI 戦略"], "y2k-creative-portfolio":["無料 Y2K クリエイティブポートフォリオ","Y2K ポートフォリオ"], "quarterly-product-roadmap":["無料四半期プロダクトロードマップ PowerPoint","四半期ロードマップ"],
  },
  ko: {
    "vintage-small-business-plan":["무료 빈티지 소기업 사업계획서 PowerPoint 템플릿","소기업 사업계획서"], "retail-startup-pitch-deck":["무료 리테일 스타트업 피치덱 템플릿","리테일 스타트업 피치덱"], "modern-company-overview-presentation":["무료 모던 회사 개요 PowerPoint 템플릿","모던 회사 개요"],
    "campaign-marketing-plan-presentation":["무료 캠페인 마케팅 계획 PowerPoint 템플릿","캠페인 마케팅 계획"], "blueprint-project-proposal":["무료 블루프린트 프로젝트 제안 템플릿","블루프린트 프로젝트 제안"], "sales-performance-review-presentation":["무료 영업 성과 리뷰 PowerPoint 템플릿","영업 성과 리뷰"],
    "yellow-lesson-plan-presentation":["무료 옐로 수업 계획 PowerPoint 템플릿","옐로 수업 계획"], "green-thesis-defense-presentation":["무료 그린 학위 논문 발표 PowerPoint 템플릿","그린 논문 발표"], "modern-clinical-case-presentation":["무료 모던 임상 사례 PowerPoint 템플릿","모던 임상 사례"],
    "ai-strategy-presentation":["무료 AI 전략 PowerPoint 템플릿","AI 전략"], "y2k-creative-portfolio":["무료 Y2K 크리에이티브 포트폴리오 템플릿","Y2K 포트폴리오"], "quarterly-product-roadmap":["무료 분기별 제품 로드맵 PowerPoint 템플릿","분기별 제품 로드맵"],
  },
  fr: {
    "vintage-small-business-plan":["Modèle PowerPoint gratuit de business plan vintage","Business plan vintage"], "retail-startup-pitch-deck":["Pitch deck gratuit pour startup de commerce","Pitch deck retail"], "modern-company-overview-presentation":["Modèle PowerPoint gratuit de présentation moderne d’entreprise","Présentation moderne d’entreprise"],
    "campaign-marketing-plan-presentation":["Modèle PowerPoint gratuit de campagne marketing","Campagne marketing"], "blueprint-project-proposal":["Modèle PowerPoint gratuit de proposition de projet blueprint","Proposition blueprint"], "sales-performance-review-presentation":["Modèle PowerPoint gratuit de revue des performances commerciales","Performance commerciale"],
    "yellow-lesson-plan-presentation":["Modèle PowerPoint jaune gratuit de plan de cours","Plan de cours jaune"], "green-thesis-defense-presentation":["Modèle PowerPoint vert gratuit de soutenance","Soutenance verte"], "modern-clinical-case-presentation":["Modèle PowerPoint gratuit de cas clinique moderne","Cas clinique moderne"],
    "ai-strategy-presentation":["Modèle PowerPoint gratuit de stratégie IA","Stratégie IA"], "y2k-creative-portfolio":["Modèle PowerPoint gratuit de portfolio créatif Y2K","Portfolio Y2K"], "quarterly-product-roadmap":["Modèle PowerPoint gratuit de feuille de route trimestrielle","Feuille de route trimestrielle"],
  },
  es: {
    "vintage-small-business-plan":["Plantilla PowerPoint gratis de plan de negocio vintage","Plan de negocio vintage"], "retail-startup-pitch-deck":["Pitch deck gratis para startup de retail","Pitch deck de retail"], "modern-company-overview-presentation":["Plantilla PowerPoint gratis de perfil moderno de empresa","Perfil moderno de empresa"],
    "campaign-marketing-plan-presentation":["Plantilla PowerPoint gratis de campaña de marketing","Campaña de marketing"], "blueprint-project-proposal":["Plantilla PowerPoint gratis de propuesta de proyecto blueprint","Propuesta blueprint"], "sales-performance-review-presentation":["Plantilla PowerPoint gratis de revisión del rendimiento de ventas","Rendimiento de ventas"],
    "yellow-lesson-plan-presentation":["Plantilla PowerPoint amarilla gratis para plan de clase","Plan de clase amarillo"], "green-thesis-defense-presentation":["Plantilla PowerPoint verde gratis para defensa de tesis","Defensa de tesis verde"], "modern-clinical-case-presentation":["Plantilla PowerPoint gratis de caso clínico moderno","Caso clínico moderno"],
    "ai-strategy-presentation":["Plantilla PowerPoint gratis de estrategia de IA","Estrategia de IA"], "y2k-creative-portfolio":["Plantilla PowerPoint gratis de portafolio creativo Y2K","Portafolio Y2K"], "quarterly-product-roadmap":["Plantilla PowerPoint gratis de hoja de ruta trimestral","Hoja de ruta trimestral"],
  },
  ru: {
    "vintage-small-business-plan":["Бесплатный винтажный шаблон бизнес-плана PowerPoint","Винтажный бизнес-план"], "retail-startup-pitch-deck":["Бесплатный питч-дек розничного стартапа","Питч-дек retail-стартапа"], "modern-company-overview-presentation":["Бесплатный современный шаблон презентации компании","Современная презентация компании"],
    "campaign-marketing-plan-presentation":["Бесплатный шаблон маркетинговой кампании PowerPoint","Маркетинговая кампания"], "blueprint-project-proposal":["Бесплатный шаблон проектного предложения blueprint","Проектное предложение blueprint"], "sales-performance-review-presentation":["Бесплатный шаблон обзора эффективности продаж","Эффективность продаж"],
    "yellow-lesson-plan-presentation":["Бесплатный жёлтый шаблон плана урока PowerPoint","Жёлтый план урока"], "green-thesis-defense-presentation":["Бесплатный зелёный шаблон защиты диссертации","Зелёная защита диссертации"], "modern-clinical-case-presentation":["Бесплатный современный шаблон клинического случая","Современный клинический случай"],
    "ai-strategy-presentation":["Бесплатный шаблон стратегии ИИ PowerPoint","Стратегия ИИ"], "y2k-creative-portfolio":["Бесплатный шаблон творческого портфолио Y2K","Портфолио Y2K"], "quarterly-product-roadmap":["Бесплатный шаблон квартальной дорожной карты продукта","Квартальная дорожная карта"],
  },
};

const localized20260910Names: Partial<Record<Locale, Record<string, [string, string]>>> = {
  "zh-CN": {
    "restaurant-launch-business-plan":["免费餐厅开业商业计划 PowerPoint 模板","餐厅开业商业计划"], "deep-tech-startup-pitch-deck":["免费硬科技创业融资路演 PPT 模板","硬科技创业路演"], "retro-company-profile-presentation":["免费复古公司介绍 PowerPoint 模板","复古公司介绍"],
    "event-marketing-plan-presentation":["免费活动营销计划 PowerPoint 模板","活动营销计划"], "road-construction-project-proposal":["免费道路建设项目提案 PowerPoint 模板","道路建设项目提案"], "weekly-sales-report-presentation":["免费每周销售报告 PowerPoint 模板","每周销售报告"],
    "grammar-lesson-plan-presentation":["免费语法课程计划 PowerPoint 模板","语法课程计划"], "monochrome-thesis-defense-presentation":["免费黑白论文答辩 PowerPoint 模板","黑白论文答辩"], "patient-recovery-clinical-case":["免费患者康复临床病例 PowerPoint 模板","患者康复临床病例"],
    "ai-governance-presentation":["免费 AI 治理 PowerPoint 模板","AI 治理"], "architecture-portfolio-presentation":["免费建筑作品集 PowerPoint 模板","建筑作品集"], "release-train-product-roadmap":["免费发布列车产品路线图 PowerPoint 模板","发布列车产品路线图"],
  },
  "zh-TW": {
    "restaurant-launch-business-plan":["免費餐廳開業商業計畫 PowerPoint 範本","餐廳開業商業計畫"], "deep-tech-startup-pitch-deck":["免費硬科技新創募資簡報範本","硬科技新創簡報"], "retro-company-profile-presentation":["免費復古公司介紹 PowerPoint 範本","復古公司介紹"],
    "event-marketing-plan-presentation":["免費活動行銷計畫 PowerPoint 範本","活動行銷計畫"], "road-construction-project-proposal":["免費道路建設專案提案 PowerPoint 範本","道路建設專案提案"], "weekly-sales-report-presentation":["免費每週銷售報告 PowerPoint 範本","每週銷售報告"],
    "grammar-lesson-plan-presentation":["免費文法課程計畫 PowerPoint 範本","文法課程計畫"], "monochrome-thesis-defense-presentation":["免費黑白論文答辯 PowerPoint 範本","黑白論文答辯"], "patient-recovery-clinical-case":["免費病患康復臨床病例 PowerPoint 範本","病患康復臨床病例"],
    "ai-governance-presentation":["免費 AI 治理 PowerPoint 範本","AI 治理"], "architecture-portfolio-presentation":["免費建築作品集 PowerPoint 範本","建築作品集"], "release-train-product-roadmap":["免費發布列車產品路線圖 PowerPoint 範本","發布列車產品路線圖"],
  },
  ja: {
    "restaurant-launch-business-plan":["無料レストラン開業事業計画 PowerPoint テンプレート","レストラン開業事業計画"], "deep-tech-startup-pitch-deck":["無料ディープテック・スタートアップ向けピッチ資料","ディープテック・ピッチ"], "retro-company-profile-presentation":["無料レトロ会社概要 PowerPoint テンプレート","レトロ会社概要"],
    "event-marketing-plan-presentation":["無料イベントマーケティング計画 PowerPoint テンプレート","イベントマーケティング計画"], "road-construction-project-proposal":["無料道路建設プロジェクト提案 PowerPoint テンプレート","道路建設プロジェクト提案"], "weekly-sales-report-presentation":["無料週間営業レポート PowerPoint テンプレート","週間営業レポート"],
    "grammar-lesson-plan-presentation":["無料文法授業計画 PowerPoint テンプレート","文法授業計画"], "monochrome-thesis-defense-presentation":["無料モノクロ論文審査 PowerPoint テンプレート","モノクロ論文審査"], "patient-recovery-clinical-case":["無料患者回復臨床症例 PowerPoint テンプレート","患者回復臨床症例"],
    "ai-governance-presentation":["無料 AI ガバナンス PowerPoint テンプレート","AI ガバナンス"], "architecture-portfolio-presentation":["無料建築ポートフォリオ PowerPoint テンプレート","建築ポートフォリオ"], "release-train-product-roadmap":["無料リリーストレイン製品ロードマップ PowerPoint","リリーストレイン・ロードマップ"],
  },
  ko: {
    "restaurant-launch-business-plan":["무료 레스토랑 오픈 사업계획서 PowerPoint 템플릿","레스토랑 오픈 사업계획서"], "deep-tech-startup-pitch-deck":["무료 딥테크 스타트업 피치덱 템플릿","딥테크 스타트업 피치덱"], "retro-company-profile-presentation":["무료 레트로 회사 소개 PowerPoint 템플릿","레트로 회사 소개"],
    "event-marketing-plan-presentation":["무료 이벤트 마케팅 계획 PowerPoint 템플릿","이벤트 마케팅 계획"], "road-construction-project-proposal":["무료 도로 건설 프로젝트 제안 PowerPoint 템플릿","도로 건설 프로젝트 제안"], "weekly-sales-report-presentation":["무료 주간 영업 보고서 PowerPoint 템플릿","주간 영업 보고서"],
    "grammar-lesson-plan-presentation":["무료 문법 수업 계획 PowerPoint 템플릿","문법 수업 계획"], "monochrome-thesis-defense-presentation":["무료 모노크롬 학위 논문 발표 PowerPoint 템플릿","모노크롬 논문 발표"], "patient-recovery-clinical-case":["무료 환자 회복 임상 사례 PowerPoint 템플릿","환자 회복 임상 사례"],
    "ai-governance-presentation":["무료 AI 거버넌스 PowerPoint 템플릿","AI 거버넌스"], "architecture-portfolio-presentation":["무료 건축 포트폴리오 PowerPoint 템플릿","건축 포트폴리오"], "release-train-product-roadmap":["무료 릴리스 트레인 제품 로드맵 PowerPoint 템플릿","릴리스 트레인 로드맵"],
  },
  fr: {
    "restaurant-launch-business-plan":["Modèle PowerPoint gratuit de business plan pour ouverture de restaurant","Business plan de restaurant"], "deep-tech-startup-pitch-deck":["Pitch deck gratuit pour startup deep tech","Pitch deck deep tech"], "retro-company-profile-presentation":["Modèle PowerPoint gratuit de présentation d’entreprise rétro","Présentation d’entreprise rétro"],
    "event-marketing-plan-presentation":["Modèle PowerPoint gratuit de plan marketing événementiel","Plan marketing événementiel"], "road-construction-project-proposal":["Modèle PowerPoint gratuit de proposition de construction routière","Proposition de construction routière"], "weekly-sales-report-presentation":["Modèle PowerPoint gratuit de rapport commercial hebdomadaire","Rapport commercial hebdomadaire"],
    "grammar-lesson-plan-presentation":["Modèle PowerPoint gratuit de cours de grammaire","Cours de grammaire"], "monochrome-thesis-defense-presentation":["Modèle PowerPoint monochrome gratuit de soutenance","Soutenance monochrome"], "patient-recovery-clinical-case":["Modèle PowerPoint gratuit de cas clinique de récupération","Cas clinique de récupération"],
    "ai-governance-presentation":["Modèle PowerPoint gratuit de gouvernance de l’IA","Gouvernance de l’IA"], "architecture-portfolio-presentation":["Modèle PowerPoint gratuit de portfolio d’architecture","Portfolio d’architecture"], "release-train-product-roadmap":["Modèle PowerPoint gratuit de feuille de route des versions","Feuille de route des versions"],
  },
  es: {
    "restaurant-launch-business-plan":["Plantilla PowerPoint gratis de plan de negocio para abrir un restaurante","Plan de negocio de restaurante"], "deep-tech-startup-pitch-deck":["Pitch deck gratis para startup deep tech","Pitch deck deep tech"], "retro-company-profile-presentation":["Plantilla PowerPoint gratis de perfil de empresa retro","Perfil de empresa retro"],
    "event-marketing-plan-presentation":["Plantilla PowerPoint gratis de plan de marketing de eventos","Plan de marketing de eventos"], "road-construction-project-proposal":["Plantilla PowerPoint gratis de propuesta de construcción vial","Propuesta de construcción vial"], "weekly-sales-report-presentation":["Plantilla PowerPoint gratis de informe semanal de ventas","Informe semanal de ventas"],
    "grammar-lesson-plan-presentation":["Plantilla PowerPoint gratis de plan de clase de gramática","Clase de gramática"], "monochrome-thesis-defense-presentation":["Plantilla PowerPoint monocroma gratis para defensa de tesis","Defensa de tesis monocroma"], "patient-recovery-clinical-case":["Plantilla PowerPoint gratis de caso clínico de recuperación","Caso clínico de recuperación"],
    "ai-governance-presentation":["Plantilla PowerPoint gratis de gobernanza de IA","Gobernanza de IA"], "architecture-portfolio-presentation":["Plantilla PowerPoint gratis de portafolio de arquitectura","Portafolio de arquitectura"], "release-train-product-roadmap":["Plantilla PowerPoint gratis de hoja de ruta de lanzamientos","Hoja de ruta de lanzamientos"],
  },
  ru: {
    "restaurant-launch-business-plan":["Бесплатный шаблон бизнес-плана открытия ресторана PowerPoint","Бизнес-план ресторана"], "deep-tech-startup-pitch-deck":["Бесплатный питч-дек deep tech стартапа","Питч-дек deep tech"], "retro-company-profile-presentation":["Бесплатный ретро-шаблон презентации компании","Ретро-презентация компании"],
    "event-marketing-plan-presentation":["Бесплатный шаблон плана событийного маркетинга PowerPoint","План событийного маркетинга"], "road-construction-project-proposal":["Бесплатный шаблон предложения дорожного строительства PowerPoint","Предложение дорожного строительства"], "weekly-sales-report-presentation":["Бесплатный шаблон еженедельного отчёта о продажах PowerPoint","Еженедельный отчёт о продажах"],
    "grammar-lesson-plan-presentation":["Бесплатный шаблон урока грамматики PowerPoint","Урок грамматики"], "monochrome-thesis-defense-presentation":["Бесплатный монохромный шаблон защиты диссертации PowerPoint","Монохромная защита диссертации"], "patient-recovery-clinical-case":["Бесплатный шаблон клинического случая восстановления пациента","Клинический случай восстановления"],
    "ai-governance-presentation":["Бесплатный шаблон управления ИИ PowerPoint","Управление ИИ"], "architecture-portfolio-presentation":["Бесплатный шаблон архитектурного портфолио PowerPoint","Архитектурное портфолио"], "release-train-product-roadmap":["Бесплатный шаблон дорожной карты релизов PowerPoint","Дорожная карта релизов"],
  },
};

const localized20260910Round2Names: Partial<Record<Locale, Record<string, [string, string]>>> = {
  "zh-CN": {
    "circular-fashion-business-plan":["免费循环时尚商业计划 PowerPoint 模板","循环时尚商业计划"], "fintech-control-room-pitch-deck":["免费金融科技创业融资路演 PPT 模板","金融科技控制室路演"], "structural-grid-company-profile":["免费建筑公司介绍 PowerPoint 模板","结构网格公司介绍"],
    "digital-channel-launch-plan":["免费数字营销发布计划 PowerPoint 模板","数字渠道发布计划"], "engineering-systems-project-proposal":["免费工程系统项目提案 PowerPoint 模板","工程系统提案"], "quarterly-sales-review-presentation":["免费季度销售复盘 PowerPoint 模板","季度销售复盘"],
    "constellation-lesson-plan-presentation":["免费星座课程计划 PowerPoint 模板","星座课程计划"], "evidence-coding-thesis-defense":["免费定性研究论文答辩 PowerPoint 模板","证据编码论文答辩"], "clinical-decision-board-case":["免费临床决策病例 PowerPoint 模板","临床决策病例"],
    "cyber-resilience-technology-brief":["免费网络韧性技术 PowerPoint 模板","网络韧性技术简报"], "fashion-pattern-portfolio":["免费时装设计作品集 PowerPoint 模板","时装纸样作品集"], "dependency-calendar-product-roadmap":["免费依赖日历产品路线图 PowerPoint 模板","依赖日历路线图"],
  },
  "zh-TW": {
    "circular-fashion-business-plan":["免費循環時尚商業計畫 PowerPoint 範本","循環時尚商業計畫"], "fintech-control-room-pitch-deck":["免費金融科技新創募資簡報範本","金融科技控制室簡報"], "structural-grid-company-profile":["免費營造公司介紹 PowerPoint 範本","結構網格公司介紹"],
    "digital-channel-launch-plan":["免費數位行銷發布計畫 PowerPoint 範本","數位管道發布計畫"], "engineering-systems-project-proposal":["免費工程系統專案提案 PowerPoint 範本","工程系統提案"], "quarterly-sales-review-presentation":["免費季度銷售回顧 PowerPoint 範本","季度銷售回顧"],
    "constellation-lesson-plan-presentation":["免費星座課程計畫 PowerPoint 範本","星座課程計畫"], "evidence-coding-thesis-defense":["免費質性研究論文答辯 PowerPoint 範本","證據編碼論文答辯"], "clinical-decision-board-case":["免費臨床決策病例 PowerPoint 範本","臨床決策病例"],
    "cyber-resilience-technology-brief":["免費網路韌性技術 PowerPoint 範本","網路韌性技術簡報"], "fashion-pattern-portfolio":["免費時裝設計作品集 PowerPoint 範本","時裝紙樣作品集"], "dependency-calendar-product-roadmap":["免費依賴日曆產品路線圖 PowerPoint 範本","依賴日曆路線圖"],
  },
  ja: {
    "circular-fashion-business-plan":["無料循環型ファッション事業計画 PowerPoint テンプレート","循環型ファッション事業計画"], "fintech-control-room-pitch-deck":["無料 FinTech スタートアップ・ピッチデッキ","FinTech コントロールルーム"], "structural-grid-company-profile":["無料建設会社概要 PowerPoint テンプレート","構造グリッド会社概要"],
    "digital-channel-launch-plan":["無料デジタルマーケティング発表計画 PowerPoint","デジタルチャネル発表計画"], "engineering-systems-project-proposal":["無料エンジニアリングシステム提案 PowerPoint","エンジニアリングシステム提案"], "quarterly-sales-review-presentation":["無料四半期営業レビュー PowerPoint テンプレート","四半期営業レビュー"],
    "constellation-lesson-plan-presentation":["無料星座授業計画 PowerPoint テンプレート","星座授業計画"], "evidence-coding-thesis-defense":["無料質的研究論文審査 PowerPoint テンプレート","エビデンスコーディング論文審査"], "clinical-decision-board-case":["無料臨床意思決定症例 PowerPoint テンプレート","臨床意思決定症例"],
    "cyber-resilience-technology-brief":["無料サイバーレジリエンス技術 PowerPoint","サイバーレジリエンス技術概要"], "fashion-pattern-portfolio":["無料ファッションデザイン・ポートフォリオ PowerPoint","ファッションパターン・ポートフォリオ"], "dependency-calendar-product-roadmap":["無料依存関係カレンダー製品ロードマップ","依存関係カレンダー"],
  },
  ko: {
    "circular-fashion-business-plan":["무료 순환 패션 사업계획서 PowerPoint 템플릿","순환 패션 사업계획서"], "fintech-control-room-pitch-deck":["무료 핀테크 스타트업 피치덱 템플릿","핀테크 컨트롤룸 피치덱"], "structural-grid-company-profile":["무료 건설 회사 소개 PowerPoint 템플릿","구조 그리드 회사 소개"],
    "digital-channel-launch-plan":["무료 디지털 마케팅 출시 계획 PowerPoint 템플릿","디지털 채널 출시 계획"], "engineering-systems-project-proposal":["무료 엔지니어링 시스템 프로젝트 제안 템플릿","엔지니어링 시스템 제안"], "quarterly-sales-review-presentation":["무료 분기별 영업 리뷰 PowerPoint 템플릿","분기별 영업 리뷰"],
    "constellation-lesson-plan-presentation":["무료 별자리 수업 계획 PowerPoint 템플릿","별자리 수업 계획"], "evidence-coding-thesis-defense":["무료 질적 연구 학위 논문 발표 PowerPoint 템플릿","근거 코딩 논문 발표"], "clinical-decision-board-case":["무료 임상 의사결정 사례 PowerPoint 템플릿","임상 의사결정 사례"],
    "cyber-resilience-technology-brief":["무료 사이버 회복탄력성 기술 PowerPoint 템플릿","사이버 회복탄력성 브리프"], "fashion-pattern-portfolio":["무료 패션 디자인 포트폴리오 PowerPoint 템플릿","패션 패턴 포트폴리오"], "dependency-calendar-product-roadmap":["무료 종속성 캘린더 제품 로드맵 PowerPoint","종속성 캘린더 로드맵"],
  },
  fr: {
    "circular-fashion-business-plan":["Modèle PowerPoint gratuit de business plan de mode circulaire","Business plan de mode circulaire"], "fintech-control-room-pitch-deck":["Pitch deck gratuit pour startup FinTech","Pitch deck FinTech control room"], "structural-grid-company-profile":["Modèle PowerPoint gratuit de profil d’entreprise de construction","Profil d’entreprise structurel"],
    "digital-channel-launch-plan":["Modèle PowerPoint gratuit de lancement marketing numérique","Plan de lancement digital"], "engineering-systems-project-proposal":["Modèle PowerPoint gratuit de proposition de système d’ingénierie","Proposition de système d’ingénierie"], "quarterly-sales-review-presentation":["Modèle PowerPoint gratuit de revue commerciale trimestrielle","Revue commerciale trimestrielle"],
    "constellation-lesson-plan-presentation":["Modèle PowerPoint gratuit de cours sur les constellations","Cours sur les constellations"], "evidence-coding-thesis-defense":["Modèle PowerPoint gratuit de soutenance de recherche qualitative","Soutenance de codage des preuves"], "clinical-decision-board-case":["Modèle PowerPoint gratuit de cas de décision clinique","Cas de décision clinique"],
    "cyber-resilience-technology-brief":["Modèle PowerPoint gratuit de cyber-résilience","Brief technologique de cyber-résilience"], "fashion-pattern-portfolio":["Modèle PowerPoint gratuit de portfolio de mode","Portfolio de patronage de mode"], "dependency-calendar-product-roadmap":["Modèle PowerPoint gratuit de feuille de route des dépendances","Feuille de route des dépendances"],
  },
  es: {
    "circular-fashion-business-plan":["Plantilla PowerPoint gratis de plan de negocio de moda circular","Plan de negocio de moda circular"], "fintech-control-room-pitch-deck":["Pitch deck gratis para startup FinTech","Pitch deck FinTech control room"], "structural-grid-company-profile":["Plantilla PowerPoint gratis de perfil de empresa constructora","Perfil de empresa estructural"],
    "digital-channel-launch-plan":["Plantilla PowerPoint gratis de lanzamiento de marketing digital","Plan de lanzamiento digital"], "engineering-systems-project-proposal":["Plantilla PowerPoint gratis de propuesta de sistemas de ingeniería","Propuesta de sistemas de ingeniería"], "quarterly-sales-review-presentation":["Plantilla PowerPoint gratis de revisión trimestral de ventas","Revisión trimestral de ventas"],
    "constellation-lesson-plan-presentation":["Plantilla PowerPoint gratis de clase sobre constelaciones","Clase sobre constelaciones"], "evidence-coding-thesis-defense":["Plantilla PowerPoint gratis de defensa de investigación cualitativa","Defensa de codificación de evidencias"], "clinical-decision-board-case":["Plantilla PowerPoint gratis de caso de decisión clínica","Caso de decisión clínica"],
    "cyber-resilience-technology-brief":["Plantilla PowerPoint gratis de ciberresiliencia","Brief tecnológico de ciberresiliencia"], "fashion-pattern-portfolio":["Plantilla PowerPoint gratis de portafolio de moda","Portafolio de patronaje de moda"], "dependency-calendar-product-roadmap":["Plantilla PowerPoint gratis de hoja de ruta de dependencias","Hoja de ruta de dependencias"],
  },
  ru: {
    "circular-fashion-business-plan":["Бесплатный шаблон бизнес-плана циркулярной моды PowerPoint","Бизнес-план циркулярной моды"], "fintech-control-room-pitch-deck":["Бесплатный питч-дек FinTech-стартапа","Питч-дек FinTech control room"], "structural-grid-company-profile":["Бесплатный шаблон презентации строительной компании","Профиль строительной компании"],
    "digital-channel-launch-plan":["Бесплатный шаблон плана запуска цифрового маркетинга","План запуска цифровых каналов"], "engineering-systems-project-proposal":["Бесплатный шаблон предложения инженерной системы","Предложение инженерной системы"], "quarterly-sales-review-presentation":["Бесплатный шаблон квартального обзора продаж","Квартальный обзор продаж"],
    "constellation-lesson-plan-presentation":["Бесплатный шаблон урока о созвездиях PowerPoint","Урок о созвездиях"], "evidence-coding-thesis-defense":["Бесплатный шаблон защиты качественного исследования","Защита кодирования доказательств"], "clinical-decision-board-case":["Бесплатный шаблон клинического случая принятия решений","Клинический случай решений"],
    "cyber-resilience-technology-brief":["Бесплатный шаблон презентации о киберустойчивости","Обзор киберустойчивости"], "fashion-pattern-portfolio":["Бесплатный шаблон портфолио дизайна одежды","Портфолио модных выкроек"], "dependency-calendar-product-roadmap":["Бесплатный шаблон календарной дорожной карты зависимостей","Календарь зависимостей"],
  },
};

const localized20260911Names: Partial<Record<Locale, Record<string, [string, string]>>> = {
  "zh-CN": {
    "boutique-hotel-operating-plan": ["免费精品酒店商业计划 PowerPoint 模板", "精品酒店商业计划"],
    "medical-device-validation-pitch-deck": ["免费医疗器械创业融资路演 PowerPoint 模板", "医疗器械验证路演"],
    "logistics-network-company-profile": ["免费物流公司介绍 PowerPoint 模板", "物流网络公司介绍"],
    "real-estate-listing-marketing-plan": ["免费房地产营销计划 PowerPoint 模板", "房地产房源营销计划"],
    "urban-canopy-restoration-proposal": ["免费造林项目提案 PowerPoint 模板", "城市树冠修复提案"],
    "annual-sales-performance-review": ["免费年度销售业绩复盘 PowerPoint 模板", "年度销售业绩复盘"],
    "ancient-civilizations-history-lesson": ["免费古代文明历史课 PowerPoint 模板", "古代文明历史课"],
    "archival-humanities-thesis-defense": ["免费人文学科论文答辩 PowerPoint 模板", "档案人文论文答辩"],
    "behavioral-health-case-conference": ["免费行为健康病例汇报 PowerPoint 模板", "行为健康病例讨论"],
    "generative-ai-seminar-presentation": ["免费生成式 AI 研讨会 PowerPoint 模板", "生成式 AI 研讨会"],
    "ceramic-studio-portfolio": ["免费陶艺师作品集 PowerPoint 模板", "陶艺工作室作品集"],
    "platform-modernization-product-roadmap": ["免费技术产品路线图 PowerPoint 模板", "平台现代化路线图"],
  },
  "zh-TW": {
    "boutique-hotel-operating-plan": ["免費精品飯店商業計畫 PowerPoint 範本", "精品飯店商業計畫"],
    "medical-device-validation-pitch-deck": ["免費醫療器材新創募資簡報範本", "醫療器材驗證簡報"],
    "logistics-network-company-profile": ["免費物流公司介紹 PowerPoint 範本", "物流網路公司介紹"],
    "real-estate-listing-marketing-plan": ["免費房地產行銷計畫 PowerPoint 範本", "房源行銷計畫"],
    "urban-canopy-restoration-proposal": ["免費造林專案提案 PowerPoint 範本", "城市樹冠修復提案"],
    "annual-sales-performance-review": ["免費年度銷售績效回顧 PowerPoint 範本", "年度銷售績效回顧"],
    "ancient-civilizations-history-lesson": ["免費古代文明歷史課 PowerPoint 範本", "古代文明歷史課"],
    "archival-humanities-thesis-defense": ["免費人文學科論文答辯 PowerPoint 範本", "檔案人文論文答辯"],
    "behavioral-health-case-conference": ["免費行為健康病例報告 PowerPoint 範本", "行為健康病例討論"],
    "generative-ai-seminar-presentation": ["免費生成式 AI 研討會 PowerPoint 範本", "生成式 AI 研討會"],
    "ceramic-studio-portfolio": ["免費陶藝家作品集 PowerPoint 範本", "陶藝工作室作品集"],
    "platform-modernization-product-roadmap": ["免費技術產品路線圖 PowerPoint 範本", "平台現代化路線圖"],
  },
  ja: {
    "boutique-hotel-operating-plan": ["無料ブティックホテル事業計画 PowerPoint テンプレート", "ブティックホテル事業計画"],
    "medical-device-validation-pitch-deck": ["無料医療機器スタートアップ・ピッチデッキ", "医療機器検証ピッチ"],
    "logistics-network-company-profile": ["無料物流会社概要 PowerPoint テンプレート", "物流ネットワーク会社概要"],
    "real-estate-listing-marketing-plan": ["無料不動産マーケティング計画 PowerPoint", "物件マーケティング計画"],
    "urban-canopy-restoration-proposal": ["無料植林プロジェクト提案 PowerPoint", "都市樹冠再生提案"],
    "annual-sales-performance-review": ["無料年間営業実績レビュー PowerPoint", "年間営業実績レビュー"],
    "ancient-civilizations-history-lesson": ["無料古代文明歴史授業 PowerPoint", "古代文明歴史授業"],
    "archival-humanities-thesis-defense": ["無料人文学論文審査 PowerPoint テンプレート", "史料研究論文審査"],
    "behavioral-health-case-conference": ["無料行動健康症例発表 PowerPoint", "行動健康症例カンファレンス"],
    "generative-ai-seminar-presentation": ["無料生成 AI セミナー PowerPoint テンプレート", "生成 AI セミナー"],
    "ceramic-studio-portfolio": ["無料陶芸家ポートフォリオ PowerPoint", "陶芸スタジオ・ポートフォリオ"],
    "platform-modernization-product-roadmap": ["無料技術製品ロードマップ PowerPoint", "プラットフォーム刷新ロードマップ"],
  },
  ko: {
    "boutique-hotel-operating-plan": ["무료 부티크 호텔 사업계획서 PowerPoint 템플릿", "부티크 호텔 사업계획서"],
    "medical-device-validation-pitch-deck": ["무료 의료기기 스타트업 피치덱 템플릿", "의료기기 검증 피치덱"],
    "logistics-network-company-profile": ["무료 물류 회사 소개 PowerPoint 템플릿", "물류 네트워크 회사 소개"],
    "real-estate-listing-marketing-plan": ["무료 부동산 마케팅 계획 PowerPoint 템플릿", "매물 마케팅 계획"],
    "urban-canopy-restoration-proposal": ["무료 조림 프로젝트 제안 PowerPoint 템플릿", "도시 수관 복원 제안"],
    "annual-sales-performance-review": ["무료 연간 영업 성과 리뷰 PowerPoint 템플릿", "연간 영업 성과 리뷰"],
    "ancient-civilizations-history-lesson": ["무료 고대 문명 역사 수업 PowerPoint 템플릿", "고대 문명 역사 수업"],
    "archival-humanities-thesis-defense": ["무료 인문학 학위 논문 발표 PowerPoint", "기록 인문학 논문 발표"],
    "behavioral-health-case-conference": ["무료 행동 건강 사례 발표 PowerPoint 템플릿", "행동 건강 사례 회의"],
    "generative-ai-seminar-presentation": ["무료 생성형 AI 세미나 PowerPoint 템플릿", "생성형 AI 세미나"],
    "ceramic-studio-portfolio": ["무료 도예가 포트폴리오 PowerPoint 템플릿", "도예 스튜디오 포트폴리오"],
    "platform-modernization-product-roadmap": ["무료 기술 제품 로드맵 PowerPoint 템플릿", "플랫폼 현대화 로드맵"],
  },
  fr: {
    "boutique-hotel-operating-plan": ["Modèle PowerPoint gratuit de business plan d’hôtel boutique", "Business plan d’hôtel boutique"],
    "medical-device-validation-pitch-deck": ["Pitch deck gratuit de startup de dispositif médical", "Pitch de validation médicale"],
    "logistics-network-company-profile": ["Modèle PowerPoint gratuit de profil d’entreprise logistique", "Profil de réseau logistique"],
    "real-estate-listing-marketing-plan": ["Modèle PowerPoint gratuit de plan marketing immobilier", "Plan marketing immobilier"],
    "urban-canopy-restoration-proposal": ["Modèle PowerPoint gratuit de projet de reboisement", "Proposition de canopée urbaine"],
    "annual-sales-performance-review": ["Modèle PowerPoint gratuit de revue annuelle des ventes", "Revue annuelle des ventes"],
    "ancient-civilizations-history-lesson": ["Modèle PowerPoint gratuit de cours sur les civilisations anciennes", "Cours sur les civilisations anciennes"],
    "archival-humanities-thesis-defense": ["Modèle PowerPoint gratuit de soutenance en sciences humaines", "Soutenance de recherche archivistique"],
    "behavioral-health-case-conference": ["Modèle PowerPoint gratuit de cas en santé comportementale", "Cas de santé comportementale"],
    "generative-ai-seminar-presentation": ["Modèle PowerPoint gratuit de séminaire sur l’IA générative", "Séminaire sur l’IA générative"],
    "ceramic-studio-portfolio": ["Modèle PowerPoint gratuit de portfolio de céramiste", "Portfolio d’atelier de céramique"],
    "platform-modernization-product-roadmap": ["Modèle PowerPoint gratuit de feuille de route technologique", "Feuille de route de modernisation"],
  },
  es: {
    "boutique-hotel-operating-plan": ["Plantilla PowerPoint gratis de plan de negocio de hotel boutique", "Plan de negocio de hotel boutique"],
    "medical-device-validation-pitch-deck": ["Pitch deck gratis para startup de dispositivos médicos", "Pitch de validación médica"],
    "logistics-network-company-profile": ["Plantilla PowerPoint gratis de perfil de empresa logística", "Perfil de red logística"],
    "real-estate-listing-marketing-plan": ["Plantilla PowerPoint gratis de plan de marketing inmobiliario", "Plan de marketing inmobiliario"],
    "urban-canopy-restoration-proposal": ["Plantilla PowerPoint gratis de propuesta de reforestación", "Propuesta de dosel urbano"],
    "annual-sales-performance-review": ["Plantilla PowerPoint gratis de revisión anual de ventas", "Revisión anual de ventas"],
    "ancient-civilizations-history-lesson": ["Plantilla PowerPoint gratis de clase de civilizaciones antiguas", "Clase de civilizaciones antiguas"],
    "archival-humanities-thesis-defense": ["Plantilla PowerPoint gratis de defensa de tesis de humanidades", "Defensa de investigación archivística"],
    "behavioral-health-case-conference": ["Plantilla PowerPoint gratis de caso de salud conductual", "Caso de salud conductual"],
    "generative-ai-seminar-presentation": ["Plantilla PowerPoint gratis de seminario de IA generativa", "Seminario de IA generativa"],
    "ceramic-studio-portfolio": ["Plantilla PowerPoint gratis de portafolio de ceramista", "Portafolio de estudio cerámico"],
    "platform-modernization-product-roadmap": ["Plantilla PowerPoint gratis de hoja de ruta tecnológica", "Hoja de ruta de modernización"],
  },
  ru: {
    "boutique-hotel-operating-plan": ["Бесплатный шаблон бизнес-плана бутик-отеля PowerPoint", "Бизнес-план бутик-отеля"],
    "medical-device-validation-pitch-deck": ["Бесплатный питч-дек стартапа медицинского устройства", "Питч по валидации устройства"],
    "logistics-network-company-profile": ["Бесплатный шаблон презентации логистической компании", "Профиль логистической сети"],
    "real-estate-listing-marketing-plan": ["Бесплатный шаблон маркетингового плана недвижимости", "Маркетинговый план объекта"],
    "urban-canopy-restoration-proposal": ["Бесплатный шаблон предложения по лесовосстановлению", "Предложение по городской кроне"],
    "annual-sales-performance-review": ["Бесплатный шаблон годового обзора продаж PowerPoint", "Годовой обзор продаж"],
    "ancient-civilizations-history-lesson": ["Бесплатный шаблон урока о древних цивилизациях", "Урок о древних цивилизациях"],
    "archival-humanities-thesis-defense": ["Бесплатный шаблон защиты диссертации по гуманитарным наукам", "Защита архивного исследования"],
    "behavioral-health-case-conference": ["Бесплатный шаблон клинического случая по поведенческому здоровью", "Случай поведенческого здоровья"],
    "generative-ai-seminar-presentation": ["Бесплатный шаблон семинара по генеративному ИИ", "Семинар по генеративному ИИ"],
    "ceramic-studio-portfolio": ["Бесплатный шаблон портфолио художника-керамиста", "Портфолио керамической студии"],
    "platform-modernization-product-roadmap": ["Бесплатный шаблон технологической дорожной карты", "Дорожная карта модернизации"],
  },
};

export function localizedTemplateName(template: PptTemplate, locale: Locale) {
  const names = localized20260911Names[locale]?.[template.slug] ?? localized20260910Round2Names[locale]?.[template.slug] ?? localized20260910Names[locale]?.[template.slug] ?? localizedDailyNames[locale]?.[template.slug] ?? localizedNames[locale]?.[template.slug];
  return { name: names?.[0] ?? template.name, shortName: names?.[1] ?? template.shortName };
}

export function localizedCategoryName(category: TemplateCategory, locale: Locale) {
  const templateSlug = `${category.slug}-presentation`;
  const exceptions: Record<string, string> = { "business-plan": "business-plan-presentation", "pitch-deck": "startup-pitch-deck", "company-profile": "company-profile-presentation", education: "lesson-plan-presentation", medical: "clinical-case-presentation", portfolio: "creative-portfolio-presentation" };
  return localizedNames[locale]?.[exceptions[category.slug] ?? templateSlug]?.[1] ?? category.name;
}
