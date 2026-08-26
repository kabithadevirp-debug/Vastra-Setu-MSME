package com.vastrasetu.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class VastraSetuApplication {

    public static void main(String[] args) {
        SpringApplication.run(VastraSetuApplication.class, args);
        System.out.println("🌿 VastraSetu Spring Boot Backend API Running on http://localhost:8080");
        System.out.println("🐘 Connected to PostgreSQL Database: vastrasetu_db on localhost:5432");
        System.out.println("🤖 Tesseract OCR v5.5 & OpenRouter AI (google/gemini-2.5-flash) Pipeline Initialized.");
    }
}
