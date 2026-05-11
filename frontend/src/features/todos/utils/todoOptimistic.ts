import type { OptimisticAction, Todo } from "../types/todos.types";

export const optimisticTodoReducer = (
  currentTodos: Todo[],
  action: OptimisticAction,
): Todo[] => {
  switch (action.type) {
    case "add":
      return [...currentTodos, action.todo];
    case "toggle":
      return currentTodos.map((todo) =>
        todo.id === action.id
          ? { ...todo, is_checked: action.is_checked }
          : todo,
      );
    case "delete":
      return currentTodos.filter((todo) => todo.id !== action.id);
    default:
      return currentTodos;
  }
};
