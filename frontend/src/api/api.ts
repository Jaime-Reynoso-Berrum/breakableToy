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
    return await response.json();
}

//edits a todo item
export async function editTodo(id: string, updated: EditTodoRequest): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
    });
    if (!response.ok) throw new Error("Failed to add task");

    return await response.json();
}

// completes a todo item
export async function completeTodo(id: string): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/complete/${id}`, {
        method: "POST",
    });
    return await response.json();
}

// uncompletes a todo item
export async function undoCompleteTodo(id: string): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/undo/${id}`, {
        method: "POST",
    });
    return await response.json();
}

export async function getMetrics(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/averageCompletionTime`);
    return response.json();
}

export async function getTodos(
    query: string,
    priority: number,
    completed: number,
    page: number,
    ascending: boolean,
    sortByDueDate: boolean
): Promise<Todo[]> {
    const params = new URLSearchParams({
        query,
        priority: priority.toString(),
        completed: completed.toString(),
        page: page.toString(),
        ascending: ascending.toString(),
        sortByDueDate: sortByDueDate.toString(),
    });

    const response = await fetch(`${BASE_URL}?${params}`);

    if (!response.ok) throw new Error("Failed to add task");

    return await response.json();
}

