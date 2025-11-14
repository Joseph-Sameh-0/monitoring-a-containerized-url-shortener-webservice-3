package com.joseph_sameh_0.auth_service.service

import com.joseph_sameh_0.auth_service.dto.AuthResponse
import com.joseph_sameh_0.auth_service.dto.LoginRequest
import com.joseph_sameh_0.auth_service.dto.RegisterRequest
import com.joseph_sameh_0.auth_service.entity.User
import com.joseph_sameh_0.auth_service.repository.UserRepository
import com.joseph_sameh_0.auth_service.security.JwtTokenProvider
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider,
    private val authenticationManager: AuthenticationManager
) {
    
    private val logger = LoggerFactory.getLogger(AuthService::class.java)

    fun register(request: RegisterRequest): AuthResponse {
        logger.debug("Registering user: ${request.username}")
        
        // Check if username already exists
        if (userRepository.existsByUsername(request.username)) {
            logger.warn("Registration failed: Username ${request.username} already exists")
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists")
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.email)) {
            logger.warn("Registration failed: Email ${request.email} already exists")
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists")
        }

        // Create new user
        val user = User(
            username = request.username,
            email = request.email,
            password = passwordEncoder.encode(request.password)
        )

        userRepository.save(user)
        logger.info("User registered successfully: ${request.username}")

        // Generate JWT token
        val token = jwtTokenProvider.generateToken(user.username)

        return AuthResponse(
            token = token,
            username = user.username,
            email = user.email
        )
    }

    fun login(request: LoginRequest): AuthResponse {
        logger.debug("Attempting login for user: ${request.username}")
        
        try {
            // Authenticate user
            authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(request.username, request.password)
            )
            
            logger.debug("Authentication successful for user: ${request.username}")
        } catch (ex: Exception) {
            logger.warn("Authentication failed for user: ${request.username}", ex)
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials")
        }

        // Get user details
        val user = userRepository.findByUsername(request.username)
            .orElseThrow { 
                logger.error("User not found after successful authentication: ${request.username}")
                ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials") 
            }

        // Generate JWT token
        val token = jwtTokenProvider.generateToken(user.username)
        
        logger.info("Login successful for user: ${request.username}")

        return AuthResponse(
            token = token,
            username = user.username,
            email = user.email
        )
    }
}
