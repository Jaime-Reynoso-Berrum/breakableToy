package com.encoraSpark.todoWebApp.dto;

import java.time.LocalDateTime;

public class TodoEdit {
    private String todoItem;
    private int priority;
    private String dueDate;
    private Boolean deleted;

    public TodoEdit(){}

    public String getTodoItem() {return todoItem;}
    public int getPriority() {return priority;}
    public boolean getDeleted() {return deleted;}

    public LocalDateTime getDueDate() {
        LocalDateTime formattedDueDate = null;
        if (dueDate != null || dueDate != "") {
            formattedDueDate = LocalDateTime.parse(dueDate);
            return formattedDueDate;

        }
        return null;
    }
}
