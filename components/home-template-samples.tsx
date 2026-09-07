import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LayoutTemplate, Sparkles } from "lucide-react";
import { localizePath, type Locale } from "@/lib/i18n";
import { localizedTemplateName } from "@/lib/template-i18n";
import { templates } from "@/lib/templates";

const copy: Record<Locale,{eyebrow:string;title:string;lead:string;preview:string;use:string;all:string}> = {
  en:{eyebrow:"START WITH A TEMPLATE",title:"Pick a proven presentation style",lead:"Choose a visual direction, add your content, and let FreeAIPPT build the complete deck.",preview:"Preview",use:"Use this template",all:"See all free templates"},
  "zh-CN":{eyebrow:"从模板开始",title:"选择一种经过验证的演示风格",lead:"选择视觉方向并提供内容，由 FreeAIPPT 完成整份演示文稿。",preview:"预览",use:"使用此模板创建",all:"查看全部免费模板"},
  "zh-TW":{eyebrow:"從範本開始",title:"選擇一種實用的簡報風格",lead:"選擇視覺方向並提供內容，由 FreeAIPPT 完成整份簡報。",preview:"預覽",use:"使用此範本建立",all:"查看全部免費範本"},
  ja:{eyebrow:"テンプレートから開始",title:"実用的なプレゼンスタイルを選択",lead:"デザインを選び、内容を追加すると、FreeAIPPTが資料全体を作成します。",preview:"プレビュー",use:"このテンプレートで作成",all:"無料テンプレートをすべて見る"},
  ko:{eyebrow:"템플릿으로 시작",title:"검증된 프레젠테이션 스타일 선택",lead:"디자인을 선택하고 내용을 추가하면 FreeAIPPT가 전체 자료를 만듭니다.",preview:"미리보기",use:"이 템플릿으로 만들기",all:"무료 템플릿 모두 보기"},
  fr:{eyebrow:"COMMENCEZ AVEC UN MODÈLE",title:"Choisissez un style de présentation éprouvé",lead:"Choisissez une direction visuelle, ajoutez votre contenu et laissez FreeAIPPT créer la présentation.",preview:"Aperçu",use:"Créer avec ce modèle",all:"Voir tous les modèles gratuits"},
  es:{eyebrow:"EMPIEZA CON UNA PLANTILLA",title:"Elige un estilo de presentación probado",lead:"Elige una dirección visual, añade el contenido y deja que FreeAIPPT cree la presentación.",preview:"Vista previa",use:"Crear con esta plantilla",all:"Ver todas las plantillas gratis"},
  ru:{eyebrow:"НАЧНИТЕ С ШАБЛОНА",title:"Выберите готовый стиль презентации",lead:"Выберите визуальное направление, добавьте материалы — FreeAIPPT соберёт всю презентацию.",preview:"Открыть",use:"Создать с этим шаблоном",all:"Все бесплатные шаблоны"},
};

export function HomeTemplateSamples({locale="en"}:{locale?:Locale}) {
  const t=copy[locale];
  return <section className="home-templates"><div className="home-templates-head"><div><span className="eyebrow"><LayoutTemplate size={14}/>{t.eyebrow}</span><h2>{t.title}</h2><p>{t.lead}</p></div><Link href={localizePath(locale,"/templates")} className="secondary-button">{t.all}<ArrowRight size={16}/></Link></div><div className="home-template-grid">{templates.map(template=>{const name=localizedTemplateName(template,locale);return <article key={template.slug}><Link href={localizePath(locale,`/templates/${template.slug}`)} className="home-template-image"><Image src={`/templates/previews/${template.slug}/01.jpg`} alt={`${name.name} ${t.preview}`} width={640} height={360}/></Link><div><span>{template.category}</span><h3>{name.shortName}</h3><a data-testid={`home-template-${template.slug}-use`} href={`${localizePath(locale)}?template=${template.slug}#generator`} className="template-use-cta"><Sparkles size={15}/>{t.use}<ArrowRight size={14}/></a></div></article>})}</div></section>;
}
