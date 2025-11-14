package com.joseph_sameh_0.file_service.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "files")
data class FileEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(unique = true, nullable = false, length = 10)
    var shortCode: String,

    @Column(nullable = false)
    var originalFilename: String,

    @Column(nullable = false)
    var storedFilename: String,

    @Column(nullable = false)
    var contentType: String,

    @Column(nullable = false)
    var fileSize: Long,

    @Column(nullable = true, length = 100)
    var username: String? = null,

    @Column(nullable = false)
    var downloads: Int = 0,

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
