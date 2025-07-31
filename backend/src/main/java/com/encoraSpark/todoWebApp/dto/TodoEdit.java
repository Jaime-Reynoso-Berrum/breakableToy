package com.encoraSpark.todoWebApp.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;

public class TodoEdit {
    private String todoItem;
    private int priority;
    private String dueDate;
    private boolean deleted;

    public TodoEdit(){}

    public String getTodoItem() {return todoItem;}
    public int getPriority() {return priority;}
    public boolean getDeleted() {return deleted;}

    public LocalDateTime getDueDate() {
        try {
            return LocalDateTime.parse(dueDate);
        } catch (DateTimeParseException e){
            return null;
        }
    }

    public void setTodoItem(String todoItem) {this.todoItem = todoItem;}
    public void setPriority(int priority) {this.priority = priority;}
    public void setDeleted(boolean deleted) {this.deleted = deleted;}

    public void setDueDate(String dueDate) {
        if (dueDate == null || dueDate.trim().isEmpty()) {
            this.dueDate = null;
        }
        this.dueDate = dueDate;}
}
