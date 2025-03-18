"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

interface TaskCatogoryCardProps {
  id: string;
  name: string;
  createdAt: string;
}
const TaskCatogoryCard = (props: TaskCatogoryCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(props.name);
  const [editedName, setEditedName] = useState(name);

  const handleSave = () => {
    setName(editedName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(name);
    setIsEditing(false);
  };
  return (
    <Card className="bg-[#D5E5D5]">
      <CardContent className="pt-6">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              defaultValue={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-3 py-1 border rounded bg-white"
            />
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                className="flex-1 bg-[#ADB2D4] hover:bg-[#C7D9DD]"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-2">{name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{`Created: ${new Date(props.createdAt).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                )}`}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-red-500 hover:text-red-700"
                onClick={() => {}}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCatogoryCard;
