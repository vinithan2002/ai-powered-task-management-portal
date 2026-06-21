AI-Powered Task Management Portal
Overview

The AI-Powered Task Management Portal is a full-stack web application developed using Spring Boot, React, MySQL, JWT Authentication, and Ollama AI. The application enables users to manage tasks efficiently while leveraging AI to automate task creation.

Users can register, log in securely, create and manage tasks, update task status, search and filter tasks, and generate task details automatically using AI.

Features
Authentication Module
User Registration
User Login
Password Encryption using BCrypt
JWT Token Generation
Protected APIs using Spring Security
Task Management Module
Create Tasks
View All Tasks
View Task by ID
Update Tasks
Delete Tasks
Update Task Status
Search Tasks by Title
Filter Tasks by Status
AI-Powered Task Generation

The application integrates with Ollama AI (Llama 3) to automatically generate:

Task Description
Suggested Priority
Estimated Completion Effort

Example:

Input:

Learn Spring Security

Generated Output:

Description: Learn authentication, authorization, and JWT implementation using Spring Security.
Priority: HIGH
Estimated Time: 8 Hours
Technology Stack
Backend
Java 21
Spring Boot
Spring Security
Spring Data JPA
Hibernate
JWT Authentication
Lombok
ModelMapper
Frontend
React
Vite
Axios
HTML
CSS
Database
MySQL
AI Integration
Ollama
Llama 3
Tools
IntelliJ IDEA
MySQL Workbench
Postman
Git
GitHub
Project Architecture

Backend follows a layered architecture:

Controller Layer
↓
Service Layer
↓
Repository Layer
↓
Database

Additional Layers:

Entity
DTO
Security
Configuration

This architecture improves maintainability, scalability, and code organization.

API Endpoints
Authentication

POST /register

POST /login

Tasks

POST /api/tasks

GET /api/tasks

GET /api/tasks/{id}

PUT /api/tasks/{id}

DELETE /api/tasks/{id}

PATCH /api/tasks/{id}/status

GET /api/tasks/search?title={title}

GET /api/tasks/filter?status={status}

AI Task Generation

POST /api/tasks/generate?userId={userId}&title={title}

Database Schema
Users Table
Column	Type
id	BIGINT
username	VARCHAR
password	VARCHAR
role	VARCHAR
Tasks Table
Column	Type
id	BIGINT
title	VARCHAR
description	TEXT
priority	VARCHAR
status	VARCHAR
estimated_time	INT
created_at	DATETIME
updated_at	DATETIME
AI Workflow
User enters a task title.
Backend sends the title to Ollama AI.
Ollama generates:
Description
Priority
Estimated Time
Spring Boot parses the AI response.
Generated task is stored in MySQL.
Task details are returned to the user.
Security
JWT-based Authentication
Password Encryption using BCrypt
Protected REST APIs
Role-ready architecture for future enhancements
Challenges Faced
Implementing JWT Authentication and Authorization
Handling CORS between React and Spring Boot
Integrating Ollama AI with Spring Boot
Parsing AI-generated JSON responses
Managing Entity Relationships and Database Mappings
Future Enhancements
Role-Based Access Control (Admin/User)
Docker Containerization
Blockchain Audit Trail
Task Notifications
Pagination
Swagger/OpenAPI Documentation
Unit and Integration Testing
Setup Instructions
Backend
Clone the repository
Configure MySQL database
Update application.properties
Run:

mvn clean install

mvn spring-boot

Frontend
Navigate to frontend directory

npm install

npm run dev

Ollama

Install Ollama and pull Llama 3:

ollama pull llama3

Start Ollama:

ollama serve

Demo Highlights
User Registration and Login
JWT Authentication
CRUD Operations on Tasks
Search and Filter Functionality
AI-Powered Task Generation using Ollama
Database Integration with MySQL

Demo Video:
https://drive.google.com/file/d/1DifgkNRb3oSzxPOMTmKYxSJ8pKkk6oZj/view?usp=drive_link

Author
Vinith A N
