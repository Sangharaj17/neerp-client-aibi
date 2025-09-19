package com.aibi.neerp.location.controller;

import com.aibi.neerp.location.dto.CityDto;
import com.aibi.neerp.location.dto.StateDto;
import com.aibi.neerp.location.dto.StateWithCitiesDto;
import com.aibi.neerp.location.service.LocationService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/locations")
@CrossOrigin
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/states")
    public ResponseEntity<List<StateDto>> getStates() {
        return ResponseEntity.ok(locationService.listStates());
    }

    @GetMapping("/states/{stateName}/cities")
    public ResponseEntity<List<CityDto>> getCities(@PathVariable String stateName) {
        return ResponseEntity.ok(locationService.listCitiesByStateName(stateName));
    }

    // ——— admin endpoints (optional) ———

    public record AddStateRequest(@NotBlank String name, @NotBlank String type) {}
    @PostMapping("/states")
    public ResponseEntity<StateDto> addState(@RequestBody AddStateRequest request) {
        return ResponseEntity.ok(locationService.addState(request.name(), request.type()));
    }
    
    @PutMapping("/states/{id}")
    public ResponseEntity<StateDto> updateState(@PathVariable Long id, @RequestBody AddStateRequest request) {
        // Call service to update state
        StateDto updated = locationService.updateState(id, request.name(), request.type());
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/states/{id}")
    public ResponseEntity<String> deleteState(@PathVariable Long id) {
        locationService.deleteState(id);
        return ResponseEntity.ok("State deleted successfully");
    }



    public record AddCityRequest(@NotBlank String cityName) {}
    @PostMapping("/states/{stateName}/cities")
    public ResponseEntity<CityDto> addCity(@PathVariable String stateName, @RequestBody AddCityRequest req) {
    	
    	
        return ResponseEntity.ok(locationService.addCity(stateName, req.cityName()));
    }
    
    @PostMapping("/init")
    public ResponseEntity<String> initializeStatesAndCities(@RequestBody List<StateWithCitiesDto> payload) {
        // Check if states and cities already exist
        boolean alreadyInitialized = locationService.hasStatesAndCities();

        if (alreadyInitialized) {
            return ResponseEntity.ok("States and cities already exist. Initialization skipped.");
        }

        payload.forEach(stateWithCities -> {
            // add state
            StateDto state = locationService.addState(stateWithCities.stateName(), stateWithCities.type());

            // add cities for that state
            stateWithCities.cities().forEach(cityName ->
                locationService.addCity(stateWithCities.stateName(), cityName)
            );
        });

        return ResponseEntity.ok("States and cities initialized successfully");
    }
    
    


}
