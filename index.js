const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Access the API key securely from Render's environment variables
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("GEMINI_API_KEY environment variable is not set.");
    process.exit(1);
}

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

// Use CORS to allow your frontend to connect
app.use(cors());
app.use(express.json());

// The API endpoint that your frontend will call
app.post('/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required.' });
        }

        // Generate the image using the Gemini API
        const result = await model.generateContent(prompt);
        
        // This is a simplified example. The actual response structure
        // from the Gemini API might be different and may require
        // more processing to extract the image data.
        const imageData = result.response.candidates[0].content.parts[0].data;

        // Send the Base64 image data back to the frontend
        res.json({ imageData: imageData });

    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Failed to generate image. Check server logs.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
