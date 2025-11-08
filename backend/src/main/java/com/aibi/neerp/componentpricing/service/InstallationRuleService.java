package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.InstallationRuleRequestDTO;
import com.aibi.neerp.componentpricing.dto.InstallationRuleResponseDTO;
import com.aibi.neerp.componentpricing.entity.Floor;
import com.aibi.neerp.componentpricing.entity.InstallationRule;
import com.aibi.neerp.componentpricing.repository.FloorRepository;
import com.aibi.neerp.componentpricing.repository.InstallationRuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
@Slf4j
public class InstallationRuleService {

    private final InstallationRuleRepository repository;
    private final FloorRepository floorRepository;

    public InstallationRuleResponseDTO createRule(InstallationRuleRequestDTO dto) {
        log.info("Creating Installation Rule for liftType={}", dto.getLiftType());

        // 🔄 Convert List<Integer> -> List<Long>
        List<Long> floorIds = dto.getFloorIds()
                .stream()
                .map(Integer::longValue)
                .toList();

        List<Floor> floors = StreamSupport
                .stream(floorRepository.findAllById(floorIds).spliterator(), false)
                .toList();


        InstallationRule rule = InstallationRule.builder()
                .liftType(dto.getLiftType())
                .floorLimits(floors)   // ✅ use entities
                .baseAmount(dto.getBaseAmount())
                .extraAmount(dto.getExtraAmount())
                .build();

        InstallationRule saved = repository.save(rule);

        return toResponse(saved);
    }

    public List<InstallationRuleResponseDTO> getAllRules() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public InstallationRuleResponseDTO getRuleById(Long id) {
        return repository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Rule not found with id " + id));
    }

    public InstallationRuleResponseDTO updateRule(Long id, InstallationRuleRequestDTO dto) {
        InstallationRule rule = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rule not found with id " + id));

        // 🔄 Convert List<Integer> -> List<Long>
        List<Long> floorIds = dto.getFloorIds() != null
                ? dto.getFloorIds().stream().map(Integer::longValue).toList()
                : List.of();

        // 🔄 Fetch Floor entities into a mutable list
        List<Floor> floors = StreamSupport
                .stream(floorRepository.findAllById(floorIds).spliterator(), false)
                .collect(Collectors.toCollection(ArrayList::new));

        rule.setLiftType(dto.getLiftType());
        rule.setFloorLimits(floors);   // ✅ overwrite with new floors
        rule.setBaseAmount(dto.getBaseAmount());
        rule.setExtraAmount(dto.getExtraAmount());

        InstallationRule updated = repository.save(rule);
        return toResponse(updated);
    }

    public void deleteRule(Long id) {
        repository.deleteById(id);
    }

    public InstallationRuleResponseDTO findRuleForFloorAndLift(Integer floorId, Integer liftType) {
        List<InstallationRuleResponseDTO> rules = getAllRules();

        return rules.stream()
                .filter(rule -> rule.getLiftType().equals(liftType))
                .filter(rule -> rule.getFloorIds() != null &&
                        rule.getFloorIds().contains(floorId))
                .findFirst()
                .orElse(null); // return null if no match
    }



    private InstallationRuleResponseDTO toResponse(InstallationRule rule) {
        return InstallationRuleResponseDTO.builder()
                .id(rule.getId())
                .liftType(rule.getLiftType())
                .floorIds(rule.getFloorLimits().stream()
                        .map(Floor::getId)
                        .toList())
                .floorNames(rule.getFloorLimits().stream()
                        .map(Floor::getFloorName)
                        .toList())
                .baseAmount(rule.getBaseAmount())
                .extraAmount(rule.getExtraAmount())
                .build();
    }

}
