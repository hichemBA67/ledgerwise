import { RedirectPage } from "@/components/RedirectPage";

export const metadata = { title: "RL1 ecosystem", robots: { index: false } };

export default function Rl1Redirect() {
  return <RedirectPage to="/ecosystem/" label="the RL1 ecosystem hub" />;
}
