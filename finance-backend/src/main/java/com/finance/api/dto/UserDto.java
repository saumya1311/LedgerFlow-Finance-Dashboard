package com.finance.api.dto;

import com.finance.api.model.UserRole;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private UserRole role;
    private LocalDateTime createdAt;
}
