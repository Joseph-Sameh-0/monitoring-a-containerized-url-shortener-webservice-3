package com.joseph_sameh_0.file_service.dto

data class FileUploadResponse(
    val short_url: String,
    val original_filename: String,
    val file_size: Long,
    val content_type: String
)

data class FileInfoDto(
    val id: Long,
    val short_code: String,
    val short_url: String,
    val original_filename: String,
    val content_type: String,
    val file_size: Long,
    val downloads: Int,
    val created_at: String
)
