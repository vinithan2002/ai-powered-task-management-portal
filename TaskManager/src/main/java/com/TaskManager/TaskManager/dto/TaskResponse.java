package com.TaskManager.TaskManager.dto;

import com.TaskManager.TaskManager.entity.Priority;
import com.TaskManager.TaskManager.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private Integer estimatedTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
