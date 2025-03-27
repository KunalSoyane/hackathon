from flask import Flask, request, jsonify
from transformers import pipeline
import random

app = Flask(__name__)

# Load a pre-trained AI model for text classification
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Define possible complaint categories
CATEGORIES = [
    "Infrastructure", "Academic Issues", "Faculty Concerns",
    "Harassment", "Food & Cafeteria", "Hostel Issues",
    "Security", "Library Issues", "Technical Problems", "Other"
]

def classify_complaint(complaint_text):
    """Classifies the complaint into a category."""
    result = classifier(complaint_text, CATEGORIES)
    category = result["labels"][0]  # Get the top predicted category
    return category

def is_real_complaint(complaint_text):
    """Determines if a complaint is genuine based on text length and keywords."""
    if len(complaint_text) < 10:  # Too short to be a real complaint
        return False

    # Basic keyword check (you can use a more advanced AI model for better results)
    fake_keywords = ["test", "asdf", "random", "blah", "fake"]
    if any(word in complaint_text.lower() for word in fake_keywords):
        return False

    return True

@app.route("/classify-complaint", methods=["POST"])
def classify():
    """API Endpoint to classify and verify complaints."""
    data = request.get_json()
    
    if "complaint" not in data:
        return jsonify({"error": "Missing complaint text"}), 400

    complaint_text = data["complaint"]
    category = classify_complaint(complaint_text)
    real_status = "Real" if is_real_complaint(complaint_text) else "Fake"

    return jsonify({
        "status": real_status,
        "category": category
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
