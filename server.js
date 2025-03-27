require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Twilio Credentials (Replace with actual values from your Twilio account)
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Complaint Schema & Model
const complaintSchema = new mongoose.Schema({
  referenceID: { type: String, unique: true, required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  phone: { type: String, required: true },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" }, // Priority Field Added
  status: { type: String, default: "Pending Review" },
  submittedAt: { type: Date, default: Date.now }
});

const Complaint = mongoose.model("Complaint", complaintSchema);

// Function to generate unique Reference ID
const generateReferenceID = () => "REF-" + Math.floor(100000 + Math.random() * 900000);

// 🚀 **Submit Complaint API**
app.post("/submit-complaint", async (req, res) => {
    const { phone, category, title, description, priority } = req.body;

    if (!phone || !category || !title || !description || !priority) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Generate a unique Reference ID
    const referenceID = generateReferenceID();

    // Create a new complaint document
    const newComplaint = new Complaint({
        referenceID,
        category,
        title,
        description,
        phone,
        priority
    });

    try {
        // Save to MongoDB
        await newComplaint.save();

        // SMS Message Content
        const message = `Your complaint is registered! Ref ID: ${referenceID}. Priority: ${priority}. Track it anytime.`;

        // Send SMS using Twilio
        await twilioClient.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: phone,
        });

        res.json({ message: "Complaint registered successfully!", referenceID });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Failed to register complaint" });
    }
});

// 🚀 **Track Complaint API**
app.get("/track-complaint/:referenceID", async (req, res) => {
    const referenceID = req.params.referenceID;

    try {
        const complaint = await Complaint.findOne({ referenceID });

        if (complaint) {
            return res.json(complaint);
        } else {
            return res.status(404).json({ message: "Complaint not found" });
        }
    } catch (error) {
        console.error("Error fetching complaint:", error);
        res.status(500).json({ message: "Server error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
