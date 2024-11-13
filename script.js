import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI;
let model;
let isInitialized = false;

async function initializeGenerativeAI() {
    try {
        const response = await fetch("/api/config.js");
        const data = await response.json();

        if (!data.apiKey) {
            throw new Error("API key not found.");
        }

        genAI = new GoogleGenerativeAI(data.apiKey);
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        isInitialized = true;
    } catch (error) {
        console.error("Failed to initialize GoogleGenerativeAI:", error);
        isInitialized = false;
    }
}

async function translateToPirateSpeak() {
    if (!isInitialized) {
        await initializeGenerativeAI();
    }

    if (!model) {
        document.getElementById('result').innerText = "Error: AI model is not available.";
        return;
    }

    const message = document.getElementById("userMessage").value;
    const resultElement = document.getElementById("result");
    const loadingElement = document.getElementById("loading");

    loadingElement.style.display = "block";
    resultElement.innerText = "";

    const prompt = `Translate this to pirate speak: ${message}`;

    try {
        const result = await model.generateContent(prompt);

        console.log("Full API Response:", result);

        const pirateSpeak = result.response.text();

        if (pirateSpeak) {
            resultElement.innerText = pirateSpeak;
        } else {
            resultElement.innerText = "Arr! Couldn’t translate that message!";
        }
    } catch (error) {
        console.error("Error:", error);
        resultElement.innerText = "Error: " + error.message;
    } finally {
        loadingElement.style.display = "none";
    }
}

initializeGenerativeAI();

window.translateToPirateSpeak = translateToPirateSpeak;
