package com.encoraSpark.todoWebApp.service;

import com.encoraSpark.todoWebApp.model.Todo;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class TodoService {
    private Map<UUID, Todo> todoItems = new HashMap<>();
    private int totalCompletedCount;
    private int highCompletedCount;
    private int mediumCompletedCount;
    private int lowCompletedCount;
    private Duration totalTimeCompletion;
    public Duration highTimeCompletion = Duration.ZERO;
    public Duration mediumTimeCompletion = Duration.ZERO;
    public Duration lowTimeCompletion = Duration.ZERO;
    private String currentQueryFilter = "";
    private int currentPriorityFilter = 0;
    private Boolean currentCompleted = null;
    private boolean currentAscending = true;
    private boolean currentSortByDueDate = true;

    private List<Todo> originalList = new ArrayList<>();
    private List<Todo> filteredList = new ArrayList<>();
    private List<Todo> finalList = new ArrayList<>();

    // region **** Business Methods ****

    //adds a new todo item to the HashMap/List
    public Todo addTodo(String todoItem, int priority, LocalDateTime dueDate){
        Todo newItem = new Todo(todoItem, priority, dueDate);
        todoItems.put(newItem.getId(), newItem);
        originalList.add(newItem);

        updateList();
        return newItem;
    }

    //edits the current Todo object
    public Todo editTodo(UUID id, String todoItem, int priority, LocalDateTime dueDate, boolean delete){
        Todo currentItem = todoItems.get(id);

        // deletes the current item from todoItems hashmap and the list
        if(delete){
            originalList.remove(currentItem);
            todoItems.remove(id);
            updateList();
            return null;
        }

        if(todoItem != null){ currentItem.setTodoItem(todoItem);}
        if(priority != currentItem.getPriority()){ currentItem.setPriority(priority);}
        if(dueDate != currentItem.getDueDate()){ currentItem.setDueDate(dueDate);}

        updateList();
        return currentItem;
    }

    //marks the current todo item as completed/done and adds todoDuration to metrics
    public Todo completeTodoItem(UUID id){
        Todo currentItem = todoItems.get(id);
        currentItem.setCompleted(true);

        // calculates total duration time and adds it to metrics
        currentItem.setDoneDate(LocalDateTime.now());
        Duration todoDuration = Duration.between(currentItem.getCreationDate(), currentItem.getDoneDate());
        addTimeToMetrics(currentItem.getPriority(), todoDuration);

        updateList();
        return currentItem;
    }

    // undos an item from being marked as completed/done and removes todoDuration time from metrics
    public Todo undoCompleteTodoItem(UUID id){
        Todo currentItem = todoItems.get(id);
        currentItem.setCompleted(false);

        // removes duration from metrics and sets items done date to null
        Duration todoDuration = Duration.between(currentItem.getCreationDate(), currentItem.getDoneDate());
        removeTimeFromMetrics(currentItem.getPriority(), todoDuration);
        currentItem.setDoneDate(null);

        updateList();
        return currentItem;
    }

    // Returns the average completion times required for the metrics
    public String[] getAvgCompletionTime(){

        // calculates total time and divides by total completed count
        totalTimeCompletion = highTimeCompletion.plus(mediumTimeCompletion).plus(lowTimeCompletion);
        totalCompletedCount = highCompletedCount + mediumCompletedCount + lowCompletedCount;
        String avgTotalTime = calculateMetrics(totalTimeCompletion, totalCompletedCount);

        // calculates avg times for each priority
        String avgHighTime = calculateMetrics(highTimeCompletion, highCompletedCount);
        String avgMediumTime = calculateMetrics(mediumTimeCompletion, mediumCompletedCount);
        String avgLowTime = calculateMetrics(lowTimeCompletion, lowCompletedCount);

        // answers returned in an array
        return new String[]{avgTotalTime, avgHighTime, avgMediumTime, avgLowTime};
    }

    public List<Todo> setQueryFilter(String queryFilter){
        currentQueryFilter = queryFilter;
        updateList();
        return finalList;
    }

    public List<Todo> setPriorityFilter(int priorityFilter){
        currentPriorityFilter = priorityFilter;
        updateList();
        return finalList;
    }

    public List<Todo> setCompletedFilter(Boolean completedFilter){
        currentCompleted = completedFilter;
        updateList();
        return finalList;
    }

    //sorts todo objects by their due date and priority
    public List<Todo> sortedTodos(List<Todo> filteredList, Boolean ascending, Boolean sortByDuedate){
        List<Todo> sortedList = new ArrayList<>(filteredList);


        Comparator<Todo> comparator = new Comparator<Todo>() {
            @Override
            public int compare(Todo item1, Todo item2) {
                int result;

                if (ascending == null && sortByDuedate == null) { return 0; }

                // sorts by due date first, and then by priority
                if (sortByDuedate) {

                    result = sortByDueDate(item1, item2);
                    if (result == 0) {
                        result = sortByPriority(item1, item2);
                    }
                } else {
                    // sorts by priority first, then by due date
                    result = sortByPriority(item1, item2);
                    if (result == 0) {
                        result = sortByDueDate(item1, item2);
                    }
                }

                if (ascending) { return result; }
                else{
                    return -result;
                }
            }
        };

        Collections.sort(sortedList, comparator);
        return sortedList;
    }


    // endregion *******

    // region **** Helper Methods ****

    private void updateList(){
        finalList = rebuildFinalList();
    }

    private List<Todo> rebuildFinalList(){
        List<Todo> result = new ArrayList<>(originalList);
        result = filterByQuery(result, currentQueryFilter);
        result = filterByPriority(result, currentPriorityFilter);
        result = filterByComplete(result, currentCompleted);
        result = sortedTodos(result, currentAscending, currentSortByDueDate);
        return result;
    }

    // grabs the current filtered and sorted list
    private List<Todo> getFinalList(){
        return new ArrayList<>(finalList);
    }

    // filters todo list by query
    private List<Todo> filterByQuery(List<Todo> list, String query){
        if(query == null && query.isEmpty()) return list;

        List<Todo> queryList = new ArrayList<>();

        String lowerCaseQuery = query.toLowerCase();
        for (Todo todo: list){
            if (todo.getTodoItem().toLowerCase().contains(lowerCaseQuery)) {
                queryList.add(todo);
            }
        }
        return queryList;
    }

    // filters todos list by priority
    private List<Todo> filterByPriority(List<Todo> list, int priority){
        if(priority == 0) return list;

        List<Todo> priorityList = new ArrayList<>();

        for (Todo todo: list){
            if (todo.getPriority() == priority) {
                priorityList.add(todo);
            }
        }
        return priorityList;
    }

    // filters todo list by completed or not
    private List<Todo> filterByComplete(List<Todo> list, Boolean completed){
        if(completed == null) return list;

        List<Todo>  completedList = new ArrayList<>();

        for (Todo todo: list){
            if (todo.isCompleted() == completed){
                completedList.add(todo);
            }
        }
        return completedList;
    }

    // compares due dates of two items to sort them
    private int sortByDueDate(Todo item1, Todo item2){
        LocalDateTime date1 = item1.getDueDate();
        LocalDateTime date2 = item2.getDueDate();

        if (date1 == null && date2 == null) return 0;
        else if (date1 == null) return 1;
        else if (date2 == null) return -1;
        else return date1.compareTo(date2);
    }

    // compares priority of two items to sort them
    private int sortByPriority(Todo item1, Todo item2) {
        return Integer.compare(item1.getPriority(), item2.getPriority());
    }

    //adds completed count and time to variables depending on todo item priority
    private void addTimeToMetrics(int priority, Duration duration){
        switch (priority) {
            case 1:
                highTimeCompletion = highTimeCompletion.plus(duration);
                highCompletedCount++;
                break;
            case 2:
                mediumTimeCompletion = mediumTimeCompletion.plus(duration);
                mediumCompletedCount++;
                break;
            case 3:
                lowTimeCompletion = lowTimeCompletion.plus(duration);
                lowCompletedCount++;
                break;
            default:
                break;
        }
    }

    // removes completed count and time to variables depending on todo item priority
    private void removeTimeFromMetrics(int priority, Duration duration){
        switch (priority) {
            case 1:
                highTimeCompletion = highTimeCompletion.minus(duration);
                highCompletedCount--;
                break;
            case 2:
                mediumTimeCompletion = mediumTimeCompletion.minus(duration);
                mediumCompletedCount--;
                break;
            case 3:
                lowTimeCompletion = lowTimeCompletion.minus(duration);
                lowCompletedCount--;
                break;
            default:
                break;
        }
    }

    // returns a string representation of avg completion time
    private String calculateMetrics(Duration todoDuration, int todoCount){
        if (todoCount == 0) return "Complete a To Do item to find the average";

        Duration average = todoDuration.dividedBy(todoCount);
        long days = average.toDays();
        long hours = average.toHoursPart();
        long minutes = average.toMinutesPart();
        long seconds = average.toSecondsPart();

        return String.format("Days: %d   Hours: %d   Minutes: %d   Seconds: %d",
                              days, hours, minutes, seconds);
    }

    // endregion ******


    // region **** TEST METHODS ****

    public Duration getHighTimeCompletion() { return highTimeCompletion;}
    public Duration getMediumTimeCompletion() { return mediumTimeCompletion;}
    public Duration getLowTimeCompletion() { return lowTimeCompletion;}

    public int getHighCompletedCount() { return highCompletedCount;}
    public int getMediumCompletedCount() { return mediumCompletedCount;}
    public int getLowCompletedCount() { return lowCompletedCount;}

    public List<Todo> getOriginalList() {return originalList;}
    public Map<UUID, Todo> getTodoMap() { return todoItems; }


    // endregion ******
}
