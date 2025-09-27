package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.Component;
import com.aibi.neerp.componentpricing.entity.Manufacture;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ManufactureRepository extends JpaRepository<Manufacture, Integer> {
    Optional<Manufacture> findByNameIgnoreCase(String name);

    boolean existsByNameAndComponent(@NotBlank(message = "Name is required") String name, Component c);
}
