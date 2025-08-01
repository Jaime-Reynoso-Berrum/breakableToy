package com.encoraSpark.todoWebApp.controller;

import com.encoraSpark.todoWebApp.dto.TodoEdit;
import com.encoraSpark.todoWebApp.dto.TodoInput;
import com.encoraSpark.todoWebApp.model.Todo;
import com.encoraSpark.todoWebApp.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/todos")
public class TodoController {

    @Autowired
    private TodoService todoService;

    // adds a todo item
    @PostMapping
    public Todo addTodo(@RequestBody TodoInput todoInput) {
        System.out.println(todoInput.getTodoItem());

        return todoService.addTodo(todoInput.getTodoItem(),
                                   todoInput.getPriority(),
                                   todoInput.getDueDate());
    }

    // edits a todoo item
    @PutMapping("/{id}")
    public ResponseEntity<?> editTodo(@PathVariable UUID id,
                         @RequestBody TodoEdit todoEdit) {

        Todo edited = todoService.editTodo(id,
                                           todoEdit.getTodoItem(),
                                           todoEdit.getPriority(),
                                           todoEdit.getDueDate(),
                                           todoEdit.getDeleted()
        );

        if (edited == null){
            return ResponseEntity.ok().body(Map.of("message", "Todo deleted"));
        } else {
            return ResponseEntity.ok(edited);
        }
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
    public String[] getMetrics() {
        return todoService.getAvgCompletionTime();
    }

    @GetMapping
    public List<Todo> getTodos(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int priority,
            @RequestParam(defaultValue = "0") int completed,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "true") boolean ascending,
            @RequestParam(defaultValue = "true") boolean sortByDueDate) {

        todoService.getFilteredTodos(query, priority, completed);
        todoService.sortedTodos(ascending, sortByDueDate);
        return todoService.paginateTodos(page);
    }

}
