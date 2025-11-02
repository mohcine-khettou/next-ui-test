"use client";

import { useState, useMemo } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardBody, CardHeader, Button, ButtonGroup } from "@heroui/react";
import type { MacroGoal, MicroGoal } from "../types/goals";

interface Streak {
  goalId: string;
  currentStreak: number;
  longestStreak: number;
  lastUpdated: string;
}

interface ProgressTrackerProps {
  macroGoals: MacroGoal[];
  microGoals: MicroGoal[];
  calculateCompletion: (macroId: string) => number;
}

export default function ProgressTracker({
  macroGoals,
  microGoals,
  calculateCompletion,
}: ProgressTrackerProps) {
  const [selectedGoal, setSelectedGoal] = useState<string>(
    macroGoals[0]?.id || ""
  );
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");

  // Generate mock progress data
  const generateProgressData = () => {
    const data = [];
    const today = new Date();

    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Simulate progress with some randomness
      const baseProgress = (i / 30) * 100;
      const variance = Math.sin(i / 5) * 15;
      const progress = Math.max(
        0,
        Math.min(100, baseProgress + variance + Math.random() * 10)
      );

      data.push({
        date: dateStr,
        progress: Math.round(progress),
        fullDate: date.toISOString().split("T")[0],
      });
    }

    return data;
  };

  const progressData = useMemo(() => generateProgressData(), []);

  const getStreakData = (): Streak => {
    // Mock streak data
    return {
      goalId: selectedGoal,
      currentStreak: 12,
      longestStreak: 28,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
  };

  const getMilestones = () => {
    return [
      { name: "25% Complete", value: 25, achieved: true, date: "Jan 15" },
      { name: "50% Complete", value: 50, achieved: true, date: "Feb 1" },
      { name: "75% Complete", value: 75, achieved: false, date: null },
      { name: "100% Complete", value: 100, achieved: false, date: null },
    ];
  };

  const streak = getStreakData();
  const milestones = getMilestones();
  const selectedGoalData = macroGoals.find((g) => g.id === selectedGoal);
  const currentCompletion = selectedGoalData
    ? calculateCompletion(selectedGoal)
    : 0;

  return (
    <div className="space-y-6">
      {/* Goal Selection */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {macroGoals.map((goal) => (
          <Button
            key={goal.id}
            onPress={() => setSelectedGoal(goal.id)}
            className={`whitespace-nowrap ${
              selectedGoal === goal.id
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
                : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
            }`}
          >
            {goal.icon} {goal.name}
          </Button>
        ))}
      </div>

      {/* Time Range Selection */}
      <ButtonGroup>
        {(["week", "month", "all"] as const).map((range) => (
          <Button
            key={range}
            onPress={() => setTimeRange(range)}
            size="sm"
            className={
              timeRange === range
                ? "bg-purple-500 hover:bg-purple-600 text-white"
                : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
            }
          >
            {range === "week"
              ? "Week"
              : range === "month"
              ? "Month"
              : "All Time"}
          </Button>
        ))}
      </ButtonGroup>

      {/* Progress Chart */}
      <Card
        className="backdrop-blur-md bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-purple-500/20"
        shadow="lg"
      >
        <CardHeader className="pb-2">
          <h3 className="text-lg font-bold text-white">Progress Over Time</h3>
        </CardHeader>
        <CardBody className="pt-2">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="progress"
                stroke="#a78bfa"
                fillOpacity={1}
                fill="url(#colorProgress)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Progress */}
        <Card
          className="backdrop-blur-md bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30"
          shadow="lg"
        >
          <CardBody className="p-6">
            <p className="text-sm text-purple-200/70 mb-2">Current Progress</p>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {currentCompletion.toFixed(1)}%
            </div>
            <p className="text-xs text-purple-200/50 mt-2">Updated today</p>
          </CardBody>
        </Card>

        {/* Current Streak */}
        <Card
          className="backdrop-blur-md bg-gradient-to-br from-orange-900/40 to-red-800/20 border border-orange-500/30"
          shadow="lg"
        >
          <CardBody className="p-6">
            <p className="text-sm text-orange-200/70 mb-2">Current Streak</p>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              {streak.currentStreak}
            </div>
            <p className="text-xs text-orange-200/50 mt-2">days in a row</p>
          </CardBody>
        </Card>

        {/* Longest Streak */}
        <Card
          className="backdrop-blur-md bg-gradient-to-br from-yellow-900/40 to-orange-800/20 border border-yellow-500/30"
          shadow="lg"
        >
          <CardBody className="p-6">
            <p className="text-sm text-yellow-200/70 mb-2">Longest Streak</p>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              {streak.longestStreak}
            </div>
            <p className="text-xs text-yellow-200/50 mt-2">personal best</p>
          </CardBody>
        </Card>
      </div>

      {/* Milestones */}
      <Card
        className="backdrop-blur-md bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-green-500/20"
        shadow="lg"
      >
        <CardHeader className="pb-2">
          <h3 className="text-lg font-bold text-white">Milestones</h3>
        </CardHeader>
        <CardBody className="pt-2">
          <div className="space-y-3">
            {milestones.map((milestone, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  milestone.achieved
                    ? "bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/40"
                    : "bg-white/5 border-white/10"
                }`}
                style={
                  milestone.achieved
                    ? { boxShadow: "0 4px 15px rgba(34, 197, 94, 0.1)" }
                    : {}
                }
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      milestone.achieved
                        ? "bg-green-500/30 border-2 border-green-500/70 text-green-300"
                        : "bg-white/10 border-2 border-white/30 text-white"
                    }`}
                  >
                    {milestone.achieved ? "✓" : milestone.value}
                  </div>
                  <div>
                    <p
                      className={
                        milestone.achieved ? "text-white" : "text-white"
                      }
                    >
                      {milestone.name}
                    </p>
                    {milestone.achieved && (
                      <p className="text-xs text-green-400/70">
                        Achieved on {milestone.date}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-purple-300">
                    {milestone.value}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Weekly Breakdown */}
      <Card
        className="backdrop-blur-md bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-blue-500/20"
        shadow="lg"
      >
        <CardHeader className="pb-2">
          <h3 className="text-lg font-bold text-white">Weekly Breakdown</h3>
        </CardHeader>
        <CardBody className="pt-2">
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, idx) => {
                const activity = Math.floor(Math.random() * 100);
                const intensity =
                  activity > 75
                    ? "bg-green-500"
                    : activity > 50
                    ? "bg-blue-500"
                    : activity > 25
                    ? "bg-yellow-500"
                    : "bg-gray-500";

                return (
                  <div key={day} className="text-center">
                    <p className="text-xs text-purple-200/70 mb-2">{day}</p>
                    <div
                      className={`h-12 rounded-lg ${intensity} opacity-60 hover:opacity-100 transition-opacity cursor-pointer`}
                    />
                    <p className="text-xs text-purple-200/50 mt-1">
                      {activity}%
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
