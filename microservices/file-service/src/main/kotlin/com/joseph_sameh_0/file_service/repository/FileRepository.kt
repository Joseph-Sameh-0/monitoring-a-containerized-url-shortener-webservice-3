package com.joseph_sameh_0.file_service.repository

import com.joseph_sameh_0.file_service.entity.FileEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface FileRepository : JpaRepository<FileEntity, Long> {
    fun findByShortCode(shortCode: String): FileEntity?
    fun findByUsername(username: String): List<FileEntity>
}
