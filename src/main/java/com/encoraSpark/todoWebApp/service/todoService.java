package com.encoraSpark.todoWebApp.service;

import com.encoraSpark.todoWebApp.model.Todo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class todoService {
    private final Map<UUID, Todo> todoItems = new HashMap<>();

    //updates page with the current todo item
    public void updateList(){
        //code needed here
    }

    //adds a new todo item to the HashMap/List
    public Todo addTodo(String todoItem, String priority, LocalDate dueDate){
        Todo newItem = new Todo(todoItem, priority, dueDate);
        todoItems.put(newItem.getId(), newItem);
        updateList();
        return newItem;
    }

    //edits the current Todo object
    public Todo editTodo(UUID id, String todoItem, String priority, LocalDate dueDate){
        Todo currentItem = todoItems.get(id);

        if(todoItem != null){ currentItem.setTodoItem(todoItem);}
        if(priority != null){ currentItem.setPriority(priority);}
        if(dueDate != null){ currentItem.setDueDate(dueDate);}
    }

    //marks the current todo item as completed/done
    public Todo completeTodo(UUID id){
        Todo currentItem = todoItems.get(id);
        currentItem.setCompleted(true);
        currentItem.setDoneDate(LocalDate.now());
        return currentItem;
    }

    //undos an item from being marked as completed/done
    public Todo undoCompleteTodo(UUID id){
        Todo currentItem = todoItems.get(id);
        currentItem.setCompleted(false);
        currentItem.setDoneDate(null);
        return currentItem;
    }
}
