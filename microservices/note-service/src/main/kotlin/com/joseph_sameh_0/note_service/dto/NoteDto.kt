package com.joseph_sameh_0.note_service.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class NoteSaveRequest(
    @field:NotBlank(message = "Title is required")
    @field:Size(max = 200, message = "Title cannot exceed 200 characters")
    val title: String,

    @field:NotBlank(message = "Content is required")
    val content: String
)

data class NoteSaveResponse(
    val short_url: String,
    val title: String,
    val content_preview: String
)

data class NoteViewDto(
    val title: String,
    val content: String,
    val created_at: String
)

data class NoteInfoDto(
    val id: Long,
    val short_code: String,
    val short_url: String,
    val title: String,
    val content: String,
    val views: Int,
    val created_at: String
)
