package com.joseph_sameh_0.url_service.service

import com.joseph_sameh_0.url_service.dto.UrlShortenRequest
import com.joseph_sameh_0.url_service.dto.UrlShortenResponse
import com.joseph_sameh_0.url_service.dto.UrlDBEntry
import com.joseph_sameh_0.url_service.entity.LookupFailure
import com.joseph_sameh_0.url_service.entity.URL
import com.joseph_sameh_0.url_service.repository.LookupFailureRepository
import com.joseph_sameh_0.url_service.repository.URLRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import org.springframework.http.HttpStatus
import kotlin.random.Random

@Service
class URLService(
    private val urlRepository: URLRepository,
    private val lookupFailureRepository: LookupFailureRepository,
    @Value("\${app.base-url:http://localhost:9002}") private val baseUrl: String
) {

    private val characters = ('a'..'z') + ('A'..'Z') + ('0'..'9')

    fun generateShortCode(length: Int = 6): String {
        return (1..length)
            .map { Random.nextInt(0, characters.size) }
            .map(characters::get)
            .joinToString("")
    }

    fun shortenUrl(request: UrlShortenRequest, username: String? = null): UrlShortenResponse {
        var shortCode = generateShortCode()
        
        while (urlRepository.findByShortCode(shortCode) != null) {
            shortCode = generateShortCode()
        }

        println("URLService - Saving URL with username: $username")
        val url = URL(
            shortCode = shortCode,
            longUrl = request.long_url,
            username = username
        )

        val savedUrl = urlRepository.save(url)
        println("URLService - Saved URL with username: ${savedUrl.username}, shortCode: ${savedUrl.shortCode}")

        return UrlShortenResponse(
            long_url = savedUrl.longUrl,
            short_url = "$baseUrl/${savedUrl.shortCode}"
        )
    }

    fun redirectToOriginal(shortCode: String): String {
        val url = urlRepository.findByShortCode(shortCode)
            ?: run {
                lookupFailureRepository.save(LookupFailure())
                throw ResponseStatusException(HttpStatus.NOT_FOUND, "Short URL not found")
            }

        url.clicks++
        urlRepository.save(url)
        return url.longUrl
    }

    fun getAllUrls(): List<UrlDBEntry> {
        return urlRepository.findAll().map { url ->
            UrlDBEntry(
                id = url.id ?: 0,
                short_code = url.shortCode,
                long_url = url.longUrl,
                clicks = url.clicks,
                created_at = url.createdAt.toString()
            )
        }
    }

    fun getUserUrls(username: String): List<UrlDBEntry> {
        println("URLService - Finding URLs for username: $username")
        val urls = urlRepository.findByUsername(username)
        println("URLService - Found ${urls.size} URLs for username: $username")
        urls.forEach { url ->
            println("  - URL id=${url.id}, shortCode=${url.shortCode}, username=${url.username}")
        }
        return urls.map { url ->
            UrlDBEntry(
                id = url.id ?: 0,
                short_code = url.shortCode,
                long_url = url.longUrl,
                clicks = url.clicks,
                created_at = url.createdAt.toString()
            )
        }
    }

    fun getTotalUrlsCount(): Long = urlRepository.count()
    
    fun getTotalClicks(): Long = urlRepository.getTotalClicks()
    
    fun getTotalLookupFailures(): Long = lookupFailureRepository.count()
}
