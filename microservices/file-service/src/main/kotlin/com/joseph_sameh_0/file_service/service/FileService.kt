package com.joseph_sameh_0.file_service.service

import com.joseph_sameh_0.file_service.dto.FileInfoDto
import com.joseph_sameh_0.file_service.dto.FileUploadResponse
import com.joseph_sameh_0.file_service.entity.FileEntity
import com.joseph_sameh_0.file_service.repository.FileRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.server.ResponseStatusException
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.util.*
import kotlin.random.Random

@Service
class FileService(
    private val fileRepository: FileRepository,
    @Value("\${app.base-url:http://localhost:9003}") private val baseUrl: String,
    @Value("\${app.upload-dir:./uploads}") private val uploadDir: String
) {

    private val uploadPath: Path = Paths.get(uploadDir)
    private val characters = ('a'..'z') + ('A'..'Z') + ('0'..'9')

    init {
        try {
            Files.createDirectories(uploadPath)
        } catch (e: IOException) {
            throw RuntimeException("Could not create upload directory!", e)
        }
    }

    fun uploadFile(file: MultipartFile, username: String): FileUploadResponse {
        if (file.isEmpty) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty")
        }

        val contentType = file.contentType ?: ""
        if (!isValidFileType(contentType)) {
            throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Only images (PNG, JPEG, GIF) and PDF files are allowed"
            )
        }

        var shortCode = generateShortCode()
        while (fileRepository.findByShortCode(shortCode) != null) {
            shortCode = generateShortCode()
        }

        val originalFilename = file.originalFilename ?: "unknown"
        val extension = originalFilename.substringAfterLast(".", "")
        val storedFilename = "${UUID.randomUUID()}.$extension"

        try {
            val targetLocation = uploadPath.resolve(storedFilename)
            file.inputStream.use { inputStream ->
                Files.copy(inputStream, targetLocation)
            }
        } catch (e: IOException) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not store file")
        }

        val fileEntity = FileEntity(
            shortCode = shortCode,
            originalFilename = originalFilename,
            storedFilename = storedFilename,
            contentType = contentType,
            fileSize = file.size,
            username = username
        )

        fileRepository.save(fileEntity)

        return FileUploadResponse(
            short_url = "$baseUrl/f/$shortCode",
            original_filename = originalFilename,
            file_size = file.size,
            content_type = contentType
        )
    }

    fun downloadFile(shortCode: String): Pair<Resource, FileEntity> {
        val fileEntity = fileRepository.findByShortCode(shortCode)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "File not found")

        val filePath = uploadPath.resolve(fileEntity.storedFilename).normalize()
        val resource = UrlResource(filePath.toUri())

        if (!resource.exists() || !resource.isReadable) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "File not found")
        }

        fileEntity.downloads++
        fileRepository.save(fileEntity)

        return Pair(resource, fileEntity)
    }

    fun getUserFiles(username: String): List<FileInfoDto> {
        return fileRepository.findByUsername(username).map { file ->
            FileInfoDto(
                id = file.id ?: 0,
                short_code = file.shortCode,
                short_url = "$baseUrl/f/${file.shortCode}",
                original_filename = file.originalFilename,
                content_type = file.contentType,
                file_size = file.fileSize,
                downloads = file.downloads,
                created_at = file.createdAt.toString()
            )
        }
    }

    private fun generateShortCode(length: Int = 6): String {
        return (1..length)
            .map { Random.nextInt(0, characters.size) }
            .map(characters::get)
            .joinToString("")
    }

    private fun isValidFileType(contentType: String): Boolean {
        return contentType in listOf(
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/gif",
            "application/pdf"
        )
    }
}
