"use server";

import connectDB from "../lib/mongoose";
import MacroGoal from "../models/MacroGoal";
import MicroGoal from "../models/MicroGoal";
import type {
  MacroGoal as MacroGoalType,
  MicroGoal as MicroGoalType,
} from "../types/goals";

// Macro Goals Actions
export async function getMacroGoals(): Promise<MacroGoalType[]> {
  try {
    await connectDB();
    const goals = await MacroGoal.find({}).sort({ createdAt: -1 }).lean();

    return goals.map((goal: any) => ({
      id: goal._id.toString(),
      name: goal.name,
      description: goal.description,
      type: goal.type,
      totalHours: goal.totalHours,
      icon: goal.icon,
    }));
  } catch (err) {
    console.error("[v0] Exception fetching macro goals:", err);
    return [];
  }
}

export async function createMacroGoal(
  goal: Omit<MacroGoalType, "id">
): Promise<MacroGoalType | null> {
  try {
    await connectDB();

    const newGoal = await MacroGoal.create({
      name: goal.name,
      description: goal.description || "",
      type: goal.type,
      totalHours: goal.type === "hours" ? goal.totalHours : null,
      icon: goal.icon,
    });

    return {
      id: newGoal._id.toString(),
      name: newGoal.name,
      description: newGoal.description,
      type: newGoal.type,
      totalHours: newGoal.totalHours,
      icon: newGoal.icon,
    };
  } catch (err) {
    console.error("[v0] Exception creating macro goal:", err);
    return null;
  }
}

export async function updateMacroGoal(
  id: string,
  goal: Partial<MacroGoalType>
): Promise<MacroGoalType | null> {
  try {
    await connectDB();

    const updateData: any = {};
    if (goal.name !== undefined) updateData.name = goal.name;
    if (goal.description !== undefined)
      updateData.description = goal.description;
    if (goal.type !== undefined) updateData.type = goal.type;
    if (goal.totalHours !== undefined) updateData.totalHours = goal.totalHours;
    if (goal.icon !== undefined) updateData.icon = goal.icon;

    const updatedGoal = await MacroGoal.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedGoal) {
      console.error("[v0] Macro goal not found:", id);
      return null;
    }

    return {
      id: updatedGoal._id.toString(),
      name: updatedGoal.name,
      description: updatedGoal.description,
      type: updatedGoal.type,
      totalHours: updatedGoal.totalHours,
      icon: updatedGoal.icon,
    };
  } catch (err) {
    console.error("[v0] Exception updating macro goal:", err);
    return null;
  }
}

export async function deleteMacroGoal(id: string): Promise<boolean> {
  try {
    await connectDB();

    // Delete associated micro goals first
    await MicroGoal.deleteMany({ macroGoalId: id });

    // Delete macro goal
    const result = await MacroGoal.findByIdAndDelete(id);

    if (!result) {
      console.error("[v0] Macro goal not found:", id);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[v0] Exception deleting macro goal:", err);
    return false;
  }
}

// Micro Goals Actions
export async function getMicroGoals(): Promise<MicroGoalType[]> {
  try {
    await connectDB();
    const goals = await MicroGoal.find({}).sort({ createdAt: -1 }).lean();

    return goals.map((goal: any) => ({
      id: goal._id.toString(),
      macroGoalId: goal.macroGoalId,
      name: goal.name,
      completion: goal.completion,
      hours: goal.hours,
    }));
  } catch (err) {
    console.error("[v0] Exception fetching micro goals:", err);
    return [];
  }
}

export async function createMicroGoal(
  goal: Omit<MicroGoalType, "id">
): Promise<MicroGoalType | null> {
  try {
    await connectDB();

    const newGoal = await MicroGoal.create({
      macroGoalId: goal.macroGoalId,
      name: goal.name,
      completion: goal.completion || 0,
      hours: goal.hours || 0,
    });

    return {
      id: newGoal._id.toString(),
      macroGoalId: newGoal.macroGoalId,
      name: newGoal.name,
      completion: newGoal.completion,
      hours: newGoal.hours,
    };
  } catch (err) {
    console.error("[v0] Exception creating micro goal:", err);
    return null;
  }
}

export async function updateMicroGoal(
  id: string,
  goal: Partial<MicroGoalType>
): Promise<MicroGoalType | null> {
  try {
    await connectDB();

    const updateData: any = {};
    if (goal.name !== undefined) updateData.name = goal.name;
    if (goal.completion !== undefined) updateData.completion = goal.completion;
    if (goal.hours !== undefined) updateData.hours = goal.hours;

    const updatedGoal = await MicroGoal.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedGoal) {
      console.error("[v0] Micro goal not found:", id);
      return null;
    }

    return {
      id: updatedGoal._id.toString(),
      macroGoalId: updatedGoal.macroGoalId,
      name: updatedGoal.name,
      completion: updatedGoal.completion,
      hours: updatedGoal.hours,
    };
  } catch (err) {
    console.error("[v0] Exception updating micro goal:", err);
    return null;
  }
}

export async function deleteMicroGoal(id: string): Promise<boolean> {
  try {
    await connectDB();

    const result = await MicroGoal.findByIdAndDelete(id);

    if (!result) {
      console.error("[v0] Micro goal not found:", id);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[v0] Exception deleting micro goal:", err);
    return false;
  }
}
