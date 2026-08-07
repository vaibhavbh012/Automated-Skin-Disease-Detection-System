#!/usr/bin/env python3
"""
Automated Skin Disease Detection - Training and Evaluation Pipeline
Adapted from original Google Colab notebook.

This script supports:
1. Loading and preprocessing datasets.
2. Transfer Learning using a frozen MobileNetV2 base.
3. Training the custom classification head.
4. Model evaluation on test data (Accuracy, Loss, Confusion Matrix, Classification Report).
5. Saving the model to a specified file.
"""

import os
import argparse
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from PIL import Image

import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

def parse_args():
    parser = argparse.ArgumentParser(description="Train and evaluate the Skin Disease Detection Model")
    parser.add_argument("--train-dir", type=str, required=True, help="Path to training dataset folder")
    parser.add_argument("--test-dir", type=str, required=True, help="Path to test/validation dataset folder")
    parser.add_argument("--epochs", type=int, default=20, help="Number of training epochs")
    parser.add_argument("--batch-size", type=int, default=16, help="Batch size for training")
    parser.add_argument("--img-size", type=int, default=224, help="Target image size (height & width)")
    parser.add_argument("--output-model", type=str, default="model/skin_disease_model_new.h5", help="Path to save the trained model")
    parser.add_argument("--plot-dir", type=str, default="assets", help="Directory to save evaluation plots")
    return parser.parse_args()

def build_model(num_classes, img_size):
    print(f"\n[INFO] Loading MobileNetV2 base model...")
    base_model = MobileNetV2(
        input_shape=(img_size, img_size, 3),
        include_top=False,
        weights="imagenet"
    )
    
    # Freeze the base model layers
    for layer in base_model.layers:
        layer.trainable = False
        
    # Build custom classification head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation="relu")(x)
    x = Dropout(0.5)(x)
    output = Dense(num_classes, activation="softmax")(x)
    
    model = Model(inputs=base_model.input, outputs=output)
    
    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    
    return model

def main():
    args = parse_args()
    
    # Check if paths exist
    if not os.path.exists(args.train_dir):
        raise FileNotFoundError(f"Training directory not found: {args.train_dir}")
    if not os.path.exists(args.test_dir):
        raise FileNotFoundError(f"Test directory not found: {args.test_dir}")
    
    os.makedirs(os.path.dirname(args.output_model), exist_ok=True)
    os.makedirs(args.plot_dir, exist_ok=True)
    
    # Data Augmentation & Loaders
    print("\n[INFO] Setting up data generators...")
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        zoom_range=0.2,
        horizontal_flip=True
    )
    
    test_datagen = ImageDataGenerator(rescale=1./255)
    
    train_generator = train_datagen.flow_from_directory(
        args.train_dir,
        target_size=(args.img_size, args.img_size),
        batch_size=args.batch_size,
        class_mode="categorical"
    )
    
    test_generator = test_datagen.flow_from_directory(
        args.test_dir,
        target_size=(args.img_size, args.img_size),
        batch_size=args.batch_size,
        class_mode="categorical",
        shuffle=False
    )
    
    class_names = list(test_generator.class_indices.keys())
    print(f"Detected classes: {class_names}")
    
    # Build model
    model = build_model(train_generator.num_classes, args.img_size)
    model.summary()
    
    # Train
    print(f"\n[INFO] Starting training for {args.epochs} epochs...")
    history = model.fit(
        train_generator,
        validation_data=test_generator,
        epochs=args.epochs
    )
    
    # Save Model
    print(f"\n[INFO] Saving model to {args.output_model}...")
    model.save(args.output_model)
    print("Model saved successfully!")
    
    # Evaluation
    print("\n[INFO] Evaluating model...")
    y_pred = model.predict(test_generator)
    y_pred_classes = np.argmax(y_pred, axis=1)
    y_true = test_generator.classes
    
    accuracy = accuracy_score(y_true, y_pred_classes)
    print(f"\nOverall Model Accuracy: {accuracy*100:.2f}%")
    
    print("\nClassification Report:")
    report_text = classification_report(y_true, y_pred_classes, target_names=class_names)
    print(report_text)
    
    # Save text report
    with open(os.path.join(args.plot_dir, "classification_report.txt"), "w") as f:
        f.write(report_text)
        
    # Plot & Save Accuracy
    plt.figure(figsize=(10, 4))
    plt.plot(history.history['accuracy'], marker='o')
    plt.plot(history.history['val_accuracy'], marker='o')
    plt.title("Model Accuracy")
    plt.xlabel("Epoch")
    plt.ylabel("Accuracy")
    plt.legend(["Train", "Validation"])
    plt.grid(True)
    plt.tight_layout()
    accuracy_plot_path = os.path.join(args.plot_dir, "accuracy_curve.png")
    plt.savefig(accuracy_plot_path)
    plt.close()
    print(f"Saved accuracy curve to: {accuracy_plot_path}")
    
    # Plot & Save Loss
    plt.figure(figsize=(10, 4))
    plt.plot(history.history['loss'], marker='o')
    plt.plot(history.history['val_loss'], marker='o')
    plt.title("Model Loss")
    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.legend(["Train", "Validation"])
    plt.grid(True)
    plt.tight_layout()
    loss_plot_path = os.path.join(args.plot_dir, "loss_curve.png")
    plt.savefig(loss_plot_path)
    plt.close()
    print(f"Saved loss curve to: {loss_plot_path}")
    
    # Plot & Save Confusion Matrix
    cm = confusion_matrix(y_true, y_pred_classes)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=class_names,
                yticklabels=class_names)
    plt.xlabel("Predicted Label")
    plt.ylabel("True Label")
    plt.title("Confusion Matrix")
    plt.tight_layout()
    cm_plot_path = os.path.join(args.plot_dir, "confusion_matrix.png")
    plt.savefig(cm_plot_path)
    plt.close()
    print(f"Saved confusion matrix to: {cm_plot_path}")

if __name__ == "__main__":
    main()
