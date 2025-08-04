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
    public void testAddTodo() {
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
    public void testDeleteTodo() {
        Todo toBeDeleted = todoService.addTodo("Delete TodoItem test", 0, LocalDateTime.now());
        UUID id = toBeDeleted.getId();

        // Deletes the todoItem and verifies that it is not in the HashMap
        Todo deletion = todoService.editTodo(id, null, 0, null, true);
        assertNull(deletion);
        assertFalse(todoService.getTodoMap().containsKey(id));
    }

    @Test
    public void testEditTodo() {
        // original todo item
        String testString = "Update TodoItem Test: Did the fields update correctly";
        int priority = 0;
        LocalDateTime dueDate = LocalDateTime.now().plusDays(3);
        Todo testTodo = todoService.addTodo(testString, priority, dueDate);

        // new values to update todo item
        String updatedString = "Did the fields update correctly";
        int updatedPriority = 1;
        LocalDateTime updatedDueDate = LocalDateTime.now().plusDays(5);

        // creating and testing the updated todo item
        todoService.editTodo(testTodo.getId(), updatedString, updatedPriority, updatedDueDate, false);

        assertNotNull(testTodo);
        assertEquals(updatedString, testTodo.getTodoItem());
        assertEquals(updatedPriority, testTodo.getPriority());
        assertEquals(updatedDueDate, testTodo.getDueDate());
    }

    @Test
    public void testCompleteTodoItem() {
        String testString = "Complete a TodoItem Test";
        int priority = 1;
        Todo testItem = todoService.addTodo(testString, priority, null);
        testItem.setCreationDate(LocalDateTime.now().minusDays(3));

        // Completes the todo and verifies that it is marked complete
        todoService.completeTodoItem(testItem.getId());
        assertTrue(testItem.isCompleted());
        assertNotNull(testItem.getDoneDate());

        // Tests if time completion is added to highTimeCompletion
        // and checks if highCompletedCount is incremented
        Duration duration = Duration.between(testItem.getCreationDate(), testItem.getDoneDate());
        assertEquals(duration, todoService.getHighTimeCompletion());
        assertEquals(1, todoService.getHighCompletedCount());
    }

    @Test
    public void testUndoCompleteTodoItem() {
        String testString = "Undo TodoItem Test";
        int priority = 2;
        Todo testItem = todoService.addTodo(testString, priority, null);
        testItem.setCreationDate(LocalDateTime.now().minusDays(3));

        //completes todo and grabs duration time
        todoService.completeTodoItem(testItem.getId());
        Duration duration = Duration.between(testItem.getCreationDate(), testItem.getDoneDate());

        // undos completing the todo and verifies that it is marked not complete
        Todo undoComplete = todoService.undoCompleteTodoItem(testItem.getId());
        assertFalse(undoComplete.isCompleted());
        assertNull(undoComplete.getDoneDate());

        // Tests if time durationo time is subtracted from TotalTimeCompletion
        // and checks if completedCount is reduced by 1
        assertEquals(Duration.ZERO, todoService.getMediumTimeCompletion());
        assertEquals(0, todoService.getMediumCompletedCount());
    }

    @Test
    public void testGetAvgTimeCompletion() {
        LocalDateTime testTime = LocalDateTime.now();

        // created 10 nodes of each priority and marks them completed
        for (int i = 1; i <= 30; i++) {
            String testString = "Add Me to the List: #" + i;
            int priority;

            if (i <= 10) priority = 1;
            else if (i <= 20) priority = 2;
            else priority = 3;

            Todo testItem = todoService.addTodo(testString, priority, null);

            if (i <= 10) testItem.setCreationDate(testTime.minusDays(i));
            else if (i <= 20) testItem.setCreationDate(testTime.minusHours(i));
            else testItem.setCreationDate(testTime.minusMinutes(i));

            todoService.completeTodoItem(testItem.getId());
        }

        // times calculated using a time calculator
        String correctOverall = "Days: 2   Hours: 1   Minutes: 18   Seconds: 30";
        String correctHigh = "Days: 5   Hours: 12   Minutes: 0   Seconds: 0";
        String correctMedium = "Days: 0   Hours: 15   Minutes: 30   Seconds: 0";
        String correctLow = "Days: 0   Hours: 0   Minutes: 25   Seconds: 30";

        String[] expected = {correctOverall, correctHigh, correctMedium, correctLow};
        String[] results = todoService.getAvgCompletionTime();

        for (int i = 0; i < expected.length; i++) {
            assertEquals(expected[i], results[i]);
        }
    }

    @Test
    public void testFilterTodos(){
        LocalDateTime testTime = LocalDateTime.now();
        List<Todo> results;

        // created 30 todos
        for (int i = 1; i <= 30; i++){
            String testString = "Add Me to the List: #" + i;
            int priority;

            // 10 todos for each priority
            if (i % 3 == 0) priority = 1;
            else if (i % 3 == 1) priority = 2;
            else priority = 3;

            // different strings added for filter tests
            if ( i <= 16)      testString += "car";
            else if ( i <= 23) testString += "phone";
            else               testString += "honey";

            // 15 out of 30 will be marked completed
            Todo testItem = todoService.addTodo(testString, priority, null);
            if (i % 2 == 0) todoService.completeTodoItem(testItem.getId());
        }
        // tests if completed filter works alone
        results = todoService.getFilteredTodos("", 0, 1);
        assertEquals(15, results.size());

        // tests if query filter works alone
        results = todoService.getFilteredTodos("one", 0, 0);
        assertEquals(14, results.size());

        // tests if priority filter works alone
        results = todoService.getFilteredTodos("", 1, 0);
        assertEquals(10, results.size());

        // tests if all filters work together
        results = todoService.getFilteredTodos("car", 1, 1);
        assertEquals(2, results.size());
    }

    @Test
    public void testSortedTodoTodos(){
        LocalDateTime testTime = LocalDateTime.now();

        todoService.addTodo("Test Item 1", 2, testTime.plusHours(1));
        todoService.addTodo("Test Item 2", 1, testTime.plusHours(3));
        todoService.addTodo("Test Item 3", 1, testTime.plusHours(2));
        todoService.addTodo("Test Item 4", 3, testTime.plusHours(4));
        todoService.addTodo("Test Item 5", 2, null);

        List<Todo> origialList = todoService.getOriginalList();

        //descending by due date, then priority
        List<Todo> sorted = todoService.sortedTodos(origialList, false, true);
        assertEquals("Test Item 5", sorted.get(0).getTodoItem());
        assertEquals("Test Item 4", sorted.get(1).getTodoItem());
        assertEquals("Test Item 2", sorted.get(2).getTodoItem());
        assertEquals("Test Item 3", sorted.get(3).getTodoItem());
        assertEquals("Test Item 1", sorted.get(4).getTodoItem());

        // ascending by due date, then priority
        sorted = todoService.sortedTodos(origialList, true, true);
        assertEquals("Test Item 1", sorted.get(0).getTodoItem());
        assertEquals("Test Item 3", sorted.get(1).getTodoItem());
        assertEquals("Test Item 2", sorted.get(2).getTodoItem());
        assertEquals("Test Item 4", sorted.get(3).getTodoItem());
        assertEquals("Test Item 5", sorted.get(4).getTodoItem());

        //descending by priority, then due date
        sorted = todoService.sortedTodos(origialList, false, false);
        assertEquals("Test Item 4", sorted.get(0).getTodoItem());
        assertEquals("Test Item 5", sorted.get(1).getTodoItem());
        assertEquals("Test Item 1", sorted.get(2).getTodoItem());
        assertEquals("Test Item 2", sorted.get(3).getTodoItem());
        assertEquals("Test Item 3", sorted.get(4).getTodoItem());

        //descending by priority, then due date
        sorted = todoService.sortedTodos(origialList, true, false);
        assertEquals("Test Item 3", sorted.get(0).getTodoItem());
        assertEquals("Test Item 2", sorted.get(1).getTodoItem());
        assertEquals("Test Item 1", sorted.get(2).getTodoItem());
        assertEquals("Test Item 5", sorted.get(3).getTodoItem());
        assertEquals("Test Item 4", sorted.get(4).getTodoItem());
    }

}
