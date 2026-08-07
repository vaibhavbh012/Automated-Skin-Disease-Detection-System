import sys
import os
import json
import numpy as np
import tensorflow as tf
from PIL import Image

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

CLASSES = ["Acne", "Carcinoma", "Eczema", "Keratosis", "Milia", "Rosacea"]

# Dummy recommendations for each class (since the model only predicts the disease)
RECOMMENDATIONS = {
    "Acne": {
        "dos": [
            "Use a gentle cleanser twice daily",
            "Apply oil-free moisturizer",
            "Use salicylic acid or benzoyl peroxide products"
        ],
        "donts": [
            "Do not pop pimples",
            "Avoid oily skincare products",
            "Avoid touching face frequently"
        ],
        "warning": "Consult a dermatologist if acne is severe or persistent"
    },

    "Carcinoma": {
        "dos": [
            "Protect skin from UV exposure",
            "Wear sunscreen (SPF 30+)",
            "Regularly check for skin changes"
        ],
        "donts": [
            "Do not ignore unusual growths or lesions",
            "Avoid prolonged sun exposure",
            "Avoid tanning beds"
        ],
        "warning": "⚠️ URGENT: Consult a dermatologist immediately for proper diagnosis and treatment"
    },

    "Eczema": {
        "dos": [
            "Moisturize skin frequently",
            "Use fragrance-free products",
            "Take lukewarm showers"
        ],
        "donts": [
            "Avoid scratching affected areas",
            "Avoid harsh soaps",
            "Avoid allergens like dust or wool"
        ],
        "warning": "Seek medical help if skin becomes infected or worsens"
    },

    "Keratosis": {
        "dos": [
            "Use moisturizing creams with urea or lactic acid",
            "Exfoliate gently",
            "Keep skin hydrated"
        ],
        "donts": [
            "Do not scratch or pick bumps",
            "Avoid harsh scrubbing",
            "Avoid very dry environments"
        ],
        "warning": "Consult a dermatologist for proper treatment if condition persists"
    },

    "Milia": {
        "dos": [
            "Keep skin clean",
            "Use gentle exfoliation",
            "Use non-comedogenic skincare"
        ],
        "donts": [
            "Do not squeeze milia",
            "Avoid heavy creams",
            "Avoid self-removal with sharp objects"
        ],
        "warning": "Consult a dermatologist for safe removal if needed"
    },

    "Rosacea": {
        "dos": [
            "Use gentle skincare products",
            "Apply sunscreen daily",
            "Identify and avoid personal triggers"
        ],
        "donts": [
            "Avoid spicy foods and alcohol",
            "Avoid hot beverages",
            "Avoid extreme temperatures"
        ],
        "warning": "Consult a doctor for prescription treatment if symptoms worsen"
    }
}

def predict(image_path):
    try:
        # Load the model
        model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'model', 'skin_disease_model.h5'))
        model = tf.keras.models.load_model(model_path)
        
        # Load and preprocess the image
        img = Image.open(image_path).convert('RGB')
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0  # Normalize if the model expects [0,1]
        img_array = np.expand_dims(img_array, axis=0)
        
        # Predict
        predictions = model.predict(img_array, verbose=0)
        predicted_index = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_index])
        
        predicted_class = CLASSES[predicted_index] if predicted_index < len(CLASSES) else f"Unknown ({predicted_index})"
        
        # Determine severity based on confidence (just a heuristic for the demo)
        if predicted_class == "Healthy":
            severity = "None"
        elif confidence > 0.9:
            severity = "High"
        elif confidence > 0.7:
            severity = "Medium"
        else:
            severity = "Low"
            
        result = {
            "disease": predicted_class,
            "confidence": f"{confidence * 100:.1f}%",
            "severity": severity,
            "recommendations": RECOMMENDATIONS.get(predicted_class, {})
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}), file=sys.stderr)
        sys.exit(1)
        
    predict(sys.argv[1])
