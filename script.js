import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI;
let model;

async function initializeGenerativeAI() {
    try {
        const response = await fetch("/api/config");
        const data = await response.json();

        if (!data.apiKey) {
            throw new Error("API key not found.");
        }

        genAI = new GoogleGenerativeAI(data.apiKey);
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch (error) {
        console.error("Failed to initialize GoogleGenerativeAI:", error);
    }
}

async function translateToPirateSpeak() {
    if (!model) {
        await initializeGenerativeAI();
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

// Initialize genAI when the script loads
initializeGenerativeAI();

// Attach the function to the global `window` object
window.translateToPirateSpeak = translateToPirateSpeak;
