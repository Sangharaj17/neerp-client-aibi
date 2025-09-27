package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.Component;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ComponentRepository extends JpaRepository<Component, Integer> {
    Optional<Component> findByNameIgnoreCase(String name);

    boolean existsByName(@NotBlank(message = "Name is required") String name);
}
