const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set your API key in a secure environment variable
const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

// Use CORS to allow your frontend to connect
app.use(cors());
app.use(express.json());

// Serve the HTML file at the root
app.use(express.static(path.join(__dirname, 'public')));

// The API endpoint that your frontend will call
app.post('/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required.' });
        }

        // Generate the image using the Gemini API
        const result = await model.generateContent(prompt);
        
        // Assuming the API returns a Base64 encoded image directly
        // The Gemini API response structure may vary, you might need to adjust this
        const imageData = result.response.candidates[0].content.parts[0].data;

        // Send the Base64 image data back to the frontend
        res.json({ imageData: imageData });

    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Failed to generate image. Check server logs.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
