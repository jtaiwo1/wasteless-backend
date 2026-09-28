const PantryItem = require("../models/PantryItem");
const { groq } = require('../config/groqConfig');

const scanReceipt = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: 'Missing required imageUrl parameter.' });
        }

        const today = new Date().toISOString().split('T')[0];

        const response = await groq.chat.completions.create({
            model: 'qwen/qwen3.8-27b',
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are an expert receipt OCR assistant. Extract food items from the provided link image and calculate their estimated expiry dates based on the current baseline date: ${today}.
					
					CRITICAL EXPIRY LOGIC (Add these days directly to current date: ${today}):
					- Fresh produce / Berries / Milk / Salad: +5 days
					- Root vegetables / Apples / Citrus: +14 days
					- Fresh Meat / Fish / Dairy / Tofu / Prepared Plants: +7 days
					- Pantry items / Dry Noodles / Canned goods: +365 days

					Respond ONLY with a valid JSON object matching this exact structural schema format:
					{
						"items": [
							{ "name": "Cleaned Item Name String", "quantity": 1, "expiry": "YYYY-MM-DD" }
						]
					}`
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Parse this receipt image link into the requested JSON format." },
                        { type: "image_url", image_url: { url: imageUrl }}
                    ]
                }
            ]
        });

        const cleanJson = JSON.parse(response.choices[0].message.content);

        const userId = req.user?.user_id || 1; 

        const savedItems = await Promise.all(
            cleanJson.items.map(async (item) => {
                return await PantryItem.create({
                    user_id: userId,
                    name: item.name,
                    quantity: parseInt(item.quantity) || 1,
                    expiry_date: item.expiry,
                    status: "available"
                });
            })
        );

        res.status(201).json({
            message: 'Successfully parsed receipt and saved to database',
            count: savedItems.length,
            items: savedItems
        });

    } catch (error) {
        console.error("Receipt Controller SQL Error Details:", error);
        res.status(500).json({ error: error.message || "Failed to parse receipt details via AI." });
    }
};

module.exports = { scanReceipt };