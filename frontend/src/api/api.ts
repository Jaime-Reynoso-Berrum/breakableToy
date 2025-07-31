import type {EditTodoRequest} from "../types/EditTodoRequest.tsx";
import type {Todo} from "../types/AddTodoRequest.tsx";

const BASE_URL = "http://localhost:9090/api/todos";

//adds a todo item
export async function addTodo(todo: Omit<Todo, "id" | "creationDate" | "doneDate" | "completed" | "deleteFlag">): Promise<Todo> {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
    });

    if (!response.ok) throw new Error("Failed to add task");
    return response.json();
}

//edits a todo item
export async function editTodo(id: string, updated: EditTodoRequest): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
    });
    if (!response.ok) throw new Error("Failed to add task");

    return response.json();
}

// completes a todo item
export async function completeTodo(id: string): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/complete/${id}`, {
        method: "POST",
    });
    return response.json();
}

// uncompletes a todo item
export async function undoCompleteTodo(id: string): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/undo/${id}`, {
        method: "POST",
    });
    return response.json();
}

export async function getMetrics(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/averageCompletionTime`);
    return response.json();
}

export async function filterByQuery(query: string): Promise<Todo[]> {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`${BASE_URL}/filter/query?query=${encodedQuery}`, {
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to filter todos by query");

    return response.json();
}
