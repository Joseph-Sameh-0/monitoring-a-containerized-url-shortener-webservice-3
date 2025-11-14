package com.joseph_sameh_0.url_service.security

import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class SimpleUserDetailsService : UserDetailsService {
    override fun loadUserByUsername(username: String): UserDetails {
        return User.builder()
            .username(username)
            .password("")
            .authorities(emptyList())
            .build()
    }
}
