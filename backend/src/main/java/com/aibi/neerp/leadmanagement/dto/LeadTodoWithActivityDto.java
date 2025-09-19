package com.aibi.neerp.leadmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeadTodoWithActivityDto {
    private LeadTodoResponseDto leadTodo;
    private LeadTodoActivityResponseDto leadTodoActivity; // can be null
}

