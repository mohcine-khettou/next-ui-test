import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMicroGoal extends Document {
  _id: string;
  macroGoalId: string;
  name: string;
  completion: number;
  hours: number;
  createdAt: Date;
  updatedAt: Date;
}

const MicroGoalSchema: Schema<IMicroGoal> = new Schema(
  {
    macroGoalId: {
      type: String,
      required: [true, "Please provide a macro goal ID"],
      ref: "MacroGoal",
    },
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    completion: {
      type: Number,
      default: 0,
      min: [0, "Completion cannot be less than 0"],
      max: [100, "Completion cannot be more than 100"],
    },
    hours: {
      type: Number,
      default: 0,
      min: [0, "Hours cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
MicroGoalSchema.index({ macroGoalId: 1 });

const MicroGoal: Model<IMicroGoal> =
  mongoose.models.MicroGoal ||
  mongoose.model<IMicroGoal>("MicroGoal", MicroGoalSchema);

export default MicroGoal;
