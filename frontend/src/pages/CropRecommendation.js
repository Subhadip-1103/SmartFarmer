import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function CropRecommendation() {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [stateDistricts, setStateDistricts] = useState({});
  const [districtSoil, setDistrictSoil] = useState({});
  const [seasons, setSeasons] = useState([]);

  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [soilType, setSoilType] = useState('');
  const [season, setSeason] = useState('');
  const [temperature, setTemperature] = useState('');

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/cropai/recommend/')
      .then((response) => {
        setStates(response.data.states);
        setStateDistricts(response.data.state_districts);
        setDistrictSoil(response.data.district_soil);
        setSeasons(response.data.seasons);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load options. Please try again.');
      });
  }, []);

  const handleStateChange = (e) => {
    setState(e.target.value);
    setDistrict('');
    setSoilType('');
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setDistrict(selectedDistrict);
    // Auto-fill soil type based on district; farmer can still override it below
    setSoilType(selectedDistrict ? (districtSoil[selectedDistrict] || '') : '');
  };

  const availableDistricts = state ? (stateDistricts[state] || []) : [];

  // Unique list of all soil types across districts, for the dropdown options
  const soilOptions = useMemo(() => {
    const unique = new Set(Object.values(districtSoil).filter(Boolean));
    return Array.from(unique).sort();
  }, [districtSoil]);

  const isSoilAutoFilled = district && soilType === districtSoil[district];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResults(null);

    if (!state || !district || !soilType || !season || temperature === '') {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/cropai/recommend/', {
        state,
        district,
        soil_type: soilType,
        season,
        temperature: Number(temperature),
      });
      setResults(response.data);
    } catch (err) {
      console.error(err.response?.data);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/ai-service')}
          className="text-green-700 font-medium mb-6 hover:underline flex items-center gap-1"
        >
          <span aria-hidden>←</span> Back to Ai Services
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            AI Crop Recommendation
          </h2>
          <p className="text-gray-500 text-sm max-w-xl">
            Select your state, district, soil type, season, and current temperature to get
            AI-recommended crops tailored to your land.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5 lg:sticky lg:top-10"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                State
              </label>
              <select
                value={state}
                onChange={handleStateChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                District
              </label>
              <select
                value={district}
                onChange={handleDistrictChange}
                disabled={!state}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">{state ? 'Select District' : 'Select a state first'}</option>
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center justify-between">
                <span>Soil Type</span>
                {isSoilAutoFilled && (
                  <span className="text-xs font-normal text-green-600 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                    Auto-filled — you can change it
                  </span>
                )}
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                disabled={!district}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">{district ? 'Select Soil Type' : 'Select a district first'}</option>
                {soilOptions.map((soil) => (
                  <option key={soil} value={soil}>{soil}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              >
                <option value="">Select Season</option>
                {seasons.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Current Temperature (°C)
              </label>
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="e.g. 30"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            {error && (
              <p className="bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-xl border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-md shadow-green-200 hover:shadow-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                'Get Recommendations'
              )}
            </button>
          </form>

          {/* RESULTS */}
          <div className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[320px] flex flex-col">
            {loading && (
              <div className="space-y-4 animate-pulse">
                <div className="h-5 w-1/2 bg-gray-200 rounded" />
                <div className="h-3 w-2/3 bg-gray-200 rounded" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-full bg-gray-200 rounded" />
                    <div className="h-2 w-full bg-gray-100 rounded-full" />
                  </div>
                ))}
              </div>
            )}

            {!loading && !results && (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 py-10">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-3 text-2xl">
                  🌾
                </div>
                <p className="font-medium text-gray-500">No recommendations yet</p>
                <p className="text-sm mt-1 max-w-xs">
                  Fill out the form and hit "Get Recommendations" to see AI-suggested crops here.
                </p>
              </div>
            )}

            {!loading && results && (
              <div className="animate-[fadeIn_0.3s_ease-in]">
                <h3 className="text-lg font-bold text-gray-800 mb-1">Recommended Crops</h3>
                <p className="text-gray-500 text-sm mb-5">
                  For {results.district}, {results.state} ({results.soil_type} soil) —{' '}
                  {results.season} season, {results.temperature}°C
                </p>

                <div className="space-y-4">
                  {results.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/40 transition"
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-medium text-gray-800 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          {rec.crop}
                        </span>
                        <span className="text-green-700 text-sm font-semibold">
                          {rec.confidence}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${rec.confidence}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CropRecommendation;