package com.encoraSpark.todoWebApp.dto;

import java.time.LocalDateTime;

public class TodoInput {
    private String todoItem;
    private int priority;
    private String dueDate;

    public TodoInput(){}

    public String getTodoItem() {return todoItem;}
    public int getPriority() {return priority;}

    public LocalDateTime getDueDate() {
        LocalDateTime formattedDueDate = null;
        if (dueDate != null) {
            formattedDueDate = LocalDateTime.parse(dueDate);
        }
        return formattedDueDate;
    }

}
