import csv

# ---- Base agronomic knowledge: soil_type + season -> valid crops (unchanged) ----
base = {
    ('Alluvial', 'Kharif'): ['Rice', 'Maize', 'Sugarcane', 'Cotton', 'Jute'],
    ('Alluvial', 'Rabi'): ['Wheat', 'Mustard', 'Gram', 'Barley', 'Peas'],
    ('Alluvial', 'Zaid'): ['Watermelon', 'Cucumber', 'Moong', 'Fodder Crops'],
    ('Black', 'Kharif'): ['Cotton', 'Soybean', 'Groundnut', 'Pigeon Pea', 'Sorghum'],
    ('Black', 'Rabi'): ['Wheat', 'Gram', 'Sunflower', 'Linseed'],
    ('Black', 'Zaid'): ['Groundnut', 'Sesame', 'Vegetables'],
    ('Red', 'Kharif'): ['Groundnut', 'Millet', 'Cotton', 'Pulses', 'Tobacco'],
    ('Red', 'Rabi'): ['Wheat', 'Gram', 'Groundnut', 'Ragi'],
    ('Red', 'Zaid'): ['Vegetables', 'Sesame', 'Groundnut'],
    ('Laterite', 'Kharif'): ['Rice', 'Ragi', 'Tapioca', 'Cashew'],
    ('Laterite', 'Rabi'): ['Pulses', 'Vegetables'],
    ('Laterite', 'Zaid'): ['Coconut', 'Areca Nut', 'Rubber'],
    ('Sandy', 'Kharif'): ['Bajra', 'Groundnut', 'Guar', 'Moth Bean'],
    ('Sandy', 'Rabi'): ['Mustard', 'Gram', 'Barley'],
    ('Sandy', 'Zaid'): ['Watermelon', 'Muskmelon', 'Cucumber'],
    ('Clay', 'Kharif'): ['Rice', 'Jute', 'Sugarcane'],
    ('Clay', 'Rabi'): ['Wheat', 'Peas', 'Lentil'],
    ('Clay', 'Zaid'): ['Vegetables', 'Moong'],
    ('Loamy', 'Kharif'): ['Maize', 'Rice', 'Soybean', 'Cotton'],
    ('Loamy', 'Rabi'): ['Wheat', 'Potato', 'Mustard', 'Vegetables'],
    ('Loamy', 'Zaid'): ['Vegetables', 'Maize', 'Groundnut'],
}

# ---- State + Season -> representative baseline temperature (deg C) ----
state_season_temp = {
    'Punjab':          {'Kharif': 32, 'Rabi': 15, 'Zaid': 38},
    'Uttar Pradesh':   {'Kharif': 31, 'Rabi': 16, 'Zaid': 37},
    'Bihar':           {'Kharif': 31, 'Rabi': 17, 'Zaid': 36},
    'West Bengal':     {'Kharif': 30, 'Rabi': 20, 'Zaid': 35},
    'Rajasthan':       {'Kharif': 34, 'Rabi': 18, 'Zaid': 42},
    'Maharashtra':     {'Kharif': 28, 'Rabi': 22, 'Zaid': 34},
    'Madhya Pradesh':  {'Kharif': 30, 'Rabi': 18, 'Zaid': 36},
    'Gujarat':         {'Kharif': 32, 'Rabi': 20, 'Zaid': 38},
    'Tamil Nadu':      {'Kharif': 30, 'Rabi': 26, 'Zaid': 33},
    'Karnataka':       {'Kharif': 27, 'Rabi': 22, 'Zaid': 32},
}

# ---- District -> (State, Soil Type, temperature offset from state baseline) ----
# Soil types reflect real, general district-level geography (e.g. Bankura's
# lateritic Rarh-region soil vs Purba Medinipur's coastal deltaic alluvium,
# both within West Bengal). Temperature offsets are small, curated
# adjustments for coastal/hill moderation, not measured station data.
districts = {
    # Punjab
    'Amritsar':          ('Punjab', 'Alluvial', 0),
    'Ludhiana':           ('Punjab', 'Alluvial', 0),
    'Bathinda':           ('Punjab', 'Alluvial', 1),
    # Uttar Pradesh
    'Varanasi':           ('Uttar Pradesh', 'Alluvial', 0),
    'Meerut':             ('Uttar Pradesh', 'Alluvial', 0),
    'Jhansi':             ('Uttar Pradesh', 'Red', 1),
    # Bihar
    'Patna':              ('Bihar', 'Alluvial', 0),
    'Gaya':               ('Bihar', 'Red', 0),
    # West Bengal
    'Bankura':            ('West Bengal', 'Laterite', 0),
    'Purulia':            ('West Bengal', 'Red', 1),
    'Purba Medinipur':    ('West Bengal', 'Alluvial', -2),
    'Paschim Medinipur':    ('West Bengal', 'Alluvial', -2),
    'Murshidabad':        ('West Bengal', 'Alluvial', 0),
    'Jalpaiguri':         ('West Bengal', 'Alluvial', -1),
    # Rajasthan
    'Jaisalmer':          ('Rajasthan', 'Sandy', 1),
    'Jodhpur':            ('Rajasthan', 'Sandy', 0),
    'Kota':               ('Rajasthan', 'Black', -1),
    'Udaipur':            ('Rajasthan', 'Red', -1),
    # Maharashtra
    'Nagpur':             ('Maharashtra', 'Black', 1),
    'Pune':               ('Maharashtra', 'Black', -1),
    'Nashik':             ('Maharashtra', 'Black', 0),
    'Kolhapur':           ('Maharashtra', 'Red', -1),
    # Madhya Pradesh
    'Indore':             ('Madhya Pradesh', 'Black', 0),
    'Bhopal':             ('Madhya Pradesh', 'Black', 0),
    'Chhindwara':         ('Madhya Pradesh', 'Red', -1),
    # Gujarat
    'Ahmedabad':          ('Gujarat', 'Black', 1),
    'Kutch':              ('Gujarat', 'Sandy', 2),
    'Surat':              ('Gujarat', 'Alluvial', -2),
    # Tamil Nadu
    'Coimbatore':         ('Tamil Nadu', 'Red', -1),
    'Thanjavur':          ('Tamil Nadu', 'Alluvial', 0),
    'Kanyakumari':        ('Tamil Nadu', 'Laterite', -2),
    # Karnataka
    'Bengaluru Rural':    ('Karnataka', 'Red', -2),
    'Belagavi':           ('Karnataka', 'Black', 0),
    'Dakshina Kannada':   ('Karnataka', 'Laterite', -2),
}

rows = []
for district, (state, soil, offset) in districts.items():
    for season in ['Kharif', 'Rabi', 'Zaid']:
        crops = base.get((soil, season), [])
        temp = state_season_temp[state][season] + offset
        for crop in crops:
            rows.append([state, district, soil, season, temp, crop])

with open('crop_data_v3.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['state', 'district', 'soil_type', 'season', 'temperature', 'crop'])
    writer.writerows(rows)

print(f"Generated {len(rows)} rows across {len(districts)} districts in {len(state_season_temp)} states")
print(f"Unique district+season combinations: {len(set((r[1], r[3]) for r in rows))}")

# Build state->district lookup for the frontend cascading dropdown
state_districts = {}
for d, (s, soil, off) in districts.items():
    state_districts.setdefault(s, []).append(d)
import json
with open('state_districts.json', 'w') as f:
    json.dump(state_districts, f, indent=2)
print("\nstate -> districts mapping:")
for s, ds in state_districts.items():
    print(f"  {s}: {ds}")
