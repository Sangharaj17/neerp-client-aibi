package com.aibi.neerp.leadmanagement.mapper;

import java.util.List;

import com.aibi.neerp.leadmanagement.dto.LeadTodoActivityResponseDto;
import com.aibi.neerp.leadmanagement.entity.LeadTodoActivity;

public class LeadTodoActivityMapper {

    public static LeadTodoActivityResponseDto toDto(List<LeadTodoActivity> activitys) {
    	
    	LeadTodoActivity activity = activitys.get(0);
        if (activity == null) return null;

        LeadTodoActivityResponseDto res = new LeadTodoActivityResponseDto();
        res.setActivityId(activity.getActivityId());

        if (activity.getLead() != null) {
            res.setLeadId(activity.getLead().getLeadId());
        }

        if (activity.getTodo() != null) {
            res.setTodoId(activity.getTodo().getTodoId());
        }

        if (activity.getActivityBy() != null) {
            res.setActivityByEmpName(activity.getActivityBy().getEmployeeName());
        }

        res.setActivityTitle(activity.getActivityTitle());
        res.setFeedback(activity.getFeedback());
        res.setActivityDate(activity.getActivityDate());
        res.setActivityTime(activity.getActivityTime());

        return res;
    }
}
