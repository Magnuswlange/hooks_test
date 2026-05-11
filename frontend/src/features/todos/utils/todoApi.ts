const BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000/api/todos"
  : "/api/todos";
import type { Todo } from "../types/todos.types";

export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(BASE_URL);

  if (!res.ok) {
    throw new Error(`Server error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
};

export const patchTodo = async (
  id: number,
  isChecked: boolean,
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      is_checked: isChecked,
    }),
  });

  if (!res.ok) {
    throw new Error("PATCH request failed");
  }
};

export const deleteTodo = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
  });

  if (!res.ok) {
    throw new Error("DELETE request failed");
  }
};

export const postTodo = async (content: string) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: content,
    }),
  });

  if (!res.ok) {
    throw new Error("POST request failed");
  }

  const data = await res.json();
  return data;
};
