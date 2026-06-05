"use client";
import { useState } from "react";
import { Task } from "@/lib/types";
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ClipboardList,
} from "lucide-react";

interface Props {
  tasks: Task[];
  onToggle: (id: string, completed: boolean) => void;
  onAdd: (title: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

export function TaskPanel({ tasks, onToggle, onAdd, onDelete, onEdit }: Props) {
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const t = newTask.trim();
    if (t) {
      onAdd(t);
      setNewTask("");
    }
  }

  function startEdit(task: Task) {
    setEditingId(task.id);
    setEditValue(task.title);
  }

  function saveEdit(id: string) {
    if (editValue.trim()) onEdit(id, editValue.trim());
    setEditingId(null);
  }

  const done = tasks.filter((t) => t.completed).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-slate-500" />
            <h2 className="font-bold text-slate-800">Family Tasks</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {done}/{tasks.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Task list */}
      <div className="px-4 py-3 space-y-1 max-h-72 overflow-y-auto scrollbar-thin">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-2 group px-2 py-2 rounded-xl hover:bg-slate-50 transition"
          >
            <button
              onClick={() => onToggle(task.id, !task.completed)}
              className="shrink-0 text-slate-300 hover:text-blue-500 transition"
            >
              {task.completed ? (
                <CheckSquare size={18} className="text-blue-500" />
              ) : (
                <Square size={18} />
              )}
            </button>

            {editingId === task.id ? (
              <div className="flex-1 flex gap-1">
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(task.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="flex-1 border border-blue-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  autoFocus
                />
                <button
                  onClick={() => saveEdit(task.id)}
                  className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg transition"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <span
                  className={`flex-1 text-sm ${
                    task.completed
                      ? "line-through text-slate-400"
                      : "text-slate-700"
                  }`}
                >
                  {task.title}
                </span>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(task)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">
            No tasks yet — add one below
          </p>
        )}
      </div>

      {/* Add task */}
      <div className="px-4 py-3 border-t border-slate-100">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a family task…"
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl transition shrink-0"
          >
            <Plus size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
