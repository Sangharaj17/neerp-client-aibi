package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.WireRopeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WireRopeTypeRepository extends JpaRepository<WireRopeType, Long> {
    Optional<WireRopeType> findByWireRopeTypeIgnoreCase(String type);

    boolean existsByWireRopeTypeIgnoreCase(@NotBlank(message = "Wire Rope Type cannot be blank") @Size(max = 255, message = "Wire Rope Type must not exceed 255 characters") String wireRopeType);

    boolean existsByMachineTypeIdAndWireRopeSizeAndWireRopeTypeIgnoreCase(
            Integer machineTypeId,
            Double wireRopeSize,
            String wireRopeType
    );

    boolean existsByMachineType_IdAndWireRopeSizeAndWireRopeTypeIgnoreCaseAndIdIsNot(@NotNull(message = "Machine Type ID cannot be null") @Positive(message = "Machine Type ID must be positive") Integer machineTypeId, @NotNull(message = "Wire Rope Size cannot be null") @Positive(message = "Wire Rope Size must be positive") Double wireRopeSize, @NotBlank(message = "Wire Rope Type cannot be blank") @Size(max = 255, message = "Wire Rope Type must not exceed 255 characters") String wireRopeType, Long id);
}
