import { useNavigate } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------
const COLORS = {
  background: '#faf6ee',
  darkGreen: '#16311d',
  darkest: '#0f2415',
  bodyText: '#23301f',
  mutedText: '#5b6b57',
  accent: '#6b8f52',
  brightAccent: '#a8cf7e',
  border: '#e3decb',
};

// Circuit-board line pattern (PCB traces + nodes), tinted lime, low opacity —
// echoes the "AI on a circuit board" look without a copied photo.
const CIRCUIT_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='%23a8cf7e' stroke-width='1.2' opacity='0.35'%3E%3Cpath d='M10 40h40v30h30M60 10v20M110 10v50h40M160 30v60h30M20 100h60v40h-40v30M140 100h40v40M100 140v40h-30'/%3E%3Ccircle cx='10' cy='40' r='3' fill='%23a8cf7e' stroke='none'/%3E%3Ccircle cx='60' cy='10' r='3' fill='%23a8cf7e' stroke='none'/%3E%3Ccircle cx='110' cy='60' r='3' fill='%23a8cf7e' stroke='none'/%3E%3Ccircle cx='150' cy='10' r='3' fill='%23a8cf7e' stroke='none'/%3E%3Ccircle cx='190' cy='90' r='3' fill='%23a8cf7e' stroke='none'/%3E%3Ccircle cx='20' cy='100' r='3' fill='%23a8cf7e' stroke='none'/%3E%3Ccircle cx='80' cy='140' r='3' fill='%23a8cf7e' stroke='none'/%3E%3Ccircle cx='140' cy='140' r='3' fill='%23a8cf7e' stroke='none'/%3E%3Ccircle cx='180' cy='140' r='3' fill='%23a8cf7e' stroke='none'/%3E%3Ccircle cx='70' cy='180' r='3' fill='%23a8cf7e' stroke='none'/%3E%3C/g%3E%3C/svg%3E")`;

// Soft glowing "bokeh" dots, positioned + blurred purely with CSS.
const GLOW_DOTS = [
  { top: '8%', left: '15%', size: 10, color: COLORS.brightAccent },
  { top: '20%', left: '75%', size: 14, color: COLORS.brightAccent },
  { top: '55%', left: '85%', size: 8, color: '#f0d9a8' },
  { top: '70%', left: '10%', size: 12, color: '#f0d9a8' },
  { top: '40%', left: '45%', size: 9, color: COLORS.accent },
  { top: '85%', left: '55%', size: 11, color: COLORS.brightAccent },
];

function GlowDots() {
  return (
    <>
      {GLOW_DOTS.map((dot, i) => (
        <span
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            backgroundColor: dot.color,
            filter: 'blur(6px)',
            opacity: 0.55,
          }}
        />
      ))}
    </>
  );
}

function Hero() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ backgroundColor: COLORS.darkest }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: CIRCUIT_PATTERN, backgroundRepeat: 'repeat' }}
      />
      <GlowDots />

      <div className="relative max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="flex justify-center mb-5">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
            style={{ backgroundColor: COLORS.brightAccent, color: COLORS.darkGreen }}
          >
            AI POWERED
          </span>
        </div>

        <h2 className="font-display text-4xl mb-3" style={{ color: '#faf6ee' }}>
          AI Service
        </h2>
        <p className="text-base max-w-md mx-auto" style={{ color: '#cdd8c6' }}>
          Smarter farming decisions, powered by AI — from planting to protecting your crop.
        </p>
      </div>
    </div>
  );
}

const SERVICES = [
  {
    path: '/crop-recommendation',
    icon: SproutIcon,
    title: 'Crop Recommendation',
    description: 'Get AI-recommended crops based on soil & season',
    tint: '#cce3b7',
  },
  {
    path: '/disease-prediction',
    icon: MicroscopeIcon,
    title: 'Disease Prediction',
    description: 'Detect diseases from leaf photos',
    tint: '#a3c8df',
  },
];

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
function SproutIcon() {
  return (
    <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={COLORS.darkGreen} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 20h10" />
      <path d="M10 20c0-4.4-.4-6.8-2.6-9C5.4 9 3 8.5 3 8.5S3.5 11 5.7 13.2C7.9 15.4 10 15 10 20Z" />
      <path d="M14 20c0-6.5.5-9.5 3.5-12C19.5 6.3 21 6 21 6s-.4 2.2-2.5 4.3C16.4 12.4 14 13 14 20Z" />
      <path d="M10 15c1-1 3-1 4 0" />
    </svg>
  );
}

function MicroscopeIcon() {
  return (
    <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={COLORS.darkGreen} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h4v4a2 2 0 0 1-2 2Z" />
      <path d="M8 6V4h2" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Presentational pieces
// ---------------------------------------------------------------------------
function ServiceCard({ path, icon: Icon, title, description, tint, onSelect }) {
  return (
    <button
      onClick={() => onSelect(path)}
      className="group text-left rounded-2xl p-8 bg-white border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: COLORS.border }}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
        style={{ backgroundColor: tint }}
      >
        <Icon />
      </div>

      <h3 className="font-display text-xl mb-2" style={{ color: COLORS.darkGreen }}>
        {title}
      </h3>

      <p className="text-sm leading-relaxed mb-5" style={{ color: COLORS.mutedText }}>
        {description}
      </p>

      <span
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-transform duration-200 group-hover:translate-x-1"
        style={{ color: COLORS.accent }}
      >
        Get started
        <ArrowRightIcon />
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
function AIService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>
      <Hero />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SERVICES.map((service) => (
            <ServiceCard key={service.path} {...service} onSelect={navigate} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIService;