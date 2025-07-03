package com.watana.backend.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service // Marks this class as a Spring service
public class AIService {

    private final ChatClient chatClient; // Main Spring AI interface for interacting with chat models

    // Injects the ChatClient that is configured by AIChatConfig (manual configuration)
    @Autowired
    public AIService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    // Prompt template for sensor data analysis
    @Value("classpath:/prompts/sensor-analysis.st") // Loads the template from a file
    private Resource sensorAnalysisPromptResource;

    // Method to analyze sensor data and generate insights/predictions
    public String analyzeSensorData(double temperature, double humidity, String location, String deviceType) {
        // Creates a prompt template from the loaded resource
        PromptTemplate promptTemplate = new PromptTemplate(sensorAnalysisPromptResource);

        // Defines variables for the prompt template
        Map<String, Object> model = Map.of(
            "temperature", temperature,
            "humidity", humidity,
            "location", location,
            "deviceType", deviceType
        );

        // Creates the prompt with variable data
        Prompt prompt = promptTemplate.create(model);

        // Sends the prompt to the AI model and gets the response
        // Using the fluent API of ChatClient
        return this.chatClient.prompt(prompt).call().content();
    }

    // Method to predict forest fires
    public String predictWildfire(double temperature, double humidity, String location, String recentRainfall, String windConditions) {
        // Specific prompt for fire prediction
        String promptText = String.format(
            "Analiza los siguientes datos para predecir el riesgo de incendio forestal: " +
            "Temperatura: %.1f°C, Humedad: %.1f%%, Ubicación: %s, Precipitaciones recientes: %s, Condiciones del viento: %s. " +
            "Basado en esta información, ¿cuál es el nivel de riesgo (Bajo, Moderado, Alto, Crítico) y por qué? " +
            "Sugiere acciones preventivas.",
            temperature, humidity, location, recentRainfall, windConditions
        );
        // Using the fluent API for a simple text prompt
        return chatClient.prompt(promptText).call().content();
    }

    // Method to detect overgrazing or illegal logging
    public String detectEnvironmentalImpact(String deviceType, String droneImageryAnalysis, String sensorData, String location) {
        // Prompt to detect environmental impact
        String promptText = String.format(
            "Analiza el informe de monitoreo ambiental para detectar sobrepastoreo o tala ilegal. " +
            "Tipo de dispositivo: %s, Análisis de imágenes de dron: '%s', Datos de sensor: '%s', Ubicación: %s. " +
            "Identifica si hay signos de sobrepastoreo o tala, y sugiere posibles acciones o confirmación en terreno.",
            deviceType, droneImageryAnalysis, sensorData, location
        );
        // Using the fluent API for a simple text prompt
        return chatClient.prompt(promptText).call().content();
    }

    // Method to provide reforestation/drought guidance
    public String provideReforestationGuidance(String location, String soilType, String waterAvailability, String climateData, String currentVegetation) {
        // Prompt for reforestation/drought guidance
        String promptText = String.format(
            "Basado en los siguientes datos geográficos y ambientales, proporciona recomendaciones para reforestación o mitigación de sequía. " +
            "Ubicación: %s, Tipo de suelo: %s, Disponibilidad de agua: %s, Datos climáticos: '%s', Vegetación actual: '%s'. " +
            "Sugiere especies de plantas adecuadas, técnicas de conservación de agua o estrategias de manejo de sequía.",
            location, soilType, waterAvailability, climateData, currentVegetation
        );
        // Using the fluent API for a simple text prompt
        return chatClient.prompt(promptText).call().content();
    }
}