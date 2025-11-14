package com.joseph_sameh_0.url_service.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "lookup_failures")
data class LookupFailure(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    val timestamp: LocalDateTime = LocalDateTime.now()
)
