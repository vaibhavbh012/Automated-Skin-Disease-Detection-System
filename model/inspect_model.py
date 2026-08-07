import tensorflow as tf
import os
try:
    model_path = os.path.join(os.path.dirname(__file__), 'skin_disease_model.h5')
    model = tf.keras.models.load_model(model_path)
    print("Model Input Shape:", model.input_shape)
    print("Model Output Shape:", model.output_shape)
    model.summary()
except Exception as e:
    print(f"Error loading model: {e}")
