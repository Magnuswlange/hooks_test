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
    <div className="bg-blue-500 text-white flex flex-col gap-4">
      <h1 className="text-center text-2xl font-semibold">To-Do List</h1>
      <form className="flex flex-col gap-4">
        <label htmlFor="addBox">New Item</label>
        <input
          ref={inputRef}
          name="addBox"
          id="addBox"
          className="border-2 border-amber-500"
          type="text"
        />
        <button
          type="button"
          onClick={() => onClick()}
          className="hover:cursor-pointer border-2 border-amber-500"
        >
          Add
        </button>
        <label htmlFor="searchBox">Search</label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          name="searchBox"
          id="searchBox"
          className="border-2 border-amber-500"
          type="text"
        />
      </form>

      <h2>To-Do List:</h2>
      <ul>
        {todos.length === 0 && "No to-dos"}
        {todos
          .filter((todo) =>
            todo.title.toLowerCase().includes(query.toLowerCase()),
          )
          .map((todo) => (
            <li key={todo.id}>
              <input
                className="hover:cursor-pointer"
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
              {todo.title}
              <button
                className="bg-red-500 hover:cursor-pointer"
                type="button"
                onClick={() =>
                  setTodos((prev) => prev.filter((t) => t.id !== todo.id))
                }
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
