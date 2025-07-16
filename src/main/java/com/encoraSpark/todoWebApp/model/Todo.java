package com.encoraSpark.todoWebApp.model;

import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public class Todo {
    private UUID id;

    @Size (max=120, message = "To do item can not pass 120 characters")
    private String todoItem;

    private String priority;
    private LocalDate creationDate;
    private LocalDate dueDate;
    private LocalDate doneDate;
    private boolean completed;

    public Todo(String todoItem, String priority, LocalDate dueDate) {
        this.id = UUID.randomUUID();
        this.todoItem = todoItem;
        this.priority = priority;
        this.creationDate = LocalDate.now();
        this.dueDate = dueDate;
        this.doneDate = null;
        this.completed = false;
    }

    //Getters
    public UUID getId() { return id;}
    public String getTodoItem() { return todoItem;}
    public String getPriority() { return priority;}
    public LocalDate getCreationDate() { return creationDate;}
    public LocalDate getDueDate() { return dueDate;}
    public LocalDate getDoneDate() { return doneDate;}
    public boolean isCompleted() { return completed;}

    //Setters
    public void setId(UUID id) { this.id = id; }
    public void setTodoItem(String todoItem) { this.todoItem = todoItem;}
    public void setPriority(String priority) { this.priority = priority;}
    public void setCreationDate(LocalDate creationDate) { this.creationDate = creationDate;}
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate;}
    public void setDoneDate(LocalDate doneDate) { this.doneDate = doneDate;}
    public void setCompleted(boolean completed) { this.completed = completed;}
}