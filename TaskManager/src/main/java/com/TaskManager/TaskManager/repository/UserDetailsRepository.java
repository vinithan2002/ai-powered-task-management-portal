package com.TaskManager.TaskManager.repository;

import com.TaskManager.TaskManager.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserDetailsRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByUserName(String userName);

    boolean existsByUserName(String userName);

}
