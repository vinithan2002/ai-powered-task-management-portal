package com.TaskManager.TaskManager.dto;

import com.TaskManager.TaskManager.entity.Priority;
import com.TaskManager.TaskManager.entity.TaskStatus;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TaskRequest {
    private String title;
    private String description;
    private String status;
    private String priority;
    private Integer estimatedTime;
}
