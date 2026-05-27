import AppShell from "@/components/AppShell";
import ExpenditureSectionPage from "@/components/expenditure/ExpenditureSectionPage";

export default function RepairExpenditurePage() {
  return (
    <AppShell title="Repair Expenditure">
      <ExpenditureSectionPage type="repair" title="Repair Expenditure" barColor="#10b981" />
    </AppShell>
  );
}
