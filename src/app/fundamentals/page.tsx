import { RedirectPage } from "@/components/RedirectPage";

export const metadata = { title: "Learning platform", robots: { index: false } };

export default function FundamentalsRedirect() {
  return <RedirectPage to="/#learn" label="the learning platform" />;
}
