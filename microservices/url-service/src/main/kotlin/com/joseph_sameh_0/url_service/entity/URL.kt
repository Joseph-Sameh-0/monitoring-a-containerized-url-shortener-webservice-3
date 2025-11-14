package com.joseph_sameh_0.url_service.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "urls")
data class URL(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(unique = true, nullable = false, length = 10)
    var shortCode: String,

    @Column(nullable = false, length = 512)
    var longUrl: String,

    @Column(nullable = true, length = 100)
    var username: String? = null,

    @Column(nullable = false)
    var clicks: Int = 0,

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
