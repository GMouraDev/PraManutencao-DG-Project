interface BrazilMapSVGProps {
  selectedState: string | null;
  onStateClick: (state: string) => void;
  onStateHover: (state: string | null) => void;
}

export const BrazilMapSVG = ({ selectedState, onStateClick, onStateHover }: BrazilMapSVGProps) => {
  // States with vehicles
  const activeStates = ["MG", "ES", "RJ", "SP", "SC", "RS", "PR"];
  
  const states = [
    // North Region
    { id: "AM", name: "Amazonas", path: "M 80,80 L 110,75 L 135,75 L 155,80 L 165,90 L 170,105 L 165,120 L 155,130 L 135,135 L 110,135 L 90,130 L 75,120 L 70,105 L 75,90 Z", cx: 120, cy: 105, hasVehicles: false },
    { id: "PA", name: "Pará", path: "M 175,75 L 205,70 L 230,75 L 250,85 L 260,100 L 255,115 L 245,125 L 230,130 L 205,130 L 185,125 L 175,115 L 172,100 Z", cx: 215, cy: 100, hasVehicles: false },
    { id: "AC", name: "Acre", path: "M 50,100 L 70,95 L 85,100 L 90,110 L 85,120 L 70,125 L 55,120 L 50,110 Z", cx: 70, cy: 110, hasVehicles: false },
    { id: "RO", name: "Rondônia", path: "M 85,135 L 105,130 L 120,135 L 125,145 L 120,155 L 105,160 L 90,155 L 85,145 Z", cx: 105, cy: 145, hasVehicles: false },
    { id: "RR", name: "Roraima", path: "M 125,40 L 145,35 L 160,40 L 165,50 L 160,60 L 145,65 L 130,60 L 125,50 Z", cx: 145, cy: 50, hasVehicles: false },
    { id: "AP", name: "Amapá", path: "M 235,45 L 250,40 L 265,45 L 270,55 L 265,65 L 250,70 L 240,65 L 235,55 Z", cx: 252, cy: 55, hasVehicles: false },
    { id: "TO", name: "Tocantins", path: "M 230,140 L 250,135 L 265,140 L 275,155 L 270,170 L 255,180 L 240,180 L 225,170 L 220,155 Z", cx: 247, cy: 157, hasVehicles: false },
    
    // Northeast Region
    { id: "MA", name: "Maranhão", path: "M 265,90 L 290,85 L 310,90 L 325,100 L 330,115 L 325,130 L 310,140 L 290,140 L 270,130 L 265,115 Z", cx: 297, cy: 115, hasVehicles: false },
    { id: "PI", name: "Piauí", path: "M 275,145 L 295,140 L 310,145 L 320,160 L 315,175 L 300,185 L 285,185 L 270,175 L 268,160 Z", cx: 292, cy: 162, hasVehicles: false },
    { id: "CE", name: "Ceará", path: "M 330,95 L 355,90 L 375,95 L 385,105 L 385,120 L 375,130 L 355,135 L 335,130 L 328,120 L 328,105 Z", cx: 357, cy: 112, hasVehicles: false },
    { id: "RN", name: "Rio Grande do Norte", path: "M 388,100 L 405,95 L 418,100 L 422,110 L 418,120 L 405,125 L 392,120 L 388,110 Z", cx: 405, cy: 110, hasVehicles: false },
    { id: "PB", name: "Paraíba", path: "M 390,125 L 405,120 L 418,125 L 422,135 L 418,145 L 405,150 L 395,145 L 390,135 Z", cx: 406, cy: 135, hasVehicles: false },
    { id: "PE", name: "Pernambuco", path: "M 340,145 L 365,140 L 385,145 L 395,155 L 390,170 L 370,180 L 350,180 L 335,170 L 333,155 Z", cx: 363, cy: 160, hasVehicles: false },
    { id: "AL", name: "Alagoas", path: "M 390,175 L 405,170 L 418,175 L 422,185 L 418,195 L 405,200 L 395,195 L 390,185 Z", cx: 406, cy: 185, hasVehicles: false },
    { id: "SE", name: "Sergipe", path: "M 370,185 L 385,180 L 398,185 L 402,195 L 398,205 L 385,210 L 375,205 L 370,195 Z", cx: 386, cy: 195, hasVehicles: false },
    { id: "BA", name: "Bahia", path: "M 285,190 L 315,185 L 340,190 L 360,200 L 370,215 L 370,235 L 360,250 L 340,260 L 315,265 L 290,260 L 270,250 L 260,235 L 260,215 L 270,200 Z", cx: 315, cy: 227, hasVehicles: false },
    
    // Center-West Region
    { id: "MT", name: "Mato Grosso", path: "M 130,160 L 160,155 L 185,160 L 205,170 L 215,185 L 215,205 L 205,220 L 185,230 L 160,230 L 140,220 L 125,205 L 120,185 L 125,170 Z", cx: 167, cy: 192, hasVehicles: false },
    { id: "MS", name: "Mato Grosso do Sul", path: "M 130,235 L 155,230 L 175,235 L 190,245 L 195,260 L 190,275 L 175,285 L 155,290 L 135,285 L 120,270 L 115,255 L 120,245 Z", cx: 157, cy: 260, hasVehicles: false },
    { id: "GO", name: "Goiás", path: "M 220,180 L 245,175 L 265,180 L 280,195 L 285,210 L 280,225 L 265,235 L 245,240 L 225,235 L 210,220 L 205,205 L 210,190 Z", cx: 245, cy: 207, hasVehicles: false },
    { id: "DF", name: "Distrito Federal", path: "M 248,203 L 255,200 L 262,203 L 265,210 L 262,217 L 255,220 L 248,217 L 245,210 Z", cx: 255, cy: 210, hasVehicles: false },
    
    // Southeast Region (with vehicles)
    { 
      id: "MG", 
      name: "Minas Gerais",
      path: "M 240,240 L 270,235 L 295,240 L 315,250 L 325,265 L 325,280 L 315,295 L 295,305 L 270,310 L 245,305 L 225,295 L 210,280 L 205,265 L 210,250 Z",
      cx: 267,
      cy: 272,
      hasVehicles: true
    },
    { 
      id: "ES", 
      name: "Espírito Santo",
      path: "M 330,260 L 345,255 L 358,260 L 368,270 L 373,280 L 373,290 L 368,300 L 358,305 L 345,308 L 333,303 L 328,293 L 328,283 L 330,270 Z",
      cx: 350,
      cy: 281,
      hasVehicles: true
    },
    { 
      id: "RJ", 
      name: "Rio de Janeiro",
      path: "M 280,310 L 300,308 L 318,312 L 332,320 L 340,330 L 342,342 L 338,352 L 328,360 L 315,363 L 298,362 L 283,357 L 272,348 L 267,337 L 268,325 Z",
      cx: 305,
      cy: 337,
      hasVehicles: true
    },
    { 
      id: "SP", 
      name: "São Paulo",
      path: "M 195,310 L 220,307 L 245,310 L 265,318 L 280,330 L 288,345 L 288,360 L 280,372 L 265,382 L 245,387 L 220,385 L 200,378 L 183,368 L 170,355 L 163,340 L 160,325 L 165,315 Z",
      cx: 224,
      cy: 347,
      hasVehicles: true
    },
    
    // South Region (with vehicles)
    { 
      id: "PR", 
      name: "Paraná",
      path: "M 165,320 L 188,315 L 210,318 L 228,325 L 240,335 L 245,348 L 243,360 L 235,370 L 220,377 L 200,380 L 180,377 L 165,370 L 153,360 L 148,348 L 148,335 Z",
      cx: 196,
      cy: 347,
      hasVehicles: true
    },
    { 
      id: "SC", 
      name: "Santa Catarina",
      path: "M 180,385 L 200,382 L 220,385 L 238,392 L 252,402 L 260,413 L 262,425 L 258,437 L 248,446 L 233,452 L 215,454 L 197,451 L 180,444 L 167,434 L 158,422 L 155,410 L 157,398 Z",
      cx: 208,
      cy: 418,
      hasVehicles: true
    },
    { 
      id: "RS", 
      name: "Rio Grande do Sul",
      path: "M 155,455 L 175,452 L 195,455 L 213,462 L 228,472 L 238,485 L 243,500 L 243,515 L 238,530 L 228,542 L 213,552 L 195,557 L 175,555 L 157,548 L 142,538 L 132,525 L 127,510 L 125,495 L 127,480 L 135,467 Z",
      cx: 184,
      cy: 505,
      hasVehicles: true
    },
  ];

  return (
    <svg viewBox="40 25 400 550" className="w-full h-full drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {states.map((state) => {
        const isActive = state.hasVehicles;
        const isSelected = selectedState === state.id;
        
        return (
          <g key={state.id} className="transition-all duration-300">
            <path
              d={state.path}
              fill={
                isSelected 
                  ? "hsl(var(--primary) / 0.4)" 
                  : isActive 
                    ? "hsl(var(--primary) / 0.2)" 
                    : "hsl(var(--muted) / 0.3)"
              }
              stroke={
                isSelected 
                  ? "hsl(var(--primary))" 
                  : isActive 
                    ? "hsl(var(--primary) / 0.6)" 
                    : "hsl(var(--muted-foreground) / 0.2)"
              }
              strokeWidth={isSelected ? 4 : 2}
              className={isActive ? "cursor-pointer transition-all duration-300 hover:fill-primary/30 hover:stroke-primary hover:stroke-[3px]" : "pointer-events-none"}
              onClick={() => isActive && onStateClick(state.id)}
              onMouseEnter={() => isActive && onStateHover(state.id)}
              onMouseLeave={() => isActive && onStateHover(null)}
              style={{
                filter: isSelected ? 'url(#glow) url(#shadow)' : 'url(#shadow)',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                transformOrigin: `${state.cx}px ${state.cy}px`,
              }}
            />
            {isActive && (
              <text
                x={state.cx}
                y={state.cy}
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none select-none font-bold transition-all duration-300"
                fill={isSelected ? "hsl(var(--primary))" : "hsl(var(--foreground) / 0.9)"}
                style={{ 
                  fontSize: isSelected ? '20px' : '16px',
                  fontWeight: '700',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {state.id}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
