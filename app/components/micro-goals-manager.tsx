"use client";

import { useState } from "react";
import type { MacroGoal, MicroGoal } from "../types/goals";
import { Card, Button, Input, Progress, Checkbox } from "@heroui/react";
import {
  updateMicroGoal,
  createMicroGoal,
  deleteMicroGoal,
} from "../actions/goals";
import { useRouter } from "next/navigation";

interface MicroGoalsManagerProps {
  macroGoals: MacroGoal[];
  microGoals: MicroGoal[];
  calculateMacroCompletion: (macroId: string) => number;
}

export default function MicroGoalsManager({
  macroGoals,
  microGoals,
  calculateMacroCompletion,
}: MicroGoalsManagerProps) {
  const [newGoalName, setNewGoalName] = useState<{ [key: string]: string }>({});
  const [expandedMacro, setExpandedMacro] = useState<string | null>(
    macroGoals[0]?.id || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getSortedMicroGoals = (macroId: string) => {
    return microGoals
      .filter((m) => m.macroGoalId === macroId)
      .sort((a, b) => {
        const aComplete = a.completion === 100;
        const bComplete = b.completion === 100;
        if (aComplete !== bComplete) return aComplete ? 1 : -1;
        return 0;
      });
  };

  const handleUpdateMicroGoal = async (goal: MicroGoal) => {
    setIsLoading(true);
    try {
      await updateMicroGoal(goal.id, goal);
      router.refresh();
    } catch (error) {
      console.error("Error updating micro goal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMicroGoal = async (macroGoalId: string, name: string) => {
    setIsLoading(true);
    try {
      await createMicroGoal({
        macroGoalId,
        name,
        completion: 0,
        hours: 0,
      });
      setNewGoalName((prev) => ({
        ...prev,
        [macroGoalId]: "",
      }));
      router.refresh();
    } catch (error) {
      console.error("Error adding micro goal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMicroGoal = async (goalId: string) => {
    setIsLoading(true);
    try {
      await deleteMicroGoal(goalId);
      router.refresh();
    } catch (error) {
      console.error("Error deleting micro goal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {macroGoals.map((macro) => {
        const relatedMicro = getSortedMicroGoals(macro.id);
        const completion = calculateMacroCompletion(macro.id);
        const isExpanded = expandedMacro === macro.id;

        return (
          <Card
            key={macro.id}
            className="backdrop-blur-md bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-white/20 overflow-hidden"
            shadow="lg"
          >
            <button
              onClick={() => setExpandedMacro(isExpanded ? null : macro.id)}
              className="w-full p-6 hover:bg-white/10 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{macro.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {macro.name}
                    </h3>
                    <p className="text-sm text-purple-200/60">
                      {relatedMicro.length} tasks
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {completion.toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-purple-300">
                    {isExpanded ? "▼" : "▶"}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-purple-200/70">
                  Macro Progress
                </span>
                <span className="text-xs font-semibold text-purple-300">
                  {completion.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={completion}
                color="secondary"
                classNames={{
                  base: "max-w-full mt-2",
                  track: "bg-white/10",
                  indicator: "bg-gradient-to-r from-purple-500 to-pink-500",
                }}
                size="sm"
              />
            </button>

            {isExpanded && (
              <div className="border-t border-white/10 p-6 space-y-4">
                {relatedMicro.length > 0 ? (
                  <div className="space-y-3">
                    {relatedMicro.map((micro) => {
                      const isComplete = micro.completion === 100;
                      const progressPercent =
                        macro.type === "hours"
                          ? (micro.hours / (macro.totalHours || 1)) * 100
                          : micro.completion;

                      return (
                        <div
                          key={micro.id}
                          className={`p-4 rounded-lg border transition-all ${
                            isComplete
                              ? "bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/40"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                          style={
                            isComplete
                              ? {
                                  boxShadow:
                                    "0 4px 15px rgba(34, 197, 94, 0.1)",
                                }
                              : {}
                          }
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  isSelected={isComplete}
                                  onValueChange={(checked) => {
                                    if (macro.type === "hours") {
                                      handleUpdateMicroGoal({
                                        ...micro,
                                        hours: checked
                                          ? macro.totalHours || 0
                                          : 0,
                                      });
                                    } else {
                                      handleUpdateMicroGoal({
                                        ...micro,
                                        completion: checked ? 100 : 0,
                                      });
                                    }
                                  }}
                                  isDisabled={isLoading}
                                  classNames={{
                                    base: "m-0",
                                    wrapper: "after:bg-purple-500",
                                  }}
                                />
                                <span
                                  className={`font-medium ${
                                    isComplete
                                      ? "line-through text-purple-200/50"
                                      : "text-white"
                                  }`}
                                >
                                  {micro.name}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteMicroGoal(micro.id)}
                              disabled={isLoading}
                              className="text-red-400/60 hover:text-red-400 transition-colors text-sm disabled:opacity-50"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="flex items-center justify-between gap-3 mb-2">
                            <span className="text-xs text-purple-200/70">
                              Progress
                            </span>
                            {macro.type === "hours" ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  max={macro.totalHours}
                                  step="0.5"
                                  value={micro.hours}
                                  onChange={(e) =>
                                    handleUpdateMicroGoal({
                                      ...micro,
                                      hours: Math.min(
                                        Number.parseFloat(e.target.value) || 0,
                                        macro.totalHours || 0
                                      ),
                                    })
                                  }
                                  disabled={isLoading}
                                  className="w-16 px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-sm disabled:opacity-50"
                                />
                                <span className="text-xs text-purple-200/60">
                                  / {macro.totalHours}h
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="5"
                                  value={micro.completion}
                                  onChange={(e) =>
                                    handleUpdateMicroGoal({
                                      ...micro,
                                      completion: Math.min(
                                        Number.parseFloat(e.target.value) || 0,
                                        100
                                      ),
                                    })
                                  }
                                  disabled={isLoading}
                                  className="w-16 px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-sm disabled:opacity-50"
                                />
                                <span className="text-xs text-purple-200/60">
                                  %
                                </span>
                              </div>
                            )}
                          </div>
                          <Progress
                            value={progressPercent}
                            color="secondary"
                            classNames={{
                              base: "max-w-full",
                              track: "bg-white/10",
                              indicator: isComplete
                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                : "bg-gradient-to-r from-purple-500 to-pink-500",
                            }}
                            size="sm"
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-purple-200/50 py-4">
                    No micro goals yet. Add one below!
                  </p>
                )}

                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <Input
                    placeholder="Add new micro goal..."
                    value={newGoalName[macro.id] || ""}
                    onValueChange={(value) =>
                      setNewGoalName((prev) => ({
                        ...prev,
                        [macro.id]: value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newGoalName[macro.id]) {
                        handleAddMicroGoal(macro.id, newGoalName[macro.id]);
                      }
                    }}
                    isDisabled={isLoading}
                    classNames={{
                      input: "text-white placeholder:text-white/50",
                      inputWrapper:
                        "bg-white/10 border border-white/20 hover:bg-white/15 group-data-[focus=true]:bg-white/15",
                    }}
                  />
                  <Button
                    onPress={() => {
                      if (newGoalName[macro.id]) {
                        handleAddMicroGoal(macro.id, newGoalName[macro.id]);
                      }
                    }}
                    isDisabled={isLoading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
