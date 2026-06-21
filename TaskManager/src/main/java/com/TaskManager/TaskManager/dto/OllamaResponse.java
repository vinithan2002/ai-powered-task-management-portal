package com.TaskManager.TaskManager.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OllamaResponse {
    private String model;
    private String created_at;
    private String response;
    private Boolean done;
}
