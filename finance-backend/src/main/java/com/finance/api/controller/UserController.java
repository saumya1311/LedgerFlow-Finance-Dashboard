package com.finance.api.controller;

import com.finance.api.dto.UserDto;
import com.finance.api.model.User;
import com.finance.api.model.UserRole;
import com.finance.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(user -> UserDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .createdAt(user.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String roleStr = body.get("role");
        if (roleStr == null) {
            return ResponseEntity.badRequest().body("Role is required");
        }

        try {
            UserRole newRole = UserRole.valueOf(roleStr.toUpperCase());
            User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
            user.setRole(newRole);
            userRepository.save(user);

            return ResponseEntity.ok(UserDto.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .createdAt(user.getCreatedAt())
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role provided");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
