package com.encoraSpark.todoWebApp.model;

import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class Todo {

    @Size (max=120, message = "To do item can not pass 120 characters")
    private String todoItem;

    private UUID id;
    private int priority;
    private LocalDateTime creationDate;
    private LocalDateTime dueDate;
    private LocalDateTime doneDate;
    private boolean completed;

    public Todo(String todoItem, int priority, LocalDateTime dueDate) {
        this.id = UUID.randomUUID();
        this.todoItem = todoItem;
        this.priority = priority;
        this.creationDate = LocalDateTime.now();
        this.dueDate = dueDate;
        this.doneDate = null;
        this.completed = false;
    }

    //Getters
    public UUID getId() { return id;}
    public String getTodoItem() { return todoItem;}
    public int getPriority() { return priority;}
    public LocalDateTime getCreationDate() { return creationDate;}
    public LocalDateTime getDueDate() { return dueDate;}
    public LocalDateTime getDoneDate() { return doneDate;}
    public boolean isCompleted() { return completed;}

    //Setters
    public void setId(UUID id) { this.id = id; }
    public void setTodoItem(String todoItem) { this.todoItem = todoItem;}
    public void setPriority(int priority) { this.priority = priority;}
    public void setCreationDate(LocalDateTime creationDate) { this.creationDate = creationDate;}
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate;}
    public void setDoneDate(LocalDateTime doneDate) { this.doneDate = doneDate;}
    public void setCompleted(boolean completed) { this.completed = completed;}
}