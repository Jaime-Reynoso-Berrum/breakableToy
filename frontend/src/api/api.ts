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

export async function filterByQuery(queryFilter: string): Promise<Todo[]> {
    const encodedQuery = encodeURIComponent(queryFilter);
    const response = await fetch(`${BASE_URL}/filter/query?queryFilter=${encodedQuery}`, {
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to filter todos by query");

    return await response.json();
}

export async function filterByPriority(priorityFilter: number): Promise<Todo[]> {
    const response = await fetch(`${BASE_URL}/filter/priority?priorityFilter=${priorityFilter}`);
    if (!response.ok) throw new Error("Failed to filter by priority");

    return await response.json();
}

export async function filterByCompleted(completedFilter: 0 | 1 | 2): Promise<Todo[]> {
    const response = await fetch(`${BASE_URL}/filter/completed?completedFilter=${completedFilter}`);
    if (!response.ok) throw new Error("Failed to filter by completed");

    return await response.json();
}

export async function getCombinedFilters(queryFilter: string, priorityFilter: number, completedFilter: 0| 1 | 2): Promise<Todo[]> {
    const params = new URLSearchParams();

    if (queryFilter.trim() !== "") {
        params.append('queryFilter', queryFilter);
    }
    if (priorityFilter !== 0) {
        params.append('priorityFilter', priorityFilter.toString());
    }
    if(completedFilter !== 0){
        params.append('completedFiler', completedFilter.toString());
    }

    const response = await fetch(`${BASE_URL}/filter/combined?${params}`, {
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to filter");
    return await response.json();
}

export async function sortedFinalList(
    ascending: boolean,
    sortByDueDate: boolean
): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/sort?ascending=${ascending}&sortbyDueDate=${sortByDueDate}`);
    if (!response.ok) throw new Error("Failed to sort");

    return await response.json();
}

export async function getOriginalList(): Promise<Todo[]> {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Failed to grab list");

    return await response.json();

}
