import { useRef } from "react";
import { MAX_TODO_CONTENT_LENGTH } from "@/utils/constants";
import Button from "@/components/Button";
import { Plus } from "lucide-react";

type Props = {
  onSubmitTodo: (content: string) => Promise<void> | void;
};

export default function AddTodoForm({ onSubmitTodo }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // causes 2 renders. could leave out optimistic todo or use the useOptimistic react hook.
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputRef.current) return;
    const trimmed = inputRef.current.value.trim();

    if (!trimmed) return;
    if (trimmed.length > MAX_TODO_CONTENT_LENGTH) {
      alert(
        `Please keep the todo to less than ${MAX_TODO_CONTENT_LENGTH} characters.`,
      );
      return;
    }

    await onSubmitTodo(trimmed);
    inputRef.current.value = "";
    inputRef.current.focus();
  };

  return (
    <form className="flex items-center gap-4" onSubmit={handleSubmit}>
      <label className="min-w-25 font-medium text-xl shrink-0" htmlFor="addBox">
        New Item:
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
        className="squircle border-2 border-primary-primary px-2 flex-1 h-9"
        type="text"
      />
      <Button size="sm" className="font-bold text-xl squircle" type="submit">
        <Plus size={24} />
      </Button>
    </form>
  );
}
