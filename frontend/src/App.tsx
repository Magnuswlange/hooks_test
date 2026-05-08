import {
  startTransition,
  useEffect,
  useMemo,
  useOptimistic,
  useRef,
  useState,
} from "react";

type Todo = {
  id: number;
  content: string;
  is_checked: boolean;
};

type OptimisticAction =
  | { type: "add"; todo: Todo }
  | { type: "toggle"; id: number; is_checked: boolean }
  | { type: "delete"; id: number };

const MAX_TODO_CONTENT_LENGTH = 80;

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState<string>("");
  const [optimisticTodos, applyOptimisticTodos] = useOptimistic<
    Todo[],
    OptimisticAction
  >(todos, (currentTodos: Todo[], action: OptimisticAction) => {
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
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  console.log("rerender");

  useEffect(() => {
    const fetchTodos = async () => {
      console.log("fetching server data");
      try {
        const res = await fetch("http://localhost:3000/api/todos");

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

  // only update when todos or query change
  const filteredTodos = useMemo(
    () =>
      optimisticTodos.filter((todo) =>
        todo.content.toLowerCase().includes(query.toLowerCase()),
      ),
    [optimisticTodos, query],
  );

  const handleToggle = async (id: number, isChecked: boolean) => {
    startTransition(async () => {
      applyOptimisticTodos({ type: "toggle", id: id, is_checked: isChecked });

      try {
        const res = await fetch(`http://localhost:3000/api/todos/${id}`, {
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

        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, is_checked: isChecked } : t)),
        );
      } catch (e) {
        console.error("Error: ", e);
      }
    });
  };

  const handleDelete = async (id: number) => {
    startTransition(async () => {
      applyOptimisticTodos({ type: "delete", id: id });

      try {
        const res = await fetch(`http://localhost:3000/api/todos/${id}`, {
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

        setTodos((prev) => prev.filter((t) => t.id !== id));
        console.log("Deleted TodoItem with ID: ", id);
      } catch (e) {
        console.error("Error: ", e);
      }
    });
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

    const optimisticTodo: Todo = {
      id: Math.random(),
      content: trimmed + " optimistic",
      is_checked: false,
    };

    startTransition(async () => {
      applyOptimisticTodos({ type: "add", todo: optimisticTodo });

      try {
        const res = await fetch("http://localhost:3000/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: trimmed,
          }),
        });

        if (!res.ok) {
          console.error("POST request failed");
        }

        const data = await res.json();
        console.log("Created TodoItem: ", data);

        // set the server response as the real todo once retrieved (overrides old setTodos() as state doesn't change until next rerender)
        setTodos((prev) => [...prev, data]);
      } catch (e) {
        console.error("Error: ", e);
      }
    });

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
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white shadow" />
                <input
                  className="h-4 w-4 cursor-pointer accent-amber-500"
                  type="checkbox"
                  checked={todo.is_checked}
                  onChange={(e) => handleToggle(todo.id, e.target.checked)}
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
                  onClick={() => handleDelete(todo.id)}
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
