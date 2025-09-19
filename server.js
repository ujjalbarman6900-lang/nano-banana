app.post("/generate-image", async (req, res) => {
  try {
    const { prompt, image } = req.body;

    let requestBody = {
      prompt: { text: prompt },
      size: "1024x1024"
    };

    // If user uploaded an image, include it as input
    if (image) {
      requestBody.image = {
        inline_data: {
          mime_type: "image/png",
          data: image
        }
      };
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generate?key=" + API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Image generation failed" });
  }
});
