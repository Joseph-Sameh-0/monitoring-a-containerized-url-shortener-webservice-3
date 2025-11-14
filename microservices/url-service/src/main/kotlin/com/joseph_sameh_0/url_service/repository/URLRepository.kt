package com.joseph_sameh_0.url_service.repository

import com.joseph_sameh_0.url_service.entity.URL
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface URLRepository : JpaRepository<URL, Long> {
    fun findByShortCode(shortCode: String): URL?
    fun findByUsername(username: String): List<URL>
    
    @Query("SELECT COALESCE(SUM(u.clicks), 0) FROM URL u")
    fun getTotalClicks(): Long
}
