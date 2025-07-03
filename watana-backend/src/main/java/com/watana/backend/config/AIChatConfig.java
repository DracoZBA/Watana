package com.watana.backend.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.api.OpenAiApi; // Importa la API de OpenAI
import org.springframework.ai.openai.OpenAiChatModel; // Importa el modelo de chat de OpenAI
import org.springframework.ai.openai.OpenAiChatOptions; // Importa las opciones de chat de OpenAI
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration // Indica que esta clase contiene definiciones de beans de Spring
public class AIChatConfig {

    // Inyecta la API Key desde application.properties (ahora es spring.ai.openai.api-key)
    @Value("${spring.ai.openai.api-key}")
    private String openAiApiKey; // Aunque sea para Google, la propiedad es de OpenAI

    // Inyecta la URL base y la ruta de completions
    @Value("${spring.ai.openai.base-url}")
    private String openAiBaseUrl;

    @Value("${spring.ai.openai.chat.completions-path}")
    private String openAiChatCompletionsPath;

    // Inyecta el modelo específico de Gemini a usar
    @Value("${spring.ai.openai.chat.options.model}")
    private String geminiModelName;

    @Bean // Marca este método como un productor de un bean de Spring
    public OpenAiApi openAiApi() {
        // Crea una instancia de la API de OpenAI con la URL base de Google
        return new OpenAiApi(openAiBaseUrl, openAiApiKey);
    }

    @Bean // Marca este método como un productor de un bean de Spring
    public OpenAiChatModel openAiChatModel(OpenAiApi openAiApi) {
        // Crea las opciones de chat con el modelo Gemini
        OpenAiChatOptions chatOptions = OpenAiChatOptions.builder()
                .withModel(geminiModelName)
                .build();

        // Crea una instancia del modelo de chat de OpenAI, usando la API de Google
        return new OpenAiChatModel(openAiApi, chatOptions);
        // También puedes especificar el chatCompletionsPath si el constructor lo permite y es necesario:
        // return new OpenAiChatModel(openAiApi, chatOptions, openAiChatCompletionsPath);
    }

    @Bean // Marca este método como un productor de un bean de Spring
    public ChatClient chatClient(OpenAiChatModel openAiChatModel) {
        // Construye el ChatClient utilizando el OpenAiChatModel configurado
        return ChatClient.builder(openAiChatModel).build();
    }
}