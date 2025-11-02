import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMacroGoal extends Document {
  _id: string;
  name: string;
  description?: string;
  type: "percentage" | "hours";
  totalHours?: number;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MacroGoalSchema: Schema<IMacroGoal> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      required: [true, "Please provide a type"],
      enum: ["percentage", "hours"],
    },
    totalHours: {
      type: Number,
      default: null,
    },
    icon: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const MacroGoal: Model<IMacroGoal> =
  mongoose.models.MacroGoal ||
  mongoose.model<IMacroGoal>("MacroGoal", MacroGoalSchema);

export default MacroGoal;
