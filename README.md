# To Do Web App
This is a simple To Do list web app that is built using Java and Spring Boot for the backend, and Vite, React and Typescript for the frontend. Data will be stored in memory using data structures, so no database is used.

## Features
* Add a todo item with description, priority, and an optional due date.
* Edit a todo item's description, priority, and/or due date.
* Delete a todo item from your list.
* Mark items as complete/uncomplete.
* Calculate average completion time for each priorty type, and overal average time completion. 
* Filter todo's by query search, priority, or whether they were marked complete or not.
* Sort todo's by priority or by due date, in either ascending or descending order.
* Paginates the list to only show a maximum of 10 items on the page.

## To Start the App

1. On the terminal, navigate to the backend: `cd backend`
2. Run the application using: `mvn spring-boot:run`
3. On the terminal, navigate to the frontend: `cd frontend`
4. Start the application using: `npm run dev`

The backend will run on http://localhost:9090

The frontend will run on http://localhost:8080

## API Endpoints

| Method | Endpoint                           | Decription                                       |
|--------|------------------------------------|--------------------------------------------------|
| Post   | `/api/todos`                       | Adds a new todo item to the list.                |
| Put    | `/api/todos/{id}`                  | Edits or deletes a todo item.                    |
| Post   | `/api/todos/complete/{id}`         | Marks a todo item as complete.                   |
| Post   | `/api/todos/undo/{id}`             | Undos the completion of a todo item.             |
| Get    | `/api/todos/averageCompletionTime` | Get the average completion time for the metrics. |
| Get    | `/api/todos`                       | Gets the filtered, sorted, and paginated todos.  |

## Get `/api/todos` Parameters

| Parameter     | Type    | Description                                                 |
|---------------|---------|-------------------------------------------------------------|
| query         | string  | Search string/ query filter                                 |
| priority      | int     | priority filter. 0 = All, 1 = High, 2 = Medium, 3 = Low     |
| completed     | int     | Completed filter. 0 = All, 1 = Completed, 2 = Not Completed |
| page          | int     | Page number for paginated list.                             |
| ascending     | boolean | Sort order: true = ascending, false = descending            |
| sortByDueDate | boolean | If true, sort by due date. If false, sort by priority.      |
