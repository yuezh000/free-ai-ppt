import posthog from "posthog-js";

export const conversionEvents = {
  generatorStarted: "generator_started",
  attachmentsAdded: "generator_attachments_added",
  templateSelected: "generator_template_selected",
  generationRequested: "deck_generation_requested",
  taskSubmitted: "deck_task_submitted",
  authDialogOpened: "auth_dialog_opened",
  signupStarted: "signup_started",
  signupCodeRequested: "signup_code_requested",
  signupCompleted: "signup_completed",
  signinCodeRequested: "signin_code_requested",
  signinCompleted: "signin_completed",
  passwordConfigured: "password_configured",
  signoutCompleted: "signout_completed",
  pricingPlanSelected: "pricing_plan_selected",
  waitlistJoined: "waitlist_joined",
  templateViewed: "template_viewed",
  templatePreviewOpened: "template_preview_opened",
  templateDownloaded: "template_downloaded",
  templateCustomizeClicked: "template_customize_clicked",
} as const;

type ConversionEvent = (typeof conversionEvents)[keyof typeof conversionEvents];
type Properties = Record<string, boolean | number | string | null | undefined>;

export function captureConversion(event: ConversionEvent, properties: Properties = {}) {
  posthog.capture(event, { funnel_version: "freeppt-v1", ...properties });
}

export function identifyUser(userId: string) {
  posthog.identify(userId, { account_type: "email" });
}

export function resetAnalyticsUser() {
  posthog.reset();
}
