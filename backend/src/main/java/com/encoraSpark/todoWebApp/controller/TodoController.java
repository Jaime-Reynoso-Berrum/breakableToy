package com.encoraSpark.todoWebApp.controller;

import com.encoraSpark.todoWebApp.dto.TodoInput;
import com.encoraSpark.todoWebApp.model.Todo;
import com.encoraSpark.todoWebApp.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api/todos")
public class TodoController {

    @Autowired
    private TodoService todoService;

    // adds a todo item
    @PostMapping
    public Todo addTodo(@RequestBody TodoInput todoInput) {
        LocalDateTime dueDate = null;
        if (todoInput.getDueDate() != null) {
            dueDate = LocalDateTime.parse(todoInput.getDueDate());
        }
        return todoService.addTodo(todoInput.getTodoItem(),
                                   todoInput.getPriority(),
                                   dueDate);
    }

    // edits a todoo item
    @PutMapping("/{id}")
    public Todo editTodo(@PathVariable UUID id,
                         @RequestParam String todoItem,
                         @RequestParam int priority,
                         @RequestParam LocalDateTime dueDate,
                         @RequestParam Boolean delete) {
        return todoService.editTodo(id, todoItem, priority, dueDate, delete);
    }

    // complete a todo item
    @PostMapping("/complete/{id}")
    public Todo completeTodoItem(@PathVariable UUID id) {
        return todoService.completeTodoItem(id);
    }

    // undos marking an item as complete
    @PostMapping("/undo/{id}")
    public Todo undoCompleteItem(@PathVariable UUID id) {
        return todoService.undoCompleteTodoItem(id);
    }

    // grabs the average completion time metrics
    @GetMapping("/averageCompletionTime")
    public String[] getAvgCompletionTime() {
        return todoService.getAvgCompletionTime();
    }

    @GetMapping("/filter")
    public List<Todo> getFilteredTodos(@RequestParam(required = false, defaultValue = "") String query,
                                       @RequestParam(required = false, defaultValue = "0") int priorityFilter,
                                       @RequestParam(required = false) Boolean completed) {
            return todoService.filterTodos(query, priorityFilter, completed);
    }

    @GetMapping("/sort")
    public List<Todo> getSortedTodos(@RequestParam List<Todo> filteredList,
                                     @RequestParam(defaultValue = "true") boolean ascending,
                                     @RequestParam(defaultValue = "true") Boolean sortByDueDate) {
        return todoService.sortedTodos(filteredList, ascending, sortByDueDate);
    }
}
