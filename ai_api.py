from fastapi import FastAPI
import tensorflow as tf
import pickle
import numpy as np

app = FastAPI()

# Load the trained model and label encoder
model = tf.keras.models.load_model("complaint_model.h5")
with open("label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

# Sample fake complaints database (Improve with better logic)
fake_complaints_db = ["test complaint", "lorem ipsum", "spam message", "check this out", "click here"]

@app.post("/classify-complaint/")
async def classify_complaint(complaint: str):
    # Check if the complaint is fake
    if any(fake_word in complaint.lower() for fake_word in fake_complaints_db):
        return {"status": "Rejected", "reason": "Potential Spam"}

    # AI Prediction
    category_probs = model.predict([complaint])[0]
    category_index = np.argmax(category_probs)
    category_name = label_encoder.inverse_transform([category_index])[0]

    return {"status": "Accepted", "category": category_name}
