"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardBody, CardHeader } from "@heroui/react";
import type { MacroGoal, MicroGoal } from "../types/goals";

interface DashboardOverviewProps {
  macroGoals: MacroGoal[];
  microGoals: MicroGoal[];
}

function calculateCompletion(
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

export default function DashboardOverview({
  macroGoals,
  microGoals,
}: DashboardOverviewProps) {
  // Prepare data for charts
  const goalProgressData = macroGoals.map((goal) => ({
    name: goal.name,
    completion: Math.round(
      calculateCompletion(goal.id, macroGoals, microGoals)
    ),
    icon: goal.icon,
  }));

  const goalStatusData = [
    {
      name: "Completed",
      value: macroGoals.filter(
        (g) => calculateCompletion(g.id, macroGoals, microGoals) === 100
      ).length,
      color: "#a78bfa",
    },
    {
      name: "In Progress",
      value: macroGoals.filter((g) => {
        const c = calculateCompletion(g.id, macroGoals, microGoals);
        return c > 0 && c < 100;
      }).length,
      color: "#ec4899",
    },
    {
      name: "Not Started",
      value: macroGoals.filter(
        (g) => calculateCompletion(g.id, macroGoals, microGoals) === 0
      ).length,
      color: "#6b7280",
    },
  ];

  const goalTypeData = [
    {
      name: "Percentage-based",
      value: macroGoals.filter((g) => g.type === "percentage").length,
      color: "#8b5cf6",
    },
    {
      name: "Hours-based",
      value: macroGoals.filter((g) => g.type === "hours").length,
      color: "#f59e0b",
    },
  ];

  const microGoalStats = {
    total: microGoals.length,
    completed: microGoals.filter((m) => m.completion === 100 || m.hours > 0)
      .length,
    avgCompletion:
      microGoals.length > 0
        ? Math.round(
            microGoals.reduce((sum, m) => sum + m.completion, 0) /
              microGoals.length
          )
        : 0,
  };

  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="backdrop-blur-md bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30"
          shadow="lg"
        >
          <CardBody className="p-4">
            <p className="text-sm text-purple-200/70 mb-1">Total Goals</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {macroGoals.length}
            </p>
          </CardBody>
        </Card>

        <Card
          className="backdrop-blur-md bg-gradient-to-br from-green-900/40 to-emerald-800/20 border border-green-500/30"
          shadow="lg"
        >
          <CardBody className="p-4">
            <p className="text-sm text-green-200/70 mb-1">Completed</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              {goalStatusData[0].value}
            </p>
          </CardBody>
        </Card>

        <Card
          className="backdrop-blur-md bg-gradient-to-br from-blue-900/40 to-cyan-800/20 border border-blue-500/30"
          shadow="lg"
        >
          <CardBody className="p-4">
            <p className="text-sm text-blue-200/70 mb-1">Micro Goals</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              {microGoalStats.total}
            </p>
          </CardBody>
        </Card>

        <Card
          className="backdrop-blur-md bg-gradient-to-br from-yellow-900/40 to-orange-800/20 border border-yellow-500/30"
          shadow="lg"
        >
          <CardBody className="p-4">
            <p className="text-sm text-yellow-200/70 mb-1">Avg Progress</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              {microGoalStats.avgCompletion}%
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal Progress Bar Chart */}
        <Card
          className="backdrop-blur-md bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-purple-500/20"
          shadow="lg"
        >
          <CardHeader className="pb-2">
            <h3 className="text-lg font-bold text-white">Goal Progress</h3>
          </CardHeader>
          <CardBody className="pt-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={goalProgressData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.5)"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar
                  dataKey="completion"
                  fill="#a78bfa"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Goal Status Pie Chart */}
        <Card
          className="backdrop-blur-md bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-pink-500/20"
          shadow="lg"
        >
          <CardHeader className="pb-2">
            <h3 className="text-lg font-bold text-white">Goal Status</h3>
          </CardHeader>
          <CardBody className="pt-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={goalStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {goalStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Goal Type Distribution */}
        <Card
          className="backdrop-blur-md bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-indigo-500/20"
          shadow="lg"
        >
          <CardHeader className="pb-2">
            <h3 className="text-lg font-bold text-white">Goal Types</h3>
          </CardHeader>
          <CardBody className="pt-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={goalTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {goalTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Micro Goals Stats */}
        <Card
          className="backdrop-blur-md bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-blue-500/20"
          shadow="lg"
        >
          <CardHeader className="pb-2">
            <h3 className="text-lg font-bold text-white">
              Micro Goals Overview
            </h3>
          </CardHeader>
          <CardBody className="pt-2">
            <div className="space-y-4">
              <div
                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30"
                style={{ boxShadow: "0 4px 15px rgba(168, 85, 247, 0.1)" }}
              >
                <span className="text-purple-200/70">Total Micro Goals</span>
                <span className="text-2xl font-bold text-purple-300">
                  {microGoalStats.total}
                </span>
              </div>
              <div
                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-pink-900/30 to-pink-800/20 border border-pink-500/30"
                style={{ boxShadow: "0 4px 15px rgba(236, 72, 153, 0.1)" }}
              >
                <span className="text-pink-200/70">Active Tasks</span>
                <span className="text-2xl font-bold text-pink-300">
                  {microGoalStats.completed}
                </span>
              </div>
              <div
                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30"
                style={{ boxShadow: "0 4px 15px rgba(59, 130, 246, 0.1)" }}
              >
                <span className="text-blue-200/70">Average Progress</span>
                <span className="text-2xl font-bold text-blue-300">
                  {microGoalStats.avgCompletion}%
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
