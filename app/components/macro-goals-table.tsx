"use client";

import type { MacroGoal, MicroGoal } from "../types/goals";
import { Card, CardBody, Progress, Chip } from "@heroui/react";

interface MacroGoalsTableProps {
  macroGoals: MacroGoal[];
  microGoals: MicroGoal[];
  calculateCompletion: (macroId: string) => number;
}

export default function MacroGoalsTable({
  macroGoals,
  microGoals,
  calculateCompletion,
}: MacroGoalsTableProps) {
  return (
    <div className="space-y-4">
      {macroGoals.map((goal) => {
        const completion = calculateCompletion(goal.id);
        const relatedMicro = microGoals.filter(
          (m) => m.macroGoalId === goal.id
        );

        return (
          <Card
            key={goal.id}
            className="backdrop-blur-md bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-white/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
            shadow="lg"
          >
            <CardBody className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{goal.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {goal.name}
                      </h3>
                      <p className="text-sm text-purple-200/60">
                        {goal.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-200/70">
                        Progress
                      </span>
                      <span className="text-sm font-semibold text-purple-300">
                        {completion.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={completion}
                      color="secondary"
                      classNames={{
                        base: "max-w-full",
                        track: "bg-white/10",
                        indicator:
                          "bg-gradient-to-r from-purple-500 to-pink-500",
                      }}
                      size="sm"
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {relatedMicro.map((micro) => (
                      <Chip
                        key={micro.id}
                        variant="flat"
                        size="sm"
                        classNames={{
                          base: "bg-purple-500/20 border border-purple-500/30",
                          content: "text-purple-200 text-xs",
                        }}
                      >
                        {micro.name}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {completion.toFixed(0)}%
                  </div>
                  <p className="text-xs text-purple-200/50 mt-1">
                    {relatedMicro.length} tasks
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
