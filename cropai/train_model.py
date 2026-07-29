"""
Train a Crop Recommendation model based on Soil Type + Season.
Run this ONCE to produce crop_model.pkl + label encoders.
"""
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
df = pd.read_csv('crop_data.csv')
print(f"Loaded {len(df)} rows")
print(df.head())
print("\nUnique soil types:", df['soil_type'].unique())
print("Unique seasons:", df['season'].unique())
print("Unique crops:", df['crop'].nunique())

# Encode categorical inputs
soil_encoder = LabelEncoder()
season_encoder = LabelEncoder()
crop_encoder = LabelEncoder()

df['soil_encoded'] = soil_encoder.fit_transform(df['soil_type'])
df['season_encoded'] = season_encoder.fit_transform(df['season'])
df['crop_encoded'] = crop_encoder.fit_transform(df['crop'])

X = df[['soil_encoded', 'season_encoded']]
y = df['crop_encoded']

# NOTE: We deliberately do NOT use a train/test split here.
# Each (soil, season) combination legitimately maps to MULTIPLE correct crops
# (e.g. Alluvial+Kharif -> Rice, Maize, Sugarcane, Cotton, Jute are all valid).
# This is closer to a curated knowledge base than a "one right answer" classification
# problem, so a random split would unfairly penalize the model for suggesting an
# equally-valid crop that happened to land in the test set. Instead we train on the
# full dataset and validate by checking the top-N predicted crops against known-valid
# crops for each combination (see verification loop below).

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)
print(f"\nModel trained on all {len(df)} rows (no held-out split - see note above)")

# Save model + encoders
joblib.dump(model, 'crop_model.pkl')
joblib.dump(soil_encoder, 'soil_encoder.pkl')
joblib.dump(season_encoder, 'season_encoder.pkl')
joblib.dump(crop_encoder, 'crop_encoder.pkl')
print("\nSaved: crop_model.pkl, soil_encoder.pkl, season_encoder.pkl, crop_encoder.pkl")

# Quick test prediction
def predict_crops(soil, season, top_n=3):
    soil_enc = soil_encoder.transform([soil])[0]
    season_enc = season_encoder.transform([season])[0]
    probs = model.predict_proba([[soil_enc, season_enc]])[0]
    top_indices = probs.argsort()[-top_n:][::-1]
    results = [(crop_encoder.inverse_transform([i])[0], round(probs[i] * 100, 1)) for i in top_indices]
    return results

print("\n--- Verification: does top-5 prediction cover the known-valid crops? ---")
correct_combos = 0
total_combos = 0
for (soil, season), group in df.groupby(['soil_type', 'season']):
    valid_crops = set(group['crop'])
    predicted = set([c for c, _ in predict_crops(soil, season, top_n=5)])
    overlap = valid_crops & predicted
    total_combos += 1
    if overlap:
        correct_combos += 1
    print(f"{soil:10s} + {season:6s} | valid: {sorted(valid_crops)} | predicted top5: {sorted(predicted)} | overlap: {len(overlap)}/{len(valid_crops)}")

print(f"\n{correct_combos}/{total_combos} combinations had at least one correct crop in top-5 predictions")