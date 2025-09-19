package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.WireRopeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WireRopeTypeRepository extends JpaRepository<WireRopeType, Long> {
    Optional<WireRopeType> findByWireRopeTypeIgnoreCase(String type);

    boolean existsByWireRopeTypeIgnoreCase(@NotBlank(message = "Wire Rope Type cannot be blank") @Size(max = 255, message = "Wire Rope Type must not exceed 255 characters") String wireRopeType);
}
