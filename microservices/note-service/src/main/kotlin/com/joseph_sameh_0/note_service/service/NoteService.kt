package com.joseph_sameh_0.note_service.service

import com.joseph_sameh_0.note_service.dto.NoteInfoDto
import com.joseph_sameh_0.note_service.dto.NoteSaveRequest
import com.joseph_sameh_0.note_service.dto.NoteSaveResponse
import com.joseph_sameh_0.note_service.dto.NoteViewDto
import com.joseph_sameh_0.note_service.entity.Note
import com.joseph_sameh_0.note_service.repository.NoteRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import kotlin.random.Random

@Service
class NoteService(
    private val noteRepository: NoteRepository,
    @Value("\${app.base-url:http://localhost:9004}") private val baseUrl: String
) {

    private val characters = ('a'..'z') + ('A'..'Z') + ('0'..'9')

    fun generateShortCode(length: Int = 6): String {
        return (1..length)
            .map { Random.nextInt(0, characters.size) }
            .map(characters::get)
            .joinToString("")
    }

    fun saveNote(request: NoteSaveRequest, username: String): NoteSaveResponse {
        var shortCode = generateShortCode()
        while (noteRepository.findByShortCode(shortCode) != null) {
            shortCode = generateShortCode()
        }

        val note = Note(
            shortCode = shortCode,
            content = request.content,
            title = request.title,
            username = username
        )

        noteRepository.save(note)

        val preview = if (request.content.length > 50) {
            request.content.substring(0, 50) + "..."
        } else {
            request.content
        }

        return NoteSaveResponse(
            short_url = "$baseUrl/n/$shortCode",
            title = request.title,
            content_preview = preview
        )
    }

    fun viewNote(shortCode: String): NoteViewDto {
        val note = noteRepository.findByShortCode(shortCode)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found")

        note.views++
        noteRepository.save(note)

        return NoteViewDto(
            title = note.title,
            content = note.content,
            created_at = note.createdAt.toString()
        )
    }

    fun getUserNotes(username: String): List<NoteInfoDto> {
        return noteRepository.findByUsername(username).map { note ->
            NoteInfoDto(
                id = note.id ?: 0,
                short_code = note.shortCode,
                short_url = "$baseUrl/n/${note.shortCode}",
                title = note.title,
                content = note.content,
                views = note.views,
                created_at = note.createdAt.toString()
            )
        }
    }
}
