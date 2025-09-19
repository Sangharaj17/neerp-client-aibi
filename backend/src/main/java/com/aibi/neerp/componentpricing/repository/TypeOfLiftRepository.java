package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.TypeOfLift;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TypeOfLiftRepository extends JpaRepository<TypeOfLift, Integer> {
    List<TypeOfLift> findAllByOrderByLiftTypeNameAsc();
    boolean existsByLiftTypeNameIgnoreCase(String liftTypeName);
}
