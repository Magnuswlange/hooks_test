import Button from "@/components/Button";
import AddTodoForm from "@/features/todos/components/AddTodoForm";
import SearchTodos from "@/features/todos/components/SearchTodos";
import TodoList from "@/features/todos/components/TodoList";
import { useTodos } from "@/features/todos/hooks/useTodos";
import { getSystemTheme, setDocumentTheme, type Theme } from "@/utils/theme";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [theme, setTheme] = useState<Theme>(getSystemTheme);
  const { query, setQuery, filteredTodos, addTodo, toggleTodo, removeTodo } =
    useTodos();

  console.log("Rendering");

  useEffect(() => {
    setDocumentTheme(theme);
  }, [theme]);

  return (
    <div className="p-4 bg-surface text-primary-foreground flex flex-col gap-4 shadow">
      <Button
        onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      >
        Change Theme
      </Button>
      <h1 className="text-center text-4xl font-semibold p-4">To-Do List</h1>

      <AddTodoForm onSubmitTodo={addTodo} />
      <SearchTodos query={query} onQueryChange={setQuery} />

      <h2 className="font-semibold text-2xl">Filtered:</h2>
      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={removeTodo}
      />
    </div>
  );
}
