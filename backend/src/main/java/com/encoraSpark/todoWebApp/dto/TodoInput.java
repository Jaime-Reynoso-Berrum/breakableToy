package com.encoraSpark.todoWebApp.dto;

import java.time.LocalDateTime;

public class TodoInput {
    private String todoItem;
    private int priority;
    private String dueDate;

    public TodoInput(){}

    public String getTodoItem() {return todoItem;}
    public int getPriority() {return priority;}
    public String getDueDate() {return dueDate;}

    public void setTodoItem(String todoItem) {this.todoItem = todoItem;}
    public void setPriority(int priority) {this.priority = priority;}
}
