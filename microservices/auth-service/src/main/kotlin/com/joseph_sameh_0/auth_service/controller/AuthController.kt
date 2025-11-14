package com.joseph_sameh_0.auth_service.controller

import com.joseph_sameh_0.auth_service.dto.AuthResponse
import com.joseph_sameh_0.auth_service.dto.LoginRequest
import com.joseph_sameh_0.auth_service.dto.RegisterRequest
import com.joseph_sameh_0.auth_service.service.AuthService
import jakarta.validation.Valid
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService
) {
    
    private val logger = LoggerFactory.getLogger(AuthController::class.java)

    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<AuthResponse> {
        logger.info("Registration request received for username: ${request.username}")
        val response = authService.register(request)
        logger.info("Registration successful for username: ${request.username}")
        return ResponseEntity.ok(response)
    }

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<AuthResponse> {
        logger.info("Login request received for username: ${request.username}")
        val response = authService.login(request)
        logger.info("Login successful for username: ${request.username}")
        return ResponseEntity.ok(response)
    }
}
