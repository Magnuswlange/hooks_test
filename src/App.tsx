import { useEffect, useRef, useState } from "react";

type Todo = {
  id: string;
  title: string;
  checked: boolean;
};

const MAX_TODO_TITLE_LENGTH = 80;

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(query.toLowerCase()),
  );

  console.log("rerender");

  useEffect(() => {
    console.log("fetching server data");
    fetch("http://localhost:3000/todos")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setTodos(data);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputRef.current) return;
    const trimmed = inputRef.current.value.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_TODO_TITLE_LENGTH) {
      alert(
        `Please keep the todo to less than or equal to ${MAX_TODO_TITLE_LENGTH} characters.`,
      );
      return;
    }

    // optimistically set the client-side todos while sending request and later check against the server (single truth)
    // setTodos((prev) => [
    //   ...prev,
    //   { id: crypto.randomUUID(), title: trimmed, checked: false },
    // ]);

    try {
      const res = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmed,
          checked: false,
        }),
      });

      if (!res.ok) {
        console.error("POST request failed");
      }

      const data = await res.json();
      console.log("Created TodoItem: ", data);
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
                  checked={todo.checked}
                  onChange={(e) =>
                    setTodos((prev) =>
                      prev.map((t) =>
                        t.id === todo.id
                          ? { ...t, checked: e.target.checked }
                          : t,
                      ),
                    )
                  }
                ></input>
                {/* add flex-1 to let it grow automatically (fills entire parent element). truncate automatically truncates and adds ellipsis (...). title makes it display the full title on hover. */}
                <span className="flex-1 text-md truncate" title={todo.title}>
                  {todo.title}
                </span>
                <button
                  className="py-1 px-3 rounded-2xl bg-red-500 text-sm font-semibold cursor-pointer shadow"
                  type="button"
                  onClick={() =>
                    setTodos((prev) => prev.filter((t) => t.id !== todo.id))
                  }
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
