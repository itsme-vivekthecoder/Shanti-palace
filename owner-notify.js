import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ⭐ Replace these three values ⭐
const ACCESS_TOKEN = "YOUR_WHATSAPP_CLOUD_API_TOKEN";
const PHONE_NUMBER_ID = "YOUR_PHONE_NUMBER_ID";
const OWNER_NUMBER = "918630760100";   // Bhuvanesh Chaudhary

app.post("/owner-notify", async (req, res) => {
  const data = req.body;

  const message =
    `🟢 *New Booking Received!*\n\n` +
    `👤 Name: ${data.name}\n` +
    `📞 Phone: ${data.phone}\n` +
    `🏨 Room: ${data.room}\n` +
    `💰 Amount: ₹${data.amount}\n` +
    `🧾 Payment ID: ${data.paymentId}\n\n` +
    `✔ Please check details in Google Form.\n`;

  try {
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: OWNER_NUMBER,
          type: "text",
          text: { body: message }
        })
      }
    );

    const result = await response.json();
    console.log("WhatsApp API Response:", result);

    res.json({ status: "success", message: "Owner notified on WhatsApp" });
  } catch (error) {
    console.error("WhatsApp API Error:", error);
    res.status(500).json({ status: "error", message: "Failed to notify owner" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
