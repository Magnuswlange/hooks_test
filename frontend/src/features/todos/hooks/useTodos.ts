import {
  startTransition,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
} from "react";
import { postTodo, fetchTodos, patchTodo, deleteTodo } from "../utils/todoApi";
import { optimisticTodoReducer } from "../utils/todoOptimistic";
import type { OptimisticAction, Todo } from "../types/todos.types";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState("");

  const [optimisticTodos, applyOptimisticTodos] = useOptimistic<
    Todo[],
    OptimisticAction
  >(todos, optimisticTodoReducer);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTodos();
        setTodos(data);
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);

  const filteredTodos = useMemo(
    () =>
      optimisticTodos.filter((todo) =>
        todo.content.toLowerCase().includes(query.toLowerCase()),
      ),
    [optimisticTodos, query],
  );

  const toggleTodo = async (id: number, isChecked: boolean) => {
    startTransition(async () => {
      applyOptimisticTodos({ type: "toggle", id, is_checked: isChecked });

      try {
        await patchTodo(id, isChecked);
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, is_checked: isChecked } : t)),
        );
      } catch (e) {
        console.error(e);
      }
    });
  };

  const removeTodo = async (id: number) => {
    startTransition(async () => {
      applyOptimisticTodos({ type: "delete", id });

      try {
        await deleteTodo(id);
        setTodos((prev) => prev.filter((t) => t.id !== id));
      } catch (e) {
        console.error(e);
      }
    });
  };

  const addTodo = async (content: string) => {
    const optimisticTodo: Todo = {
      id: Math.random(),
      content: content,
      is_checked: false,
    };

    startTransition(async () => {
      applyOptimisticTodos({ type: "add", todo: optimisticTodo });

      try {
        const data = await postTodo(content);
        setTodos((prev) => [...prev, data]);
      } catch (e) {
        console.error(e);
      }
    });
  };

  return {
    query,
    setQuery,
    filteredTodos,
    addTodo,
    toggleTodo,
    removeTodo,
  };
}
