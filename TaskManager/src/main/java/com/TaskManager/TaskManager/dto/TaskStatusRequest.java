package com.TaskManager.TaskManager.dto;

import com.TaskManager.TaskManager.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatusRequest {
    private TaskStatus status;
}
