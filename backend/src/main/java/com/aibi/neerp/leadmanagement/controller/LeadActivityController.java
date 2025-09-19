package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.common.dto.PaginatedResponse;
import com.aibi.neerp.leadmanagement.dto.AddLeadActivityGetData;
import com.aibi.neerp.leadmanagement.dto.LeadTodoActivityRequestDto;
import com.aibi.neerp.leadmanagement.dto.LeadTodoActivityResponseDto;
import com.aibi.neerp.leadmanagement.dto.LeadTodoAndActivityData;
import com.aibi.neerp.leadmanagement.service.LeadTodoActivityService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leadmanagement/lead-activity")
public class LeadActivityController {

    @Autowired
    private LeadTodoActivityService leadTodoActivityService;

    @GetMapping("/addLeadActivityGetData")
    public ResponseEntity<AddLeadActivityGetData> getLeadActivityData(
            @RequestParam Integer leadId,
            @RequestParam Integer todoId
    ) {
        AddLeadActivityGetData dto = leadTodoActivityService.getLeadActivityData(leadId, todoId);
        return ResponseEntity.ok(dto);
    }
    
    @PostMapping
    public ResponseEntity<LeadTodoActivityResponseDto> createActivity(@RequestBody LeadTodoActivityRequestDto dto) {
        return ResponseEntity.ok(leadTodoActivityService.create(dto));
    }
    
    @GetMapping("/leadTodoActivitylist")
    public ResponseEntity<PaginatedResponse<LeadTodoAndActivityData>> getLeadActivityList(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PaginatedResponse<LeadTodoAndActivityData> response = leadTodoActivityService.getActivityListData(search, page, size);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/getAllLeadTodoActivitylist")
    public ResponseEntity<List<LeadTodoActivityResponseDto>> getAllLeadActivityList(
            @RequestParam Integer leadId
           ) {
        System.out.println(" call api getAllLeadTodoActivitylist");
        List<LeadTodoActivityResponseDto> response = leadTodoActivityService.getAllActivityListData(leadId);
        return ResponseEntity.ok(response);
    }


}
