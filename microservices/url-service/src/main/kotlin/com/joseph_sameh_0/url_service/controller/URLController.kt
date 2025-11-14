package com.joseph_sameh_0.url_service.controller

import com.joseph_sameh_0.url_service.dto.UrlShortenRequest
import com.joseph_sameh_0.url_service.dto.UrlShortenResponse
import com.joseph_sameh_0.url_service.dto.UrlDBEntry
import com.joseph_sameh_0.url_service.service.URLService
import jakarta.validation.Valid
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
class URLController(
    private val urlService: URLService
) {

    @PostMapping("/shorten")
    fun shortenUrl(
        @Valid @RequestBody request: UrlShortenRequest,
        authentication: Authentication?
    ): UrlShortenResponse {
        println("URL Shorten - Authentication object: $authentication")
        println("URL Shorten - Authentication principal: ${authentication?.principal}")
        println("URL Shorten - Authentication name: ${authentication?.name}")
        
        val username = when (val principal = authentication?.principal) {
            is org.springframework.security.core.userdetails.UserDetails -> principal.username
            is String -> principal
            else -> null
        }
        
        println("URL Shorten - Extracted username: $username")
        return urlService.shortenUrl(request, username)
    }

    @GetMapping("/{shortCode}")
    fun redirectToOriginal(@PathVariable shortCode: String): ResponseEntity<Void> {
        val longUrl = urlService.redirectToOriginal(shortCode)
        val headers = HttpHeaders()
        headers.add("Location", longUrl)
        return ResponseEntity(headers, HttpStatus.TEMPORARY_REDIRECT)
    }

    @GetMapping("/admin/urls")
    fun getAllUrls(): List<UrlDBEntry> {
        return urlService.getAllUrls()
    }

    @GetMapping("/api/urls/my-urls")
    fun getMyUrls(authentication: Authentication): List<UrlDBEntry> {
        val username = authentication.name
        println("Get My URLs - Username from auth: $username")
        val urls = urlService.getUserUrls(username)
        println("Get My URLs - Found ${urls.size} URLs for user: $username")
        return urls
    }
}
