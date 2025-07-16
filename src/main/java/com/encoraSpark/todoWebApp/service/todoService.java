package com.encoraSpark.todoWebApp.service;

import com.encoraSpark.todoWebApp.model.Todo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class todoService {
    private final Map<UUID, Todo> todoItems = new HashMap<>();

    //updates page with the current todo items
    public void updateList(){
        //code needed here
    }

    //filters todo items based on query search, priority, and completed status
    public List<Todo> filterTodos(String query, int priority, Boolean completed){
        List<Todo> finalList = new ArrayList<>();

        // adds todoItem to finalList based on filter options
        for(Todo todoItem : todoItems.values()) {

            //filters results by query search
            if(query != null && !query.isEmpty()) {
                String lowerCaseQuery = query.toLowerCase();
                String lowerCaseTodoItem = todoItem.getTodoItem().toLowerCase();

                if(lowerCaseTodoItem.contains(lowerCaseQuery)) {
                    continue;
                }
            }

            // filters results by priority
            if (todoItem.getPriority() != 4 && todoItem.getPriority() != priority) {
                continue;
            }

            // filters results by completed, not completed, or all
            if (completed != null && todoItem.isCompleted() != completed) {
                continue;
            }
        }

        return finalList;
    }

    //adds a new todo item to the HashMap/List
    public Todo addTodo(String todoItem, int priority, LocalDate dueDate){
        Todo newItem = new Todo(todoItem, priority, dueDate);
        todoItems.put(newItem.getId(), newItem);

        updateList();
        return newItem;
    }

    //edits the current Todo object
    public Todo editTodo(UUID id, String todoItem, int priority, LocalDate dueDate, Boolean delete){
        Todo currentItem = todoItems.get(id);

        // deletes the current item from todoItems hashmap and the list
        if(delete){
            todoItems.remove(id);
            updateList();
            return null;
        }

        if(todoItem != null){ currentItem.setTodoItem(todoItem);}
        if(priority != currentItem.getPriority()){ currentItem.setPriority(priority);}
        if(dueDate != null){ currentItem.setDueDate(dueDate);}

        updateList();
        return currentItem;
    }

    //marks the current todo item as completed/done
    public Todo completeTodo(UUID id){
        Todo currentItem = todoItems.get(id);
        currentItem.setCompleted(true);
        currentItem.setDoneDate(LocalDate.now());

        updateList();
        return currentItem;
    }

    //undos an item from being marked as completed/done
    public Todo undoCompleteTodo(UUID id){
        Todo currentItem = todoItems.get(id);
        currentItem.setCompleted(false);
        currentItem.setDoneDate(null);

        updateList();
        return currentItem;
    }
}
