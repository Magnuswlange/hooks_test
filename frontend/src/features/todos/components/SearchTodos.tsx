import Button from "@/components/Button";
import { X } from "lucide-react";

type Props = {
  query: string;
  onQueryChange: (newQuery: string) => void;
};

export default function SearchTodos({ query, onQueryChange }: Props) {
  return (
    <div className="flex items-center gap-4">
      <label className="font-medium text-xl min-w-25" htmlFor="searchBox">
        Search:
      </label>
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        name="searchBox"
        id="searchBox"
        className="flex-1 squircle border-2 border-primary-foreground px-2 py-1"
        type="text"
      />
      <Button
        size="sm"
        className="font-bold text-xl squircle bg-red-500"
        type="submit"
        onClick={() => onQueryChange("")}
      >
        <X size={24} />
      </Button>
    </div>
  );
}
