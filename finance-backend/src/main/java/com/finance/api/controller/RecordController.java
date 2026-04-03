package com.finance.api.controller;

import com.finance.api.dto.RecordRequestDTO;
import com.finance.api.dto.RecordResponseDTO;
import com.finance.api.model.RecordType;
import com.finance.api.service.RecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;

    @GetMapping
    public ResponseEntity<Page<RecordResponseDTO>> getAllRecords(
            @RequestParam(required = false) RecordType type,
            @RequestParam(required = false) String category,
            @PageableDefault(size = 10, sort = "date", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(recordService.getAllRecords(type, category, pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RecordResponseDTO> createRecord(@Valid @RequestBody RecordRequestDTO request) {
        return new ResponseEntity<>(recordService.createRecord(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RecordResponseDTO> updateRecord(@PathVariable Long id, @Valid @RequestBody RecordRequestDTO request) {
        return ResponseEntity.ok(recordService.updateRecord(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        recordService.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }
}
