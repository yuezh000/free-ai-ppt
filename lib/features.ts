export type FeatureFlags = { task_submission: boolean; waitlist: boolean };

export async function getFeatureFlags(): Promise<FeatureFlags> {
  const response = await fetch("/api/v1/features", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load feature settings");
  return response.json() as Promise<FeatureFlags>;
}
