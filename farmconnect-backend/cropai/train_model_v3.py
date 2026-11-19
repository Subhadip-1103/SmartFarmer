import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib

df = pd.read_csv('crop_data_v3.csv')
print(f"Loaded {len(df)} rows")
print(df.head())

state_encoder = LabelEncoder()
district_encoder = LabelEncoder()
soil_encoder = LabelEncoder()
season_encoder = LabelEncoder()
crop_encoder = LabelEncoder()

df['state_encoded'] = state_encoder.fit_transform(df['state'])
df['district_encoded'] = district_encoder.fit_transform(df['district'])
df['soil_encoded'] = soil_encoder.fit_transform(df['soil_type'])
df['season_encoded'] = season_encoder.fit_transform(df['season'])
df['crop_encoded'] = crop_encoder.fit_transform(df['crop'])

X = df[['state_encoded', 'district_encoded', 'soil_encoded', 'season_encoded', 'temperature']]
y = df['crop_encoded']

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X, y)
print(f"\nModel trained on all {len(df)} rows")

joblib.dump(model, 'crop_model_v3.pkl')
joblib.dump(state_encoder, 'state_encoder.pkl')
joblib.dump(district_encoder, 'district_encoder.pkl')
joblib.dump(soil_encoder, 'soil_encoder.pkl')
joblib.dump(season_encoder, 'season_encoder.pkl')
joblib.dump(crop_encoder, 'crop_encoder.pkl')
print("Saved model + 5 encoders")


def predict_crops(state, district, soil, season, temperature, top_n=5):
    state_enc = state_encoder.transform([state])[0]
    district_enc = district_encoder.transform([district])[0]
    soil_enc = soil_encoder.transform([soil])[0]
    season_enc = season_encoder.transform([season])[0]
    probs = model.predict_proba([[state_enc, district_enc, soil_enc, season_enc, temperature]])[0]
    top_indices = probs.argsort()[-top_n:][::-1]
    return [(crop_encoder.inverse_transform([i])[0], round(probs[i] * 100, 1)) for i in top_indices]


print("\n--- Verification: top-5 coverage per (district, season) combination ---")
correct = 0
total = 0
for (district, season), group in df.groupby(['district', 'season']):
    state = group['state'].iloc[0]
    soil = group['soil_type'].iloc[0]
    temp = group['temperature'].iloc[0]
    valid_crops = set(group['crop'])
    predicted = set([c for c, _ in predict_crops(state, district, soil, season, temp, top_n=5)])
    overlap = valid_crops & predicted
    total += 1
    if overlap:
        correct += 1
    status = "OK" if overlap else "MISS"
    print(f"[{status}] {district:20s} ({state:15s}, {soil:9s}) {season:6s} {temp:3d}C | valid: {sorted(valid_crops)} | overlap: {len(overlap)}/{len(valid_crops)}")

print(f"\n{correct}/{total} district+season combinations had at least one correct crop in top-5 predictions")

# Two quick example predictions for the exact Bankura vs Purba Medinipur case
print("\n--- Example: Bankura vs Purba Medinipur, same season+temp ---")
print("Bankura (Laterite), Kharif, 30C:", predict_crops('West Bengal', 'Bankura', 'Laterite', 'Kharif', 30))
print("Purba Medinipur (Alluvial), Kharif, 28C:", predict_crops('West Bengal', 'Purba Medinipur', 'Alluvial', 'Kharif', 28))
