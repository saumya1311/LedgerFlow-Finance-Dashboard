package com.finance.api.dto;

import com.finance.api.model.RecordType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecordResponseDTO {
    private Long id;
    private String title;
    private Double amount;
    private RecordType type;
    private String category;
    private LocalDate date;
    private Long userId;
    private boolean deleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
