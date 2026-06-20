package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.CodeRequest;
import com.example.demo.service.AIService;

@RestController
@RequestMapping("/api")
public class Aicontroller {

    @Autowired
    private AIService aiService;
    
    
    @PostMapping("/review")
    public String review(@RequestBody CodeRequest request) {
        return aiService.reviewCode(
                request.getCode(),
                request.getLanguage()
        );
    }
}