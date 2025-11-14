package com.joseph_sameh_0.file_service.controller

import com.joseph_sameh_0.file_service.dto.FileInfoDto
import com.joseph_sameh_0.file_service.dto.FileUploadResponse
import com.joseph_sameh_0.file_service.service.FileService
import org.springframework.core.io.Resource
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/files")
class FileController(
    private val fileService: FileService
) {

    @PostMapping("/upload")
    fun uploadFile(
        @RequestParam("file") file: MultipartFile,
        authentication: Authentication
    ): ResponseEntity<FileUploadResponse> {
        val username = authentication.name
        val response = fileService.uploadFile(file, username)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/my-files")
    fun getMyFiles(authentication: Authentication): ResponseEntity<List<FileInfoDto>> {
        val username = authentication.name
        val files = fileService.getUserFiles(username)
        return ResponseEntity.ok(files)
    }
}

@RestController
class FileDownloadController(
    private val fileService: FileService
) {

    @GetMapping("/f/{shortCode}")
    fun downloadFile(@PathVariable shortCode: String): ResponseEntity<Resource> {
        val (resource, fileEntity) = fileService.downloadFile(shortCode)

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(fileEntity.contentType))
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                "inline; filename=\"${fileEntity.originalFilename}\""
            )
            .body(resource)
    }
}
