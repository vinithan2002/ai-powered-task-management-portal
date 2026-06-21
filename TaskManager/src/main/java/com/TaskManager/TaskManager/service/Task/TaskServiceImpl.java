package com.TaskManager.TaskManager.service.Task;

import com.TaskManager.TaskManager.dto.AiTaskResponse;
import com.TaskManager.TaskManager.dto.OllamaResponse;
import com.TaskManager.TaskManager.dto.TaskRequest;
import com.TaskManager.TaskManager.dto.TaskResponse;
import com.TaskManager.TaskManager.entity.Priority;
import com.TaskManager.TaskManager.entity.TaskStatus;
import com.TaskManager.TaskManager.entity.Tasks;
import com.TaskManager.TaskManager.repository.TaskRepo;
import com.TaskManager.TaskManager.repository.UserDetailsRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService{

    private final ModelMapper modelMapper;
    private final TaskRepo taskRepo;
    private final UserDetailsRepository userDetailsRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TaskResponse createTask(TaskRequest request) {
        Tasks tasks =modelMapper.map(request, Tasks.class);
        Tasks savedTask = taskRepo.save(tasks);
        return modelMapper.map(savedTask, TaskResponse.class);
    }

    @Value("${ollama.url:http://localhost:11434/api/generate}")
    private String ollamaUrl;

    @Value("${ollama.model:llama3}")
    private String ollamaModel;


    public Page<TaskResponse> getAllTasks(Pageable pageable) {
        Page<Tasks> taskPage = taskRepo.findAll(pageable);
        return taskPage.map(task -> modelMapper.map(task, TaskResponse.class));
    }

    public TaskResponse getTaskById(Long id) {
        Tasks task = taskRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Task not found with id: " + id));

        return modelMapper.map(task, TaskResponse.class);
    }


    public TaskResponse updateTask(Long id, TaskRequest request) {

        Tasks task = taskRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Task not found with id: " + id));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(TaskStatus.valueOf(request.getStatus()));
        task.setPriority(Priority.valueOf(request.getPriority()));
        task.setEstimatedTime(request.getEstimatedTime());

        Tasks updatedTask = taskRepo.save(task);

        return modelMapper.map(updatedTask, TaskResponse.class);
    }

    public void deleteTask(Long id) {
        taskRepo.deleteById(id);
    }

    public TaskResponse updateTaskStatus(Long id, TaskStatus status) {

        Tasks task = taskRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Task not found with id: " + id));

        task.setStatus(status);

        task.setUpdatedAt(LocalDateTime.now());

        Tasks updatedTask = taskRepo.save(task);

        return modelMapper.map(updatedTask, TaskResponse.class);
    }


    public List<TaskResponse> getTasksByStatus(TaskStatus status) {

        List<Tasks> tasks = taskRepo.findByStatus(status);

        return tasks.stream()
                .map(task -> modelMapper.map(task, TaskResponse.class))
                .toList();
    }

    public List<TaskResponse> searchTasks(String title) {

        List<Tasks> tasks = taskRepo.findByTitleContainingIgnoreCase(title);

        return tasks.stream()
                .map(task -> modelMapper.map(task, TaskResponse.class))
                .toList();
    }

    public AiTaskResponse generateTaskSuggestions(String title) throws Exception {
        String prompt = """
                You are a task management assistant.
                
                Given the task title, generate:
                - A short description
                - Priority (LOW, MEDIUM, or HIGH)
                - Estimated time in hours
                
                Return ONLY valid JSON in this exact format:
                {
                    "description": "string",
                    "priority": "MEDIUM",
                    "estimatedTime": 4
                }
                
                Task Title: """ + title;

        Map<String, Object> request = new HashMap<>();
        request.put("model", ollamaModel);
        request.put("prompt", prompt);
        request.put("stream", false);
        request.put("format", "json");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        HttpEntity<OllamaResponse> response = restTemplate.exchange(
                ollamaUrl,
                org.springframework.http.HttpMethod.POST,
                entity,
                OllamaResponse.class);

        String json = response.getBody().getResponse();
        System.out.println("OLLAMA SUGGESTION: " + json);

        return objectMapper.readValue(json, AiTaskResponse.class);
    }
}
