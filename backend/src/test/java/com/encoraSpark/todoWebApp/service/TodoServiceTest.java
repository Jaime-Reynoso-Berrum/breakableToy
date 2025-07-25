package com.encoraSpark.todoWebApp.service;

import com.encoraSpark.todoWebApp.model.Todo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class TodoServiceTest {
    private TodoService todoService;

    @BeforeEach
    public void setUp() {
        todoService = new TodoService();
    }

    @Test
    public void testAddTodoItem() {
        String testString = "Add TodoItem Test";
        int priority = 0;
        LocalDateTime dueDate = LocalDateTime.now().plusDays(3);

        // tests if the object was created correctly
        Todo newTodo = todoService.addTodo(testString, priority, dueDate);
        assertNotNull(newTodo);
        assertEquals(testString, newTodo.getTodoItem());
        assertEquals(priority, newTodo.getPriority());
        assertEquals(dueDate, newTodo.getDueDate());
        assertFalse(newTodo.isCompleted());
        assertNotNull(newTodo.getCreationDate());
        assertNull(newTodo.getDoneDate());

        // test if object is in the HashMap
        Todo inHashMap = todoService.getTodoMap().get(newTodo.getId());
        assertNotNull(inHashMap);
        assertEquals(newTodo, inHashMap);
    }

    @Test
    public void testDeleteTodoItem() {
        Todo toBeDeleted = todoService.addTodo("Delete TodoItem test", 0, LocalDateTime.now());
        UUID id = toBeDeleted.getId();

        // Deletes the todoItem and verifies that it is not in the HashMap
        Todo deletion = todoService.editTodo(id, null, 0, null, true);
        assertNull(deletion);
        assertFalse(todoService.getTodoMap().containsKey(id));
    }

    @Test
    public void testUpdateTodoItem() {
        // original todo item
        String testString = "Update TodoItem Test: Did the fields update correctly";
        int priority = 0;
        LocalDateTime dueDate = LocalDateTime.now().plusDays(3);
        Todo addedTodo = todoService.addTodo(testString, priority, dueDate);

        // new values to update todo item
        String updatedString = "Did the fields update correctly";
        int updatedPriority = 1;
        LocalDateTime updatedDueDate = LocalDateTime.now().plusDays(5);

        // creating and testing the updated todo item
        Todo updatedTodo = todoService.editTodo(addedTodo.getId(), updatedString, updatedPriority, updatedDueDate, false);

        assertNotNull(updatedTodo);
        assertEquals(updatedString, updatedTodo.getTodoItem());
        assertEquals(updatedPriority, updatedTodo.getPriority());
        assertEquals(updatedDueDate, updatedTodo.getDueDate());
    }

    @Test
    public void testCompleteTodoItem() {
        String testString = "Complete a TodoItem Test";
        int priority = 0;
        LocalDateTime dueDate = null;
        Todo item = todoService.addTodo(testString, priority, dueDate);
        item.setCreationDate(LocalDateTime.now().minusDays(3));

        // Completes the todo and verifies that it is marked complete
        Todo itemComplete = todoService.completeTodoItem(item.getId());
        assertTrue(itemComplete.isCompleted());
        assertNotNull(itemComplete.getDoneDate());

        // Tests if time completion is added to TotalTimeCompletion
        // and checks if completedCount is incremented
        Duration duration = Duration.between(itemComplete.getCreationDate(), itemComplete.getDoneDate());
        assertEquals(duration, todoService.getTotalTimeCompletion());
        assertEquals(1, todoService.getCompletedCount());
    }

    @Test
    public void testUndoCompleteTodoItem(){
        String testString = "Undo TodoItem Test";
        int priority = 0;
        LocalDateTime dueDate = null;
        Todo item = todoService.addTodo(testString, priority, dueDate);
        item.setCreationDate(LocalDateTime.now().minusDays(3));

        //completes todo and grabs duration time
        Todo itemComplete = todoService.completeTodoItem(item.getId());
        Duration duration = Duration.between(itemComplete.getCreationDate(), itemComplete.getDoneDate());


        // undos completing the todo and verifies that it is marked not complete
        Todo undoComplete = todoService.undoCompleteTodoItem(item.getId());
        assertFalse(undoComplete.isCompleted());
        assertNull(undoComplete.getDoneDate());

        // Tests if time durationo time is subtracted from TotalTimeCompletion
        // and checks if completedCount is reduced by 1
        assertEquals(Duration.ZERO, todoService.getTotalTimeCompletion());
        assertEquals(0, todoService.getCompletedCount());
    }

    @Test
    public void testGetAvgTimeCompletion(){

        // created 3 nodes and marks them completed
        Todo item1 = todoService.addTodo("Test Item 1", 0, null);
        item1.setCreationDate(LocalDateTime.now().minusDays(3));
        todoService.completeTodoItem(item1.getId());

        Todo item2 = todoService.addTodo("Test Item 2", 0, null);
        item2.setCreationDate(LocalDateTime.now().minusHours(17));
        todoService.completeTodoItem(item2.getId());

        Todo item3 = todoService.addTodo("Test Item 3", 0, null);
        item3.setCreationDate(LocalDateTime.now().minusMinutes(58));
        todoService.completeTodoItem(item3.getId());

        // average 1 day, 5 hours, 59 minutes, 20 seconds
        String result = todoService.getAvgCompletionTime();
        assertEquals("Days: 1   Hours: 5   Minutes: 59   Seconds: 20", result);
    }

    @Test
    public void testUpdateList(){
        LocalDateTime now = LocalDateTime.now();

        // 5 dumy objects that will be tested for sorting/filtering
        Todo item1 = todoService.addTodo("Test Item 1: car", 1, now.plusHours(1));
        Todo item2 = todoService.addTodo("Test Item 2: car", 1, now.plusHours(3));
        Todo item3 = todoService.addTodo("Test Item 3: car", 2, null);
        Todo item4 = todoService.addTodo("Test Item 4: truck", 0, null);
        Todo item5 = todoService.addTodo("Test Item 5: truck", 3, null);

        // tests if query search fliter and priority filter both work
        List<Todo> result = todoService.updateList("car", 1, false, true);
        assertEquals(2, result.size());

        // tests to see if the sorting by due date in descending order works.
        result = todoService.updateList("car", 1, false, false);
        assertEquals(item2.getId(), result.get(0).getId());

        item3.setCompleted(true);
        item4.setCompleted(true);
        item5.setCompleted(true);

        // tests to see if query filter and completed filter work
        result = todoService.updateList("truck", 0, true, false);
        assertEquals(2, result.size());

        // test to see if all filters work together correctly
        result = todoService.updateList("truck", 3, true, false);
        assertEquals(1, result.size());
    }
}
