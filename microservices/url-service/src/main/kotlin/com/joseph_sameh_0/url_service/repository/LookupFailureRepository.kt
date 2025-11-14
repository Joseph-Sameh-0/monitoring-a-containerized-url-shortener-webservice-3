package com.joseph_sameh_0.url_service.repository

import com.joseph_sameh_0.url_service.entity.LookupFailure
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface LookupFailureRepository : JpaRepository<LookupFailure, Long>
