package com.TaskManager.TaskManager.repository;

import com.TaskManager.TaskManager.entity.TaskStatus;
import com.TaskManager.TaskManager.entity.Tasks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepo extends JpaRepository<Tasks, Long> {

    List<Tasks> findByStatus(TaskStatus status);

    List<Tasks> findByTitleContainingIgnoreCase(String title);
}