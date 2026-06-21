package com.TaskManager.TaskManager.dto;

import lombok.Data;

@Data
public class AiTaskResponse {
    private String description;
    private String priority;
    private  Integer estimatedTime;
}
