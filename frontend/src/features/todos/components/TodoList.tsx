import type { Todo } from "../types/todos.types";
import TodoItem from "./TodoItem";

type Props = {
  todos: Todo[];
  onToggle: (id: number, isChecked: boolean) => void;
  onDelete: (id: number) => void;
};

export default function TodoList({ todos, onToggle, onDelete }: Props) {
  if (todos.length === 0) return <p>No to-dos</p>;

  return (
    <ul className="flex flex-col gap-3 pl-2 pb-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
