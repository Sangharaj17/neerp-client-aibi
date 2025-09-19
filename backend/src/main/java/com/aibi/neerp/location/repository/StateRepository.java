package com.aibi.neerp.location.repository;

import com.aibi.neerp.location.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface StateRepository extends JpaRepository<State, Long> {
    Optional<State> findByNameIgnoreCase(String name);
    List<State> findAllByOrderByNameAsc();
}
