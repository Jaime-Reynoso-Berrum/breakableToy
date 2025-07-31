package com.encoraSpark.todoWebApp.controller;

import com.encoraSpark.todoWebApp.dto.TodoEdit;
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
        System.out.println(todoInput.getTodoItem());

        return todoService.addTodo(todoInput.getTodoItem(),
                                   todoInput.getPriority(),
                                   todoInput.getDueDate());
    }

    // edits a todoo item
    @PutMapping("/{id}")
    public Todo editTodo(@PathVariable UUID id,
                         @RequestBody TodoEdit todoEdit) {


        System.out.println(todoEdit.getTodoItem());
        return todoService.editTodo(id,
                                    todoEdit.getTodoItem(),
                                    todoEdit.getPriority(),
                                    todoEdit.getDueDate(),
                                    todoEdit.getDeleted());
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
    public List<Todo> getCompletedFilter(@RequestParam Boolean completed) {
        return todoService.setCompletedFilter(completed);
    }

    @GetMapping("/sort")
    public List<Todo> getSortedTodos(@RequestParam List<Todo> filteredList,
                                     @RequestParam(defaultValue = "true") boolean ascending,
                                     @RequestParam(defaultValue = "true") Boolean sortByDueDate) {
        return todoService.sortedTodos(filteredList, ascending, sortByDueDate);
    }
}
