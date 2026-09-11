import { AdminDashboard } from "@/components/admin-dashboard";
import { Header } from "@/components/header";
import { getResourcePageStats } from "@/lib/resource-page-stats";

export default function AdminPage() {
  return <main><Header/><AdminDashboard resourceStats={getResourcePageStats()}/></main>;
}
