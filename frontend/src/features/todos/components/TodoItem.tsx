import Button from "@/components/Button";
import type { Todo } from "../types/todos.types";
import { Trash2 } from "lucide-react";

type Props = {
  todo: Todo;
  onToggle: (id: number, isChecked: boolean) => void;
  onDelete: (id: number) => void;
};

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center gap-2">
      {/* custom list-disc to make it centered */}
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-foreground shadow" />
      <input
        className="h-4 w-4 cursor-pointer accent-highlight"
        type="checkbox"
        checked={todo.is_checked}
        onChange={(e) => onToggle(todo.id, e.target.checked)}
      ></input>
      {/* add flex-1 to let it grow automatically (fills entire parent element). truncate automatically truncates and adds ellipsis (...). content makes it display the full content on hover. */}
      <span
        className={`flex-1 text-md truncate ${todo.is_checked ? "line-through text-muted-foreground" : ""}`}
        title={todo.content}
      >
        {todo.content}
      </span>
      <Button
        size="xs"
        className="bg-red-500 cursor-pointer shadow"
        type="button"
        onClick={() => onDelete(todo.id)}
      >
        <Trash2 size={20} />
      </Button>
    </li>
  );
}
