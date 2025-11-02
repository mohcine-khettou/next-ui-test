// import {
//   Avatar,
//   Button,
//   Card,
//   CardBody,
//   Checkbox,
//   CheckboxGroup,
//   Radio,
//   RadioGroup,
//   Spinner,
//   Tab,
//   Tabs,
// } from "@heroui/react";
// import HeroUITable from "./HeroUiTable";
// import HeroUiModal from "./Modal";
// import Calendar from "./Calendar";
// import DropdownUi from "./DropdownUi";
// import TabsUi from "./TabsUi";

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <Button> click on me</Button>
//       <Spinner />
//       <HeroUITable />
//       <Calendar />
//       <HeroUiModal />
//       <RadioGroup label="Select your favorite city">
//         <Radio value="buenos-aires">Buenos Aires</Radio>
//         <Radio value="sydney">Sydney</Radio>
//         <Radio value="san-francisco">San Francisco</Radio>
//         <Radio value="london">London</Radio>
//         <Radio value="tokyo">Tokyo</Radio>
//       </RadioGroup>
//       <CheckboxGroup
//         defaultValue={["buenos-aires", "london"]}
//         label="Select cities"
//       >
//         <Checkbox value="buenos-aires">Buenos Aires</Checkbox>
//         <Checkbox value="sydney">Sydney</Checkbox>
//         <Checkbox value="san-francisco">San Francisco</Checkbox>
//         <Checkbox value="london">London</Checkbox>
//         <Checkbox value="tokyo">Tokyo</Checkbox>
//       </CheckboxGroup>
//       <div className="flex items-center gap-4">
//         <DropdownUi />
//       </div>
//       <TabsUi />
//     </main>
//   );
// }

import StatsSection from "./components/stats-section";
import DashboardOverview from "./components/dashboard-overview";

import ThemeToggle from "./components/theme-toggle";
import CreateMacroGoalDialog from "./components/create-macro-goal-dialog";
import CreateMicroGoalDialog from "./components/create-micro-goal-dialog";
import { getMacroGoals, getMicroGoals } from "./actions/goals";
import type { MacroGoal, MicroGoal } from "./types/goals";
import { Tab, Tabs } from "@heroui/react";
import GoalsTabs from "./components/goals-tabs";

function calculateMacroCompletion(
  macroId: string,
  macroGoals: MacroGoal[],
  microGoals: MicroGoal[]
): number {
  const macro = macroGoals.find((g) => g.id === macroId);
  const relatedMicro = microGoals.filter((m) => m.macroGoalId === macroId);

  if (relatedMicro.length === 0) return 0;

  if (macro?.type === "hours") {
    const completedHours = relatedMicro.reduce((sum, m) => sum + m.hours, 0);
    const totalHours = macro.totalHours || 0;
    return totalHours > 0 ? (completedHours / totalHours) * 100 : 0;
  } else {
    const avgCompletion =
      relatedMicro.reduce((sum, m) => sum + m.completion, 0) /
      relatedMicro.length;
    return avgCompletion;
  }
}

export default async function Home() {
  const macroGoals = await getMacroGoals();
  const microGoals = await getMicroGoals();

  const overallCompletion =
    macroGoals.length > 0
      ? macroGoals.reduce(
          (sum, goal) =>
            sum + calculateMacroCompletion(goal.id, macroGoals, microGoals),
          0
        ) / macroGoals.length
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 dark">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                Forging the Warrior&apos;s Path
              </h1>
              <p className="mt-2 text-purple-200/70">
                2026 Goals - Level Up Your Skills
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="text-5xl">⚔️</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <StatsSection overallCompletion={overallCompletion} />

        <div className="mt-8">
          <DashboardOverview macroGoals={macroGoals} microGoals={microGoals} />
        </div>

        <div className="mt-8 flex gap-4">
          <CreateMacroGoalDialog />
          <CreateMicroGoalDialog macroGoals={macroGoals} />
        </div>

        {/* Tabs */}
        <GoalsTabs
          macroGoals={macroGoals}
          microGoals={microGoals}
          overallCompletion={overallCompletion}
        />
      </main>
    </div>
  );
}
