package com.joseph_sameh_0.auth_service.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(unique = true, nullable = false, length = 100)
    var username: String,

    @Column(unique = true, nullable = false, length = 255)
    var email: String,

    @Column(nullable = false)
    var password: String,

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
