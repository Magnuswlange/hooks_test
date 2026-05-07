import { useEffect, useRef, useState } from "react";

// !TODO: setting is_checked and deleting items optimistically. keep a lastTodoItem copy so reconciliate if request fails.

type Todo = {
  id: number;
  content: string;
  is_checked: boolean;
  // left out created_at because it's not relevant to the client
};

const MAX_TODO_CONTENT_LENGTH = 80;

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredTodos = todos.filter((todo) =>
    todo.content.toLowerCase().includes(query.toLowerCase()),
  );

  console.log("rerender");

  useEffect(() => {
    const fetchTodos = async () => {
      console.log("fetching server data");
      try {
        const res = await fetch("http://localhost:3000/todos");

        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setTodos(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchTodos();
  }, []);

  const onToggle = async (id: number, isChecked: boolean) => {
    // optimistically set the client-side todos while sending request and later check against the server (single truth)
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_checked: isChecked } : t)),
    );

    try {
      const res = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_checked: isChecked,
        }),
      });

      if (!res.ok) {
        console.error("PATCH request failed");
      }

      console.log("Toggled TodoItem is_checked with ID: ", id);
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  const onDelete = async (id: number) => {
    // optimistically set the client-side todos while sending request and later check against the server (single truth)
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      if (!res.ok) {
        console.error("DELETE request failed");
      }

      console.log("Deleted TodoItem with ID: ", id);
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  // causes 2 renders. could leave out optimistic todo or use the useOptimistic react hook.
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputRef.current) return;
    const trimmed = inputRef.current.value.trim();

    if (!trimmed) return;
    if (trimmed.length > MAX_TODO_CONTENT_LENGTH) {
      alert(
        `Please keep the todo to less than or equal to ${MAX_TODO_CONTENT_LENGTH} characters.`,
      );
      return;
    }

    // optimistically set the client-side todos while sending request and later check against the server (single truth)
    const optimisticTodo = {
      id: Math.random(),
      content: trimmed,
      is_checked: false,
    };

    setTodos((prev) => [...prev, optimisticTodo]);

    try {
      const res = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: trimmed,
          is_checked: false,
        }),
      });

      if (!res.ok) {
        console.error("POST request failed");
      }

      const data = await res.json();
      console.log("Created TodoItem: ", data);

      // set the server response as the real todo once retrieved (overrides old setTodos() as state doesn't change until next rerender)
      setTodos((prev) =>
        prev.map((todo) => (todo.id === optimisticTodo.id ? data : todo)),
      );
    } catch (e) {
      console.error("Error: ", e);
    }

    inputRef.current.value = "";
    inputRef.current.focus();
  };

  return (
    <div className="w-1/2 mx-auto px-4 py-2 rounded-2xl bg-blue-500 text-white flex flex-col gap-2 shadow">
      <h1 className="text-center text-4xl font-semibold p-4">To-Do List</h1>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <label className="font-medium text-lg" htmlFor="addBox">
          New Item
        </label>
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              e.preventDefault();
            }
          }}
          ref={inputRef}
          name="addBox"
          id="addBox"
          className="rounded border-2 border-amber-500 px-2 py-1"
          type="text"
        />
        <button
          type="submit"
          className="font-bold text-lg px-4 py-2 mt-2 mb-2 rounded-2xl bg-amber-500 hover:cursor-pointer border-2 border-amber-500  shadow"
        >
          Add
        </button>
        <label className="font-medium text-lg" htmlFor="searchBox">
          Search
        </label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          name="searchBox"
          id="searchBox"
          className="rounded border-2 border-amber-500 px-2 py-1"
          type="text"
        />
      </form>

      <h2 className="font-semibold text-2xl">Filtered:</h2>
      {filteredTodos.length === 0 ? (
        <p>No to-dos</p>
      ) : (
        <ul className="flex flex-col gap-3 pl-2 pb-2">
          {filteredTodos.map((todo) => (
            <li key={todo.id}>
              <div className="flex items-center gap-2">
                {/* custom list-disc to make it centered */}
                <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-white shadow" />
                <input
                  className="h-4 w-4 cursor-pointer accent-amber-500"
                  type="checkbox"
                  checked={todo.is_checked}
                  onChange={(e) => onToggle(todo.id, e.target.checked)}
                ></input>
                {/* add flex-1 to let it grow automatically (fills entire parent element). truncate automatically truncates and adds ellipsis (...). content makes it display the full content on hover. */}
                <span
                  className="flex-1 text-md truncate"
                  content={todo.content}
                >
                  {todo.content}
                </span>
                <button
                  className="py-1 px-3 rounded-2xl bg-red-500 text-sm font-semibold cursor-pointer shadow"
                  type="button"
                  onClick={() => onDelete(todo.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
