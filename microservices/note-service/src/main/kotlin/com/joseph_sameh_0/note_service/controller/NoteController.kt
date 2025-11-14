package com.joseph_sameh_0.note_service.controller

import com.joseph_sameh_0.note_service.dto.NoteInfoDto
import com.joseph_sameh_0.note_service.dto.NoteSaveRequest
import com.joseph_sameh_0.note_service.dto.NoteSaveResponse
import com.joseph_sameh_0.note_service.dto.NoteViewDto
import com.joseph_sameh_0.note_service.service.NoteService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/notes")
class NoteController(
    private val noteService: NoteService
) {

    @PostMapping("/save")
    fun saveNote(
        @Valid @RequestBody request: NoteSaveRequest,
        authentication: Authentication
    ): ResponseEntity<NoteSaveResponse> {
        val username = authentication.name
        val response = noteService.saveNote(request, username)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/my-notes")
    fun getMyNotes(authentication: Authentication): ResponseEntity<List<NoteInfoDto>> {
        val username = authentication.name
        val notes = noteService.getUserNotes(username)
        return ResponseEntity.ok(notes)
    }
}

@RestController
class NoteViewController(
    private val noteService: NoteService
) {

    @GetMapping("/n/{shortCode}")
    fun viewNote(@PathVariable shortCode: String): ResponseEntity<NoteViewDto> {
        val note = noteService.viewNote(shortCode)
        return ResponseEntity.ok(note)
    }
}
