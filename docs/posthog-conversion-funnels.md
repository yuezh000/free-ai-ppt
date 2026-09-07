# PostHog conversion funnel template

All custom events include `funnel_version=freeppt-v1`. Do not send prompt text, filenames, email addresses, verification codes, or passwords to PostHog.

Live dashboard: [FreeAIPPT Conversion](https://us.posthog.com/project/593673/dashboard/2071072). It is pinned in the PostHog project and contains the four funnels below.

## Funnel 1: visitor to launch interest

- Type: ordered funnel
- Conversion window: 14 days
- Steps:
  1. `$pageview` filtered to the home page
  2. `generator_started`
  3. `deck_generation_requested`
  4. `waitlist_joined` with `source=generator`
- Useful breakdowns: initial referrer/UTM source, `locale`, and `input_source`

## Funnel 2: account signup

- Type: ordered funnel
- Conversion window: 24 hours
- Steps:
  1. `auth_dialog_opened` with `signed_in=false`
  2. `signup_started`
  3. `signup_code_requested`
  4. `signup_completed`
  5. `password_configured` with `mode=set`
- Useful breakdowns: initial referrer/UTM source and `locale`

## Funnel 3: pricing interest

- Type: ordered funnel
- Conversion window: 14 days
- Steps:
  1. `$pageview` filtered to `/pricing` and localized pricing paths
  2. `pricing_plan_selected`
  3. `waitlist_joined` with `source=pricing`
- Useful breakdowns: `plan_index`, `plan_name`, and `locale`

## Funnel 4: free template acquisition

- Type: ordered funnel
- Conversion window: 7 days
- Steps:
  1. `template_viewed`
  2. `template_preview_opened` (optional step)
  3. `template_downloaded`
- Create a second branch funnel by replacing the final step with `template_customize_clicked`.
- Useful breakdowns: `template`, `category`, and `locale`

## Event ownership

The browser events are defined centrally in `lib/analytics.ts`. When real generation and payment are enabled, extend the funnel with server-authoritative completion events such as `deck_generation_completed`, `deck_downloaded`, and `purchase_completed`; do not infer these from button clicks.

The public project token can capture events but cannot create or edit PostHog insights. Dashboard management requires a personal API key with project write access; that key must never be stored in this repository.
