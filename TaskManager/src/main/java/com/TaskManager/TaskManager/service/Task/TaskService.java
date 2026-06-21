package com.TaskManager.TaskManager.service.Task;

import com.TaskManager.TaskManager.dto.TaskResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaskService {
    Page<TaskResponse> getAllTasks(Pageable pageable);
}
