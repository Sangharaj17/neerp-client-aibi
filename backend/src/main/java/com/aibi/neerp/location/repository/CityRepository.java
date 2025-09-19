package com.aibi.neerp.location.repository;

import com.aibi.neerp.location.entity.City;
import com.aibi.neerp.location.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CityRepository extends JpaRepository<City, Long> {
    List<City> findByStateOrderByNameAsc(State state);
    boolean existsByStateAndNameIgnoreCase(State state, String name);
	boolean existsByStateId(Long id);
}
