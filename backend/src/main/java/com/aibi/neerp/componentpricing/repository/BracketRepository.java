package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.Bracket;
import com.aibi.neerp.componentpricing.entity.Floor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BracketRepository extends JpaRepository<Bracket, Integer> {
    List<Bracket> findByBracketTypeId(int id);

    List<Bracket> findByFloor(Floor floor);
}
