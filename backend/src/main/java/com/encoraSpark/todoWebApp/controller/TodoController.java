package com.encoraSpark.todoWebApp.controller;

import com.encoraSpark.todoWebApp.model.Todo;
import com.encoraSpark.todoWebApp.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    @Autowired
    private TodoService todoService;

    // adds a todo item
    @PostMapping
    public Todo addTodo(@RequestParam String todoItem,
                        @RequestParam int priority,
                        @RequestParam LocalDateTime dueDate) {
        return todoService.addTodo(todoItem, priority, dueDate);
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
    @PostMapping("/{id}/complete")
    public Todo completeTodoItem(@PathVariable UUID id) {
        return todoService.completeTodoItem(id);
    }

    // undos marking an item as complete
    @PostMapping("/{id}/undo")
    public Todo undoCompleteItem(@PathVariable UUID id) {
        return todoService.undoCompleteTodoItem(id);
    }

    // filter and sorts the todo list
    @GetMapping
    public List<Todo> updateTodoList (@RequestParam(required = false, defaultValue = "") String query,
                                      @RequestParam(required = false, defaultValue = "0") int priorityFilter,
                                      @RequestParam(required = false) Boolean completed,
                                      @RequestParam(required = false, defaultValue = "true") boolean ascending) {
        return todoService.updateList(query, priorityFilter, completed, ascending);
    }

    // grabs the average completion time
    @GetMapping("/averageCompletionTime")
    public String getAvgCompletionTime() {
        return todoService.getAvgCompletionTime();
    }
}
