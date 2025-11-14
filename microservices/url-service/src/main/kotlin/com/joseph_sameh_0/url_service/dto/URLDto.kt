package com.joseph_sameh_0.url_service.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import org.hibernate.validator.constraints.URL as URLValidator

data class UrlShortenRequest(
    @field:NotBlank(message = "URL cannot be blank")
    @field:Size(max = 512, message = "URL cannot exceed 512 characters")
    @field:URLValidator(message = "Must be a valid HTTP/HTTPS URL")
    val long_url: String
)

data class UrlShortenResponse(
    val long_url: String,
    val short_url: String
)

data class UrlDBEntry(
    val id: Long,
    val short_code: String,
    val long_url: String,
    val clicks: Int,
    val created_at: String
)
