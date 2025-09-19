package com.aibi.neerp.location.service;

import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.location.dto.CityDto;
import com.aibi.neerp.location.dto.StateDto;
import com.aibi.neerp.location.entity.City;
import com.aibi.neerp.location.entity.State;
import com.aibi.neerp.location.repository.CityRepository;
import com.aibi.neerp.location.repository.StateRepository;

import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class LocationService {

    private final StateRepository stateRepo;
    private final CityRepository cityRepo;

    @Transactional(readOnly = true)
    public List<StateDto> listStates() {
        return stateRepo.findAllByOrderByNameAsc()
                .stream()
                .map(s -> new StateDto(s.getId(), s.getName(), s.getType()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CityDto> listCitiesByStateName(String stateName) {
        State state = stateRepo.findByNameIgnoreCase(stateName)
                .orElseThrow(() -> new IllegalArgumentException("State not found: " + stateName));
        return cityRepo.findByStateOrderByNameAsc(state)
                .stream().map(c -> new CityDto(c.getId(), c.getName()))
                .toList();
    }

    @Transactional
    public StateDto addState(String name, String type) {
        if (type == null) {
            type = "STATE"; // default value
        }

        stateRepo.findByNameIgnoreCase(name).ifPresent(s -> {
            throw new IllegalArgumentException("State already exists: " + name);
        });

        State saved = stateRepo.save(State.builder()
                                 .name(name.trim())
                                 .type(type.trim())
                                 .build());
        return new StateDto(saved.getId(), saved.getName(), saved.getType());
    }


    @Transactional
    public CityDto addCity(String stateName, String cityName) {
        State state = stateRepo.findByNameIgnoreCase(stateName)
                .orElseThrow(() -> new IllegalArgumentException("State not found: " + stateName));

        if (cityRepo.existsByStateAndNameIgnoreCase(state, cityName)) {
            throw new IllegalArgumentException("City already exists in state: " + cityName);
        }

        City saved = cityRepo.save(City.builder().name(cityName.trim()).state(state).build());
        return new CityDto(saved.getId(), saved.getName());
    }
    
    public boolean hasStatesAndCities() {
        return !stateRepo.findAll().isEmpty() && !cityRepo.findAll().isEmpty();
    }

    @Transactional
    public StateDto updateState(Long id, String name, String type) {
        State state = stateRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("State not found with id: " + id));

        if (type == null) type = "STATE"; // default value

        state.setName(name.trim());
        state.setType(type.trim());

        State saved = stateRepo.save(state);
        return new StateDto(saved.getId(), saved.getName(), saved.getType());
    }
    
    @Transactional
    public void deleteState(Long id) {
        State state = stateRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("State not found with id: " + id));

        // Check if any city is referencing this state
        boolean hasCities = cityRepo.existsByStateId(id);
        if (hasCities) {
            throw new ResourceInUseException("Cannot delete state. It is referenced by one or more cities.");
        }

        stateRepo.delete(state);
    }





}
