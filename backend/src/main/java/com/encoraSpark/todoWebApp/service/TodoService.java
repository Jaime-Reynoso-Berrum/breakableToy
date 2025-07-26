package com.encoraSpark.todoWebApp.service;

import com.encoraSpark.todoWebApp.model.Todo;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class TodoService {
    private Map<UUID, Todo> todoItems = new HashMap<>();
    private int completedCount;
    public Duration totalTimeCompletion = Duration.ZERO;


    // region **** Business Methods ****

    //adds a new todo item to the HashMap/List
    public Todo addTodo(String todoItem, int priority, LocalDateTime dueDate){
        Todo newItem = new Todo(todoItem, priority, dueDate);
        todoItems.put(newItem.getId(), newItem);

        grabFilterSortState();
        return newItem;
    }

    //edits the current Todo object
    public Todo editTodo(UUID id, String todoItem, int priority, LocalDateTime dueDate, boolean delete){
        Todo currentItem = todoItems.get(id);

        // deletes the current item from todoItems hashmap and the list
        if(delete){
            todoItems.remove(id);
            grabFilterSortState();
            return null;
        }

        if(todoItem != null){ currentItem.setTodoItem(todoItem);}
        if(priority != currentItem.getPriority()){ currentItem.setPriority(priority);}
        if(dueDate != currentItem.getDueDate()){ currentItem.setDueDate(dueDate);}

        grabFilterSortState();
        return currentItem;
    }

    //marks the current todo item as completed/done and adds todoDuration time to totalTimeCompletion variable
    public Todo completeTodoItem(UUID id){
        Todo currentItem = todoItems.get(id);
        currentItem.setCompleted(true);

        currentItem.setDoneDate(LocalDateTime.now());
        Duration todoDuration = Duration.between(currentItem.getCreationDate(), currentItem.getDoneDate());
        totalTimeCompletion = totalTimeCompletion.plus(todoDuration);
        completedCount++;

        grabFilterSortState();
        return currentItem;
    }

    //undos an item from being marked as completed/done and removes todoDuration time from totalTime
    public Todo undoCompleteTodoItem(UUID id){
        Todo currentItem = todoItems.get(id);
        currentItem.setCompleted(false);

        Duration todoDuration = Duration.between(currentItem.getCreationDate(), currentItem.getDoneDate());
        totalTimeCompletion = totalTimeCompletion.minus(todoDuration);
        completedCount--;
        currentItem.setDoneDate(null);

        grabFilterSortState();
        return currentItem;
    }

    // Returns the average completion time required for the metrics
    public String getAvgCompletionTime(){
        if (completedCount == 0) return "Complete a To Do item to find the average";

        Duration average = totalTimeCompletion.dividedBy(completedCount);
        long days = average.toDays();
        long hours = average.toHoursPart();
        long minutes = average.toMinutesPart();
        long seconds = average.toSecondsPart();

        return String.format("Days: %d   Hours: %d   Minutes: %d   Seconds: %d",
                              days, hours, minutes, seconds);
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
            if (priority != 0 && todoItem.getPriority() != priority) {
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

    //updates page with the current todo items
    private List<Todo> updateList(String query, int priorityFilter, Boolean completed, boolean ascending){

        //filters the list based on 3 parameters, and then sorts it
        List<Todo> filteredList = filterTodos(query, priorityFilter, completed);
        List<Todo> finalList = sortedTodos(filteredList, ascending);

        return finalList;
    }

    // endregion *******

    // region **** Helper Methods ****





    // Must update this method to grab filter/sort state from the correct fields on the frontend
    // grabs the parameters to properly filter and sort the list of todos
    private void grabFilterSortState() {
        String query = "";
        int priorityFilter = 0;
        Boolean completed = false;
        boolean ascending = true;

        updateList(query, priorityFilter, completed, ascending);
    }

    // endregion ******


    // region **** TEST METHODS ****

    public Duration getTotalTimeCompletion() { return totalTimeCompletion;}

    public int getCompletedCount() { return completedCount;}

    public Map<UUID, Todo> getTodoMap() { return todoItems; }


    // endregion ******
}
