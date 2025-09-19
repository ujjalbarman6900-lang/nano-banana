import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json({ limit: "10mb" })); // allow large base64 images

app.post("/generate-image", async (req, res) => {
  try {
    const { prompt, image } = req.body;

    // Build request payload according to Gemini Image API spec
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt || "" },
            ...(image
              ? [
                  {
                    inline_data: {
                      mime_type: "image/png",
                      data: image
                    }
                  }
                ]
              : [])
          ]
        }
      ],
      generationConfig: {
        size: "1024x1024"
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generate?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    res.json(data);
  } catch (error) {
    console.error("Image generation failed:", error);
    res.status(500).json({ error: "Image generation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
