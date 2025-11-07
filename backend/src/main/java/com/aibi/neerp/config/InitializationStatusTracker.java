package com.aibi.neerp.config;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class InitializationStatusTracker {
    
    private final Map<String, StatusInfo> tenantStatuses = new ConcurrentHashMap<>();
    
    public static class StatusInfo {
        private String currentStep;
        private int progress; // 0-100
        private boolean completed;
        private String message;
        
        public StatusInfo(String currentStep, int progress, boolean completed, String message) {
            this.currentStep = currentStep;
            this.progress = progress;
            this.completed = completed;
            this.message = message;
        }
        
        public String getCurrentStep() { return currentStep; }
        public int getProgress() { return progress; }
        public boolean isCompleted() { return completed; }
        public String getMessage() { return message; }
        
        public void setCurrentStep(String currentStep) { this.currentStep = currentStep; }
        public void setProgress(int progress) { this.progress = progress; }
        public void setCompleted(boolean completed) { this.completed = completed; }
        public void setMessage(String message) { this.message = message; }
    }
    
    public void updateStatus(String tenantId, String step, int progress, String message) {
        tenantStatuses.put(tenantId, new StatusInfo(step, progress, false, message));
    }
    
    public void setCompleted(String tenantId) {
        StatusInfo info = tenantStatuses.get(tenantId);
        if (info != null) {
            info.setCompleted(true);
            info.setProgress(100);
            info.setMessage("Dashboard is ready!");
        } else {
            tenantStatuses.put(tenantId, new StatusInfo("completed", 100, true, "Dashboard is ready!"));
        }
    }
    
    public StatusInfo getStatus(String tenantId) {
        return tenantStatuses.get(tenantId);
    }
    
    public void clearStatus(String tenantId) {
        tenantStatuses.remove(tenantId);
    }
}

