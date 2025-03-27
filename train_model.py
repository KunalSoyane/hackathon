import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pickle

# Sample dataset (Replace with actual complaint data)
data = {
    "complaint_text": [
        "The classroom fan is broken",
        "The professor didn't show up for the lecture",
        "The food in the canteen is unhygienic",
        "Students are being bullied",
        "The WiFi is too slow in the library",
        "More security is needed at the main gate"
    ],
    "category": ["Infrastructure", "Academic", "Canteen", "Misconduct", "Infrastructure", "Security"]
}

df = pd.DataFrame(data)

# Encode category labels
label_encoder = LabelEncoder()
df["category_encoded"] = label_encoder.fit_transform(df["category"])

# Save label encoder for later use
with open("label_encoder.pkl", "wb") as f:
    pickle.dump(label_encoder, f)

# Split data
X_train, X_test, y_train, y_test = train_test_split(df["complaint_text"], df["category_encoded"], test_size=0.2, random_state=42)

# Text vectorization (convert text to numerical format)
vectorizer = keras.layers.TextVectorization(output_mode="int", max_tokens=5000)
vectorizer.adapt(X_train.to_numpy())

# Build AI Model
model = keras.Sequential([
    vectorizer,
    keras.layers.Embedding(input_dim=5000, output_dim=16),
    keras.layers.GlobalAveragePooling1D(),
    keras.layers.Dense(16, activation="relu"),
    keras.layers.Dense(len(df["category"].unique()), activation="softmax")
])

model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
model.fit(X_train, y_train, epochs=10, validation_data=(X_test, y_test))

# Save Model
model.save("complaint_model.h5")
