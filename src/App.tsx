import { useEffect, useRef, useState } from "react";

type Todo = {
  id: string;
  title: string;
  checked: boolean;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    console.log("loading from localStorage");
    const todos = localStorage.getItem("TODO_LIST");
    return todos ? JSON.parse(todos) : [];
  });
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  console.log("rerender");

  useEffect(() => {
    console.log("saving to localStorage");
    localStorage.setItem("TODO_LIST", JSON.stringify(todos));
  }, [todos]);

  const onClick = () => {
    if (!inputRef.current) return;
    const trimmed = inputRef.current.value.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: trimmed, checked: false },
    ]);
    inputRef.current.value = "";
  };

  return (
    <div className="w-1/2 mx-auto px-4 py-2 rounded-2xl bg-blue-500 text-white flex flex-col gap-4">
      <h1 className="text-center text-4xl font-semibold p-4">To-Do List</h1>
      <form className="flex flex-col gap-2">
        <label className="font-medium text-lg" htmlFor="addBox">
          New Item
        </label>
        <input
          ref={inputRef}
          name="addBox"
          id="addBox"
          className="rounded border-2 border-amber-500 px-2 py-1"
          type="text"
        />
        <button
          type="button"
          onClick={() => onClick()}
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
      {todos.length === 0 ? (
        "No to-dos"
      ) : (
        <ul className="flex flex-col gap-3 pl-2 pb-2">
          {todos
            .filter((todo) =>
              todo.title.toLowerCase().includes(query.toLowerCase()),
            )
            .map((todo) => (
              <li key={todo.id}>
                <div className="flex items-center gap-2">
                  {/* custom list-disc to make it centered */}
                  <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-white" />
                  <input
                    className="h-4 w-4 cursor-pointer accent-amber-500 bg-red-500  shadow"
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
                  {/* add flex-1 to let it grow automatically (fillts entire parent element) */}
                  <span className="flex-1 text-md">{todo.title}</span>
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
