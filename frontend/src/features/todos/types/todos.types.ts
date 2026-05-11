export type Todo = {
  id: number;
  content: string;
  is_checked: boolean;
};

export type OptimisticAction =
  | { type: "add"; todo: Todo }
  | { type: "toggle"; id: number; is_checked: boolean }
  | { type: "delete"; id: number };
