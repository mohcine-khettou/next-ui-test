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
import { createMacroGoal } from "../actions/goals";
import { Plus } from "lucide-react";

const GOAL_ICONS = ["🎯", "💻", "📚", "🏋️", "🎨", "🚀", "⚡", "🔥"];

export default function CreateMacroGoalDialog() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "percentage" as "percentage" | "hours",
    totalHours: 10,
    icon: "🎯",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createMacroGoal({
        name: formData.name,
        description: formData.description,
        type: formData.type,
        totalHours: formData.type === "hours" ? formData.totalHours : undefined,
        icon: formData.icon,
      });

      if (result) {
        setFormData({
          name: "",
          description: "",
          type: "percentage",
          totalHours: 10,
          icon: "🎯",
        });
        onOpenChange();
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg"
      >
        <Plus className="h-4 w-4" />
        New Macro Goal
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
                  Create New Macro Goal
                </h2>
                <p className="text-sm text-purple-200/70 font-normal">
                  Add a new major goal to track your 2026 progress
                </p>
              </ModalHeader>

              <ModalBody className="space-y-4">
                <Input
                  label="Goal Name"
                  placeholder="e.g., TypeScript Course"
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

                <Input
                  label="Description"
                  placeholder="What do you want to achieve?"
                  value={formData.description}
                  onValueChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                  classNames={{
                    label: "text-white font-medium",
                    input: "text-white placeholder:text-white/50",
                    inputWrapper:
                      "bg-white/10 border border-white/20 hover:bg-white/15 group-data-[focus=true]:bg-white/15",
                  }}
                />

                <Select
                  label="Tracking Type"
                  selectedKeys={[formData.type]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "percentage" | "hours",
                    })
                  }
                  classNames={{
                    label: "text-white font-medium",
                    trigger:
                      "bg-white/10 border border-white/20 hover:bg-white/15 data-[hover=true]:bg-white/15",
                    value: "text-white",
                    popoverContent: "bg-gray-900 border border-white/20",
                  }}
                >
                  <SelectItem
                    key="percentage"
                    // value="percentage"
                    className="text-white"
                  >
                    Percentage-based
                  </SelectItem>
                  <SelectItem
                    key="hours"
                    //   value="hours"
                    className="text-white"
                  >
                    Hours-based
                  </SelectItem>
                </Select>

                {formData.type === "hours" && (
                  <Input
                    type="number"
                    label="Total Hours"
                    min={1}
                    value={formData.totalHours.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        totalHours: Number.parseInt(value) || 10,
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

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {GOAL_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`p-3 rounded-lg text-2xl transition-all duration-200 ${
                          formData.icon === icon
                            ? "bg-gradient-to-br from-purple-500 to-pink-500 scale-110 shadow-lg shadow-purple-500/50"
                            : "bg-white/10 hover:bg-white/20 border border-white/20"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
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
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg"
                >
                  {loading ? "Creating..." : "Create Goal"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
