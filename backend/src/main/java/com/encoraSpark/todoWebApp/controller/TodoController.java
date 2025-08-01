package com.encoraSpark.todoWebApp.controller;

import com.encoraSpark.todoWebApp.dto.TodoEdit;
import com.encoraSpark.todoWebApp.dto.TodoInput;
import com.encoraSpark.todoWebApp.model.Todo;
import com.encoraSpark.todoWebApp.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    @GetMapping("/filter/query")
    public List<Todo> getQueryFilter(@RequestParam String queryFilter) {
            return todoService.setQueryFilter(queryFilter);
    }

    @GetMapping("/filter/priority")
    public List<Todo> getPriorityFilter(@RequestParam int priorityFilter) {
        return todoService.setPriorityFilter(priorityFilter);
    }

    @GetMapping("/filter/completed")
    public List<Todo> getCompletedFilter(@RequestParam int completedFilter) {
        return todoService.setCompletedFilter(completedFilter);
    }

    @GetMapping("/sort")
    public List<Todo> sortFinalList(@RequestParam(defaultValue = "true") boolean ascending,
                                     @RequestParam(defaultValue = "true") boolean sortByDueDate) {
        return todoService.sortFinalList(ascending, sortByDueDate);
    }

    @GetMapping
    public List<Todo> getList() {
        return todoService.getOriginalList();
    }
}
