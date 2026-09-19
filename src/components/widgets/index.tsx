import type { WidgetKind } from "@/content/types";
import { BondCalculator } from "./BondCalculator";
import { MmfSimulator } from "./MmfSimulator";
import { RepoCalculator } from "./RepoCalculator";
import { SecLendingCalculator } from "./SecLendingCalculator";
import { SettlementSimulator } from "./SettlementSimulator";
import { WaterfallSimulator } from "./WaterfallSimulator";

export function Widget({ kind }: { kind: WidgetKind }) {
  switch (kind) {
    case "repo":
      return <RepoCalculator />;
    case "bond":
      return <BondCalculator />;
    case "seclending":
      return <SecLendingCalculator />;
    case "settlement":
      return <SettlementSimulator />;
    case "mmf":
      return <MmfSimulator />;
    case "waterfall":
      return <WaterfallSimulator />;
  }
}
