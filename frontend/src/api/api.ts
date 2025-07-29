import type {Todo} from "../components/TodoItem"

const BASE_URL = "http://localhost:9090/api/todos";

//adds a todo item
export async function addTodo(Todo: Omit<Todo, "id" | "creationDate" | "doneDate" | "completed">): Promise<Todo> {
    const response = await fetch('${BASE_URL}', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Todo),
    });
    if (!response.ok) throw new Error("Failed to ad task");
    return response.json();
}

//edits a todo item
export async function editTodo(id: string, updated: Partial<Todo>): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
    });
    return response.json();
}

// completes a todo item
export async function completeTodo(id: string): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/complete/${id}`, {
        method: "PUT",
    });
    return response.json();
}