"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import type { MacroGoal, MicroGoal } from "../types/goals";

interface BadgesShowcaseProps {
  macroGoals: MacroGoal[];
  microGoals: MicroGoal[];
  calculateCompletion: (macroId: string) => number;
  overallCompletion: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedDate?: string;
  requirement: string;
}

export default function BadgesShowcase({
  macroGoals,
  microGoals,
  calculateCompletion,
  overallCompletion,
}: BadgesShowcaseProps) {
  const generateBadges = (): Badge[] => {
    const completedGoals = macroGoals.filter(
      (g) => calculateCompletion(g.id) === 100
    ).length;
    const completedMicroGoals = microGoals.filter(
      (m) => m.completion === 100
    ).length;
    const totalMicroGoals = microGoals.length;

    return [
      {
        id: "awakening",
        name: "Awakening",
        description: "Start your journey",
        icon: "🌱",
        color: "from-gray-400 to-gray-500",
        unlocked: overallCompletion >= 0,
        unlockedDate: "Day 1",
        requirement: "0% completion",
      },
      {
        id: "novice",
        name: "Novice Warrior",
        description: "Reach 25% completion",
        icon: "🛡️",
        color: "from-green-400 to-blue-400",
        unlocked: overallCompletion >= 25,
        unlockedDate: overallCompletion >= 25 ? "Today" : undefined,
        requirement: "25% completion",
      },
      {
        id: "skilled",
        name: "Skilled Fighter",
        description: "Reach 50% completion",
        icon: "🗡️",
        color: "from-blue-400 to-purple-400",
        unlocked: overallCompletion >= 50,
        unlockedDate: overallCompletion >= 50 ? "Today" : undefined,
        requirement: "50% completion",
      },
      {
        id: "elite",
        name: "Elite Hunter",
        description: "Reach 75% completion",
        icon: "⭐",
        color: "from-purple-400 to-pink-400",
        unlocked: overallCompletion >= 75,
        unlockedDate: overallCompletion >= 75 ? "Today" : undefined,
        requirement: "75% completion",
      },
      {
        id: "legendary",
        name: "Legendary Warrior",
        description: "Reach 90% completion",
        icon: "👑",
        color: "from-yellow-400 to-orange-400",
        unlocked: overallCompletion >= 90,
        unlockedDate: overallCompletion >= 90 ? "Today" : undefined,
        requirement: "90% completion",
      },
      {
        id: "king",
        name: "King of War",
        description: "Reach 100% completion",
        icon: "⚡",
        color: "from-red-400 to-pink-400",
        unlocked: overallCompletion === 100,
        unlockedDate: overallCompletion === 100 ? "Today" : undefined,
        requirement: "100% completion",
      },
      {
        id: "goal-master",
        name: "Goal Master",
        description: "Complete all macro goals",
        icon: "🎯",
        color: "from-indigo-400 to-purple-400",
        unlocked: completedGoals === macroGoals.length && macroGoals.length > 0,
        unlockedDate:
          completedGoals === macroGoals.length ? "Today" : undefined,
        requirement: `${completedGoals}/${macroGoals.length} goals`,
      },
      {
        id: "task-crusher",
        name: "Task Crusher",
        description: "Complete 10 micro goals",
        icon: "💪",
        color: "from-orange-400 to-red-400",
        unlocked: completedMicroGoals >= 10,
        unlockedDate: completedMicroGoals >= 10 ? "Today" : undefined,
        requirement: `${completedMicroGoals}/10 tasks`,
      },
      {
        id: "consistency",
        name: "Consistency King",
        description: "Maintain a 7-day streak",
        icon: "🔥",
        color: "from-red-400 to-orange-400",
        unlocked: true,
        unlockedDate: "3 days ago",
        requirement: "7-day streak",
      },
      {
        id: "speedrunner",
        name: "Speedrunner",
        description: "Complete a goal in 1 week",
        icon: "⚡",
        color: "from-cyan-400 to-blue-400",
        unlocked: true,
        unlockedDate: "1 week ago",
        requirement: "1 week completion",
      },
    ];
  };

  const badges = generateBadges();
  const unlockedBadges = badges.filter((b) => b.unlocked);
  const lockedBadges = badges.filter((b) => !b.unlocked);

  return (
    <div className="space-y-6">
      {/* Badge Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="backdrop-blur-md bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30"
          shadow="lg"
        >
          <CardBody className="p-6">
            <p className="text-sm text-purple-200/70 mb-2">Badges Unlocked</p>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {unlockedBadges.length}
            </div>
            <p className="text-xs text-purple-200/50 mt-2">
              of {badges.length} total
            </p>
          </CardBody>
        </Card>

        <Card
          className="backdrop-blur-md bg-gradient-to-br from-blue-900/40 to-cyan-800/20 border border-blue-500/30"
          shadow="lg"
        >
          <CardBody className="p-6">
            <p className="text-sm text-blue-200/70 mb-2">Completion Rate</p>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              {((unlockedBadges.length / badges.length) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-blue-200/50 mt-2">
              achievement progress
            </p>
          </CardBody>
        </Card>

        <Card
          className="backdrop-blur-md bg-gradient-to-br from-gray-900/40 to-gray-800/20 border border-gray-500/30"
          shadow="lg"
        >
          <CardBody className="p-6">
            <p className="text-sm text-gray-200/70 mb-2">Next Badge</p>
            <div className="text-2xl font-bold text-white">
              {lockedBadges[0]?.icon || "🏆"}
            </div>
            <p className="text-xs text-gray-200/50 mt-2">
              {lockedBadges[0]?.name || "All badges unlocked!"}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <Card
          className="backdrop-blur-md bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-green-500/30"
          shadow="lg"
        >
          <CardHeader className="pb-2">
            <h3 className="text-lg font-bold text-white">Unlocked Badges</h3>
          </CardHeader>
          <CardBody className="pt-2">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {unlockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-4 rounded-lg bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/40 hover:border-green-400/60 hover:shadow-xl hover:shadow-green-500/20 transition-all cursor-pointer text-center"
                  style={{ boxShadow: "0 4px 20px rgba(34, 197, 94, 0.15)" }}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="text-sm font-semibold text-white">
                    {badge.name}
                  </p>
                  <p className="text-xs text-green-400/70 mt-1">
                    Unlocked {badge.unlockedDate}
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <Card
          className="backdrop-blur-md bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-500/20"
          shadow="lg"
        >
          <CardHeader className="pb-2">
            <h3 className="text-lg font-bold text-white">Locked Badges</h3>
          </CardHeader>
          <CardBody className="pt-2">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {lockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-4 rounded-lg bg-gray-900/40 border border-gray-700/40 opacity-50 text-center"
                  style={{ boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)" }}
                >
                  <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                  <p className="text-sm font-semibold text-white">
                    {badge.name}
                  </p>
                  <p className="text-xs text-purple-200/50 mt-1">
                    {badge.requirement}
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Badge Details */}
      <Card
        className="backdrop-blur-md bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-500/20"
        shadow="lg"
      >
        <CardHeader className="pb-2">
          <h3 className="text-lg font-bold text-white">Badge Details</h3>
        </CardHeader>
        <CardBody className="pt-2">
          <div className="space-y-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border transition-all ${
                  badge.unlocked
                    ? "bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/40 hover:shadow-lg hover:shadow-green-500/20"
                    : "bg-gray-900/40 border-gray-700/30 opacity-60"
                }`}
                style={
                  badge.unlocked
                    ? { boxShadow: "0 4px 15px rgba(34, 197, 94, 0.1)" }
                    : {}
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="font-semibold text-white">{badge.name}</p>
                      <p className="text-sm text-purple-200/70">
                        {badge.description}
                      </p>
                      <p className="text-xs text-purple-200/50 mt-1">
                        Requirement: {badge.requirement}
                      </p>
                    </div>
                  </div>
                  {badge.unlocked && (
                    <div className="text-right">
                      <p className="text-xs text-green-400 font-semibold">
                        Unlocked
                      </p>
                      <p className="text-xs text-green-400/70">
                        {badge.unlockedDate}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
