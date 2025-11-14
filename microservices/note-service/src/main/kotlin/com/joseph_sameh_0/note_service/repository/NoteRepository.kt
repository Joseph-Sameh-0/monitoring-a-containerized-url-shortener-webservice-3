package com.joseph_sameh_0.note_service.repository

import com.joseph_sameh_0.note_service.entity.Note
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface NoteRepository : JpaRepository<Note, Long> {
    fun findByShortCode(shortCode: String): Note?
    fun findByUsername(username: String): List<Note>
}
