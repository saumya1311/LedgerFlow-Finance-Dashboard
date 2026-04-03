package com.finance.api.service;

import com.finance.api.dto.DashboardStatsDTO;
import com.finance.api.dto.RecordRequestDTO;
import com.finance.api.dto.RecordResponseDTO;
import com.finance.api.exception.ResourceNotFoundException;
import com.finance.api.exception.UnauthorizedAccessException;
import com.finance.api.model.*;
import com.finance.api.model.Record;
import com.finance.api.repository.RecordRepository;
import com.finance.api.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecordService {

    private final RecordRepository recordRepository;
    private final UserRepository userRepository;

    public Page<RecordResponseDTO> getAllRecords(RecordType type, String category, Pageable pageable) {

        Specification<Record> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("deleted"), false));

            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }

            if (category != null && !category.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("category")), "%" + category.toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return recordRepository.findAll(spec, pageable).map(this::mapToResponseDTO);
    }

    @Transactional
    public RecordResponseDTO createRecord(RecordRequestDTO request) {
        User currentUser = getCurrentUser();
        validateWriteAccess(currentUser.getRole());
        
        Record record = Record.builder()
                .title(request.getTitle())
                .amount(request.getAmount())
                .type(request.getType())
                .category(request.getCategory())
                .date(request.getDate())
                .user(currentUser)
                .build();
        return mapToResponseDTO(recordRepository.save(record));
    }

    @Transactional
    public RecordResponseDTO updateRecord(Long id, RecordRequestDTO request) {
        User currentUser = getCurrentUser();
        validateWriteAccess(currentUser.getRole());
        
        Record record = recordRepository.findById(id)
                .filter(r -> !r.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Record with id " + id + " not found"));
        
        // Additional security for Viewer if they could update (they can't by default writeAccess check)
        // But if Viewer could update own, we'd check record.getUser().equals(currentUser)
        
        record.setTitle(request.getTitle());
        record.setAmount(request.getAmount());
        record.setType(request.getType());
        record.setCategory(request.getCategory());
        record.setDate(request.getDate());
        
        return mapToResponseDTO(recordRepository.save(record));
    }

    @Transactional
    public void deleteRecord(Long id) {
        User currentUser = getCurrentUser();
        validateWriteAccess(currentUser.getRole());
        
        Record record = recordRepository.findById(id)
                .filter(r -> !r.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Record with id " + id + " not found"));
        
        record.setDeleted(true);
        recordRepository.save(record);
    }

    public DashboardStatsDTO getStats(LocalDate from, LocalDate to) {
        // All roles see company-wide stats (Viewers are read-only but see same data)
        List<Record> records = recordRepository.findAllByDateRange(from, to);

        double totalIncome = records.stream()
                .filter(r -> r.getType() == RecordType.INCOME)
                .mapToDouble(Record::getAmount)
                .sum();

        double totalExpenses = records.stream()
                .filter(r -> r.getType() == RecordType.EXPENSE)
                .mapToDouble(Record::getAmount)
                .sum();

        return DashboardStatsDTO.builder()
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .netBalance(totalIncome - totalExpenses)
                .build();
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }

    private void validateWriteAccess(UserRole role) {
        if (role == UserRole.VIEWER) {
            throw new UnauthorizedAccessException("VIEWER is not authorized to create, update, or delete records");
        }
    }

    private RecordResponseDTO mapToResponseDTO(Record record) {
        return RecordResponseDTO.builder()
                .id(record.getId())
                .title(record.getTitle())
                .amount(record.getAmount())
                .type(record.getType())
                .category(record.getCategory())
                .date(record.getDate())
                .userId(record.getUser().getId())
                .deleted(record.isDeleted())
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt())
                .build();
    }
}
