package com.finance.api.config;

import com.finance.api.model.*;
import com.finance.api.model.Record;
import com.finance.api.repository.RecordRepository;
import com.finance.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RecordRepository recordRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Idempotent user initialization/reset
        User admin = userRepository.findByEmail("admin@finance.com")
                .map(u -> {
                    u.setPassword(passwordEncoder.encode("admin1"));
                    return userRepository.save(u);
                })
                .orElseGet(() -> userRepository.save(User.builder()
                        .name("Admin User").email("admin@finance.com")
                        .password(passwordEncoder.encode("admin1")).role(UserRole.ADMIN).build()));

        User analyst = userRepository.findByEmail("analyst@finance.com")
                .map(u -> {
                    u.setPassword(passwordEncoder.encode("analyst2"));
                    return userRepository.save(u);
                })
                .orElseGet(() -> userRepository.save(User.builder()
                        .name("Analyst User").email("analyst@finance.com")
                        .password(passwordEncoder.encode("analyst2")).role(UserRole.ANALYST).build()));

        User viewer = userRepository.findByEmail("viewer@finance.com")
                .map(u -> {
                    u.setPassword(passwordEncoder.encode("viewer3"));
                    return userRepository.save(u);
                })
                .orElseGet(() -> userRepository.save(User.builder()
                        .name("Viewer User").email("viewer@finance.com")
                        .password(passwordEncoder.encode("viewer3")).role(UserRole.VIEWER).build()));

        // Seed sample records only if none exist
        if (recordRepository.count() == 0) {
            recordRepository.saveAll(Arrays.asList(
                    Record.builder().title("Salary").amount(5000.0).type(RecordType.INCOME).category("Job").date(LocalDate.now().minusDays(5)).user(admin).build(),
                    Record.builder().title("Rent").amount(1500.0).type(RecordType.EXPENSE).category("Housing").date(LocalDate.now().minusDays(3)).user(admin).build(),
                    Record.builder().title("Grocery").amount(200.0).type(RecordType.EXPENSE).category("Food").date(LocalDate.now().minusDays(2)).user(admin).build(),
                    Record.builder().title("Freelance").amount(800.0).type(RecordType.INCOME).category("Work").date(LocalDate.now().minusDays(1)).user(analyst).build(),
                    Record.builder().title("Gym").amount(50.0).type(RecordType.EXPENSE).category("Health").date(LocalDate.now()).user(viewer).build()
            ));
        }
        System.out.println("Persistent sample data synchronized (passwords updated).");
    }
}
