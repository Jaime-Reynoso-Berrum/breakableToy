package com.encoraSpark.todoWebApp.service;

import com.encoraSpark.todoWebApp.model.Todo;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class todoService {
    private Map<UUID, Todo> todoItems = new HashMap<>();
    private String query;
    private int priorityFilter;
    private boolean completed;
    private boolean ascending;
    private int completedCount;
    public Duration totalTimeCompletion = Duration.ZERO;

    //updates page with the current todo items
    public void updateList(String query, int priorityFilter, boolean completed, boolean ascending){

        //filters the list based on 3 parameters, and then sorts it
        List<Todo> filteredList = filterTodos(query, priorityFilter, completed);
        List<Todo> finalList = sortedTodos(filteredList, ascending);


    }

    //sorts todo objects by their due date
    public List<Todo> sortedTodos(List<Todo> todos, boolean ascending){
        List<Todo> sortedList = new ArrayList<>(todos);

        Collections.sort(sortedList, new Comparator<Todo>() {
            @Override
            public int compare(Todo item1, Todo item2) {
                LocalDateTime date1 = item1.getDueDate();
                LocalDateTime date2 = item2.getDueDate();

                if (date1 == null && date2 == null) return 0;
                if (date1 == null) return 1;
                if (date2 == null) return -1;

                int result = date1.compareTo(date2);

                if(!ascending) result = -result;

                return result;
            }
        });
        return sortedList;
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

                if(!lowerCaseTodoItem.contains(lowerCaseQuery)) {
                    continue;
                }
            }

            // filters results by priority
            if (todoItem.getPriority() != 0 && todoItem.getPriority() != priority) {
                continue;
            }

            // filters results by completed, not completed, or all
            if (completed != null && todoItem.isCompleted() != completed) {
                continue;
            }
            finalList.add(todoItem);
        }

        return finalList;
    }

    //adds a new todo item to the HashMap/List
    public Todo addTodo(String todoItem, int priority, LocalDateTime dueDate){
        Todo newItem = new Todo(todoItem, priority, dueDate);
        todoItems.put(newItem.getId(), newItem);

        grabFilterSortState();
        updateList(query, priorityFilter, completed, ascending);
        return newItem;
    }

    //edits the current Todo object
    public Todo editTodo(UUID id, String todoItem, int priority, LocalDateTime dueDate, boolean delete){
        Todo currentItem = todoItems.get(id);

        // deletes the current item from todoItems hashmap and the list
        if(delete){
            todoItems.remove(id);
            grabFilterSortState();
            updateList(query, priorityFilter, completed, ascending);
            return null;
        }

        if(todoItem != null){ currentItem.setTodoItem(todoItem);}
        if(priority != currentItem.getPriority()){ currentItem.setPriority(priority);}

        currentItem.setDueDate(dueDate);

        grabFilterSortState();
        updateList(query, priorityFilter, completed, ascending);
        return currentItem;
    }

    //marks the current todo item as completed/done and adds todoDuration time to totalTimeCompletion variable
    public Todo completeTodo(UUID id){
        Todo currentItem = todoItems.get(id);
        currentItem.setCompleted(true);

        currentItem.setDoneDate(LocalDateTime.now());
        Duration todoDuration = Duration.between(currentItem.getCreationDate(), currentItem.getDoneDate());
        totalTimeCompletion = totalTimeCompletion.plus(todoDuration);
        completedCount++;

        grabFilterSortState();
        updateList(query, priorityFilter, completed, ascending);
        return currentItem;
    }

    //undos an item from being marked as completed/done and removes todoDuration time from totalTime
    public Todo undoCompleteTodo(UUID id){
        Todo currentItem = todoItems.get(id);
        currentItem.setCompleted(false);

        Duration todoDuration = Duration.between(currentItem.getCreationDate(), currentItem.getDoneDate());
        totalTimeCompletion = totalTimeCompletion.minus(todoDuration);
        completedCount--;
        currentItem.setDoneDate(null);

        grabFilterSortState();
        updateList(query, priorityFilter, completed, ascending);
        return currentItem;
    }

    //Must update this method to grab filter/sort state from the correct fields.
    // grabs the parameters to properly filter and sort the list of todos
    public void grabFilterSortState() {
        query = "";
        priorityFilter = 0;
        completed = false;
        ascending = true;
    }

    // Returns the average completion time required for the metrics
    public String getAvgCompletionTime(){
        if (completedCount == 0) return "Complete a To Do item to find the average";

        Duration average = totalTimeCompletion.dividedBy(completedCount);
        long days = average.toDays();
        long hours = average.toHours();
        long minutes = average.toMinutes();
        long seconds = average.toSeconds();

        return String.format("Days: %d   Hours: %d   Minutes: %d   Secods: %d",
                              days, hours, minutes, seconds);
    }

}
