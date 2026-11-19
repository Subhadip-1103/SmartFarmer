"""
Train a plant disease classifier using transfer learning (MobileNetV2).
Expects a folder structure:
    dataset/train/<class_name_1>/*.jpg
    dataset/train/<class_name_2>/*.jpg
    ...

Run this ONCE per crop to produce a <crop>_disease_model.keras file + class_names.json
"""
import os
import json
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# ---- CONFIG (change CROP_NAME + DATASET_DIR for each new crop) ----
CROP_NAME = "strawberry"
DATASET_DIR = "dataset/train"
IMG_SIZE = (160, 160)
BATCH_SIZE = 32
EPOCHS = 8
# ---------------------------------------------------------------

train_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="training",
    seed=42,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="validation",
    seed=42,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
)

class_names = train_ds.class_names
print("Classes:", class_names)

# Cache + prefetch for speed
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

# Data augmentation (helps a lot with a modest dataset size)
data_augmentation = models.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
])

# Base model: MobileNetV2 pretrained on ImageNet, frozen (transfer learning)
base_model = MobileNetV2(input_shape=IMG_SIZE + (3,), include_top=False, weights='imagenet')
base_model.trainable = False

inputs = tf.keras.Input(shape=IMG_SIZE + (3,))
x = data_augmentation(inputs)
x = preprocess_input(x)
x = base_model(x, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.3)(x)
outputs = layers.Dense(len(class_names), activation='softmax')(x)
model = tf.keras.Model(inputs, outputs)

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy'],
)

model.summary()

print(f"\nTraining on {len(class_names)} classes for {EPOCHS} epochs...")
history = model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS)

final_val_acc = history.history['val_accuracy'][-1]
print(f"\nFinal validation accuracy: {final_val_acc:.2%}")

# Save model + class names
model.save(f"{CROP_NAME}_disease_model.keras")
with open(f"{CROP_NAME}_class_names.json", 'w') as f:
    json.dump(class_names, f)

print(f"\nSaved: {CROP_NAME}_disease_model.keras, {CROP_NAME}_class_names.json")
