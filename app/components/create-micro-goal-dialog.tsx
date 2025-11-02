"use client";

import type React from "react";
import { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { createMicroGoal } from "../actions/goals";
import { Plus } from "lucide-react";
import type { MacroGoal } from "../types/goals";

interface CreateMicroGoalDialogProps {
  macroGoals: MacroGoal[];
}

export default function CreateMicroGoalDialog({
  macroGoals,
}: CreateMicroGoalDialogProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    macroGoalId: macroGoals[0]?.id || "",
    name: "",
    completion: 0,
    hours: 1,
  });

  const selectedMacro = macroGoals.find((g) => g.id === formData.macroGoalId);
  const isHoursBased = selectedMacro?.type === "hours";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createMicroGoal({
        macroGoalId: formData.macroGoalId,
        name: formData.name,
        completion: isHoursBased ? 0 : formData.completion,
        hours: isHoursBased ? formData.hours : 0,
      });

      if (result) {
        setFormData({
          macroGoalId: macroGoals[0]?.id || "",
          name: "",
          completion: 0,
          hours: 1,
        });
        onOpenChange();
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  if (macroGoals.length === 0) {
    return (
      <Button isDisabled className="gap-2 opacity-50 bg-blue-500/30 text-white">
        <Plus className="h-4 w-4" />
        Create Macro Goal First
      </Button>
    );
  }

  return (
    <>
      <Button
        onPress={onOpen}
        className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg"
      >
        <Plus className="h-4 w-4" />
        New Micro Goal
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        classNames={{
          backdrop: "bg-black/50 backdrop-blur-md",
          base: "border border-white/20 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl shadow-2xl",
          header: "border-b border-white/10",
          body: "py-6",
          footer: "border-t border-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-white">
                  Create New Micro Goal
                </h2>
                <p className="text-sm text-purple-200/70 font-normal">
                  Break down your macro goal into smaller, actionable tasks
                </p>
              </ModalHeader>

              <ModalBody className="space-y-4">
                <Select
                  label="Macro Goal"
                  selectedKeys={[formData.macroGoalId]}
                  onChange={(e) =>
                    setFormData({ ...formData, macroGoalId: e.target.value })
                  }
                  classNames={{
                    label: "text-white font-medium",
                    trigger:
                      "bg-white/10 border border-white/20 hover:bg-white/15 data-[hover=true]:bg-white/15",
                    value: "text-white",
                    popoverContent: "bg-gray-900 border border-white/20",
                  }}
                >
                  {macroGoals.map((goal) => (
                    <SelectItem
                      key={goal.id}
                      //   value={goal.id}
                      className="text-white"
                      startContent={<span>{goal.icon}</span>}
                    >
                      {goal.name}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Task Name"
                  placeholder="e.g., Learn TypeScript basics"
                  value={formData.name}
                  onValueChange={(value) =>
                    setFormData({ ...formData, name: value })
                  }
                  isRequired
                  classNames={{
                    label: "text-white font-medium",
                    input: "text-white placeholder:text-white/50",
                    inputWrapper:
                      "bg-white/10 border border-white/20 hover:bg-white/15 group-data-[focus=true]:bg-white/15",
                  }}
                />

                {isHoursBased ? (
                  <Input
                    type="number"
                    label="Hours Required"
                    min={0.5}
                    step={0.5}
                    value={formData.hours.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        hours: Number.parseFloat(value) || 1,
                      })
                    }
                    classNames={{
                      label: "text-white font-medium",
                      input: "text-white",
                      inputWrapper:
                        "bg-white/10 border border-white/20 hover:bg-white/15 group-data-[focus=true]:bg-white/15",
                    }}
                  />
                ) : (
                  <Input
                    type="number"
                    label="Initial Completion %"
                    min={0}
                    max={100}
                    value={formData.completion.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        completion: Number.parseInt(value) || 0,
                      })
                    }
                    classNames={{
                      label: "text-white font-medium",
                      input: "text-white",
                      inputWrapper:
                        "bg-white/10 border border-white/20 hover:bg-white/15 group-data-[focus=true]:bg-white/15",
                    }}
                  />
                )}
              </ModalBody>

              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={onClose}
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isDisabled={loading || !formData.name}
                  isLoading={loading}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg"
                >
                  {loading ? "Creating..." : "Create Task"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
