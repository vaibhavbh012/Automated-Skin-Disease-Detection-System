import sys
import os
import json
import random
import numpy as np
from PIL import Image

# Robust check for TensorFlow dependency
try:
    import tensorflow as tf
    HAS_TENSORFLOW = True
except ImportError:
    HAS_TENSORFLOW = False

# Suppress TensorFlow warnings
if HAS_TENSORFLOW:
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

CLASSES = ["Acne", "Carcinoma", "Eczema", "Keratosis", "Milia", "Rosacea"]

# Recommendations dictionary
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
        # Verify that the image file is valid and can be opened
        img = Image.open(image_path).convert('RGB')
        img = img.resize((224, 224))
        
        if HAS_TENSORFLOW:
            # ----------------------------------------------------
            # Real Inference Mode (TensorFlow Loaded)
            # ----------------------------------------------------
            model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'model', 'skin_disease_model.h5'))
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found at: {model_path}")
                
            model = tf.keras.models.load_model(model_path)
            
            img_array = np.array(img) / 255.0  # Normalize
            img_array = np.expand_dims(img_array, axis=0)
            
            predictions = model.predict(img_array, verbose=0)
            predicted_index = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_index])
            predicted_class = CLASSES[predicted_index] if predicted_index < len(CLASSES) else f"Unknown ({predicted_index})"
            is_mock_run = False
        else:
            # ----------------------------------------------------
            # Mock Demo Mode (Fallback for resource-limited servers)
            # ----------------------------------------------------
            # Pick a disease deterministically or based on the filename to simulate realistic outputs
            filename = os.path.basename(image_path).lower()
            
            matched_class = None
            for c in CLASSES:
                if c.lower() in filename:
                    matched_class = c
                    break
                    
            if matched_class:
                predicted_class = matched_class
                confidence = random.uniform(0.85, 0.96)
            else:
                predicted_class = random.choice(CLASSES)
                confidence = random.uniform(0.72, 0.89)
                
            is_mock_run = True

        # Determine severity level
        if confidence > 0.9:
            severity = "High"
        elif confidence > 0.7:
            severity = "Medium"
        else:
            severity = "Low"
            
        result = {
            "disease": predicted_class,
            "confidence": f"{confidence * 100:.1f}%",
            "severity": severity,
            "recommendations": RECOMMENDATIONS.get(predicted_class, {}),
            "demo_mode": is_mock_run
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
