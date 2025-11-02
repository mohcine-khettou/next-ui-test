"use client";

import { Tab, Tabs } from "@heroui/react";
import React from "react";
import MacroGoalsTable from "./macro-goals-table";
import MicroGoalsManager from "./micro-goals-manager";
import ProgressTracker from "./progress-tracker";
import BadgesShowcase from "./badges-showcase";
import { MacroGoal, MicroGoal } from "../types/goals";

type Props = {
  microGoals: MicroGoal[];
  macroGoals: MacroGoal[];
  overallCompletion: number;
};

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

const GoalsTabs = ({ microGoals, macroGoals, overallCompletion }: Props) => {
  return (
    <Tabs
      aria-label="Goals Tabs"
      variant="underlined"
      color="primary"
      className="backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-lg"
    >
      <Tab key="goals" title="Macro Goals">
        <div className="mt-6">
          <MacroGoalsTable
            macroGoals={macroGoals}
            microGoals={microGoals}
            calculateCompletion={(id: string) =>
              calculateMacroCompletion(id, macroGoals, microGoals)
            }
          />
        </div>
      </Tab>

      <Tab key="micro" title="Micro Goals">
        <div className="mt-6">
          <MicroGoalsManager
            macroGoals={macroGoals}
            microGoals={microGoals}
            calculateMacroCompletion={(id: string) =>
              calculateMacroCompletion(id, macroGoals, microGoals)
            }
          />
        </div>
      </Tab>

      <Tab key="progress" title="Progress Tracking">
        <div className="mt-6">
          <ProgressTracker
            macroGoals={macroGoals}
            microGoals={microGoals}
            calculateCompletion={(id: string) =>
              calculateMacroCompletion(id, macroGoals, microGoals)
            }
          />
        </div>
      </Tab>

      <Tab key="badges" title="Badges & Achievements">
        <div className="mt-6">
          <BadgesShowcase
            macroGoals={macroGoals}
            microGoals={microGoals}
            calculateCompletion={(id: string) =>
              calculateMacroCompletion(id, macroGoals, microGoals)
            }
            overallCompletion={overallCompletion}
          />
        </div>
      </Tab>
    </Tabs>
  );
};

export default GoalsTabs;
