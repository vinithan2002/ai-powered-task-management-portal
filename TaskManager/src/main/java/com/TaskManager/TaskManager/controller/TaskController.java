package com.TaskManager.TaskManager.controller;

import com.TaskManager.TaskManager.dto.AiTaskResponse;
import com.TaskManager.TaskManager.dto.TaskRequest;
import com.TaskManager.TaskManager.dto.TaskResponse;
import com.TaskManager.TaskManager.dto.TaskStatusRequest;
import com.TaskManager.TaskManager.entity.TaskStatus;
import com.TaskManager.TaskManager.entity.Users;
import com.TaskManager.TaskManager.service.Task.TaskServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskServiceImpl taskService;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Users user = (Users) auth.getPrincipal(); // since Users implements UserDetails
        return user.getId();
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody TaskRequest request) {

        TaskResponse response = taskService.createTask(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/generate")
    public ResponseEntity<AiTaskResponse> suggestTaskDetails(@RequestParam String title) {
        try {
            AiTaskResponse suggestions = taskService.generateTaskSuggestions(title);
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            // Graceful fallback
            AiTaskResponse fallback = new AiTaskResponse();
            fallback.setDescription("AI service unavailable. Please add description manually.");
            fallback.setPriority("MEDIUM");
            fallback.setEstimatedTime(2);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(fallback);
        }
    }

    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getAllTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String[] sort) {

        Sort.Direction direction = sort[0].endsWith("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String property = sort[0].replace(",desc", "").replace(",asc", "");
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, property));

        Page<TaskResponse> tasks = taskService.getAllTasks(pageable);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id)
    {
        TaskResponse taskResponse = taskService.getTaskById(id);
        return  ResponseEntity.ok(taskResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @RequestBody TaskRequest request) {

        TaskResponse response = taskService.updateTask(id, request);

        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok("Task deleted successfully");
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody TaskStatusRequest request) {

        return ResponseEntity.ok(taskService.updateTaskStatus(id, request.getStatus()));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TaskResponse>> getTasksByStatus(
            @PathVariable TaskStatus status) {

        return ResponseEntity.ok(
                taskService.getTasksByStatus(status));
    }

    @GetMapping("/search")
    public ResponseEntity<List<TaskResponse>> searchTasks(
            @RequestParam String title) {

        return ResponseEntity.ok(taskService.searchTasks(title));
    }


}
