package com.aibi.neerp.siteexpences.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiteExpenseDashboardDTO {
    
    // Summary Cards
    private SummaryCards summaryCards;
    
    // Charts Data
    private CategoryWiseExpenses categoryWiseExpenses;
    private MonthlyExpenseTrend monthlyExpenseTrend;
    
    // Bottom Section
    private List<TopExpensiveProject> topExpensiveProjects;
    private List<SiteExpenseListDTO> latestExpenses;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SummaryCards {
        private BigDecimal totalExpenses;
        private BigDecimal todayExpenses;
        private BigDecimal thisMonthExpenses;
        private Long totalExpenseCount;
        private Long todayExpenseCount;
        private Long thisMonthExpenseCount;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryWiseExpenses {
        private Map<String, BigDecimal> expensesByCategory;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyExpenseTrend {
        private List<MonthlyData> monthlyData;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyData {
        private String month; // Format: "2024-01" or "Jan 2024"
        private BigDecimal amount;
        private Long count;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopExpensiveProject {
        private String customerName;
        private String jobType; // "AMC_JOB" or "AMC_RENEWAL_JOB"
        private String siteName;
        private BigDecimal totalExpense;
        private Long expenseCount;
    }
}