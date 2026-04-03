package com.finance.api.controller;

import com.finance.api.dto.DashboardStatsDTO;
import com.finance.api.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final RecordService recordService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        
        if (from == null) from = LocalDate.now().minusMonths(1);
        if (to == null) to = LocalDate.now();
        
        return ResponseEntity.ok(recordService.getStats(from, to));
    }
}
