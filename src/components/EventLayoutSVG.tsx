
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SponsorshipSpot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  label: string;
  price: number;
  available: boolean;
}

interface EventLayoutSVGProps {
  eventName?: string;
  spots?: SponsorshipSpot[];
  editable?: boolean;
}

const defaultSpots: SponsorshipSpot[] = [
  {
    id: 'stage',
    x: 200,
    y: 100,
    width: 200,
    height: 80,
    type: 'stage',
    label: 'Main Stage',
    price: 25000,
    available: true,
  },
  {
    id: 'entrance',
    x: 300,
    y: 400,
    width: 140,
    height: 40,
    type: 'entrance',
    label: 'Entrance',
    price: 15000,
    available: true,
  },
  {
    id: 'booth-1',
    x: 100,
    y: 200,
    width: 60,
    height: 60,
    type: 'booth',
    label: 'Booth 1',
    price: 8000,
    available: true,
  },
  {
    id: 'booth-2',
    x: 200,
    y: 200,
    width: 60,
    height: 60,
    type: 'booth',
    label: 'Booth 2',
    price: 8000,
    available: false,
  },
  {
    id: 'booth-3',
    x: 300,
    y: 200,
    width: 60,
    height: 60,
    type: 'booth',
    label: 'Booth 3',
    price: 8000,
    available: true,
  },
  {
    id: 'booth-4',
    x: 400,
    y: 200,
    width: 60,
    height: 60,
    type: 'booth',
    label: 'Booth 4',
    price: 8000,
    available: true,
  },
  {
    id: 'refreshments',
    x: 500,
    y: 250,
    width: 90,
    height: 70,
    type: 'refreshments',
    label: 'Refreshments',
    price: 12000,
    available: true,
  },
  {
    id: 'meeting-area',
    x: 100,
    y: 300,
    width: 150,
    height: 80,
    type: 'meeting',
    label: 'Meeting Area',
    price: 10000,
    available: true,
  },
];

const EventLayoutSVG = ({ 
  eventName = 'Dubai Tech Summit 2025', 
  spots = defaultSpots, 
  editable = false 
}: EventLayoutSVGProps) => {
  const [selectedSpot, setSelectedSpot] = useState<SponsorshipSpot | null>(null);
  const [layoutSpots, setLayoutSpots] = useState<SponsorshipSpot[]>(spots);
  
  const handleSpotClick = (spot: SponsorshipSpot) => {
    if (!editable && !spot.available) return;
    setSelectedSpot(spot);
  };
  
  const handleReserve = () => {
    if (selectedSpot) {
      toast.success(`Reserved ${selectedSpot.label} for AED ${selectedSpot.price.toLocaleString()}`);
      setLayoutSpots(spots.map(s => 
        s.id === selectedSpot.id ? { ...s, available: false } : s
      ));
      setSelectedSpot(null);
    }
  };

  const getSpotColor = (spot: SponsorshipSpot) => {
    if (spot.id === selectedSpot?.id) return '#1E40AF';
    if (!spot.available) return '#6B7280';
    
    switch (spot.type) {
      case 'stage': return '#3B82F6';
      case 'booth': return '#10B981';
      case 'entrance': return '#F59E0B';
      case 'refreshments': return '#EC4899';
      case 'meeting': return '#8B5CF6';
      default: return '#6B7280';
    }
  };
  
  const getSpotOpacity = (spot: SponsorshipSpot) => {
    if (spot.id === selectedSpot?.id) return '1';
    if (!spot.available) return '0.5';
    return '0.8';
  };

  return (
    <div className="relative bg-muted/20 rounded-xl p-4 overflow-hidden border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{eventName} - Sponsorship Layout</h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center">
            <span className="w-3 h-3 inline-block bg-green-500 rounded-full mr-1"></span>
            Available
          </span>
          <span className="flex items-center">
            <span className="w-3 h-3 inline-block bg-gray-500 rounded-full mr-1"></span>
            Reserved
          </span>
        </div>
      </div>

      <div className="relative overflow-auto bg-white rounded-md shadow-inner">
        <svg width="600" height="450" viewBox="0 0 600 450" className="w-full h-auto">
          {/* Grid lines for reference */}
          <g className="grid-lines" stroke="#E5E7EB" strokeWidth="0.5">
            {Array(12).fill(0).map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="450" />
            ))}
            {Array(9).fill(0).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} />
            ))}
          </g>
          
          {/* Room outline */}
          <rect x="50" y="50" width="500" height="350" fill="none" stroke="#9CA3AF" strokeWidth="2" />
          
          {/* Sponsorship spots */}
          {layoutSpots.map((spot) => (
            <g key={spot.id} onClick={() => handleSpotClick(spot)} 
              style={{ cursor: spot.available || editable ? 'pointer' : 'not-allowed' }}
              className="transition-all hover:drop-shadow-md"
            >
              <rect 
                x={spot.x} 
                y={spot.y} 
                width={spot.width} 
                height={spot.height} 
                rx="4"
                fill={getSpotColor(spot)}
                fillOpacity={getSpotOpacity(spot)}
                stroke={spot.id === selectedSpot?.id ? '#1E3A8A' : '#9CA3AF'}
                strokeWidth={spot.id === selectedSpot?.id ? '2' : '1'}
              />
              <text 
                x={spot.x + spot.width / 2} 
                y={spot.y + spot.height / 2} 
                textAnchor="middle" 
                dominantBaseline="middle"
                fill="white"
                fontSize="12"
              >
                {spot.label}
              </text>
            </g>
          ))}
          
          {/* Additional decoration */}
          <circle cx="300" cy="225" r="120" fill="none" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
        </svg>
      </div>
      
      {selectedSpot && (
        <div className="mt-4 p-4 bg-card rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">{selectedSpot.label}</h4>
              <p className="text-sm text-muted-foreground">{selectedSpot.type.charAt(0).toUpperCase() + selectedSpot.type.slice(1)} Sponsorship</p>
            </div>
            <div className="text-right">
              <p className="font-bold">AED {selectedSpot.price.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Exclusive sponsorship</p>
            </div>
          </div>
          
          {selectedSpot.available && !editable && (
            <Button onClick={handleReserve} className="w-full mt-2">
              Reserve This Spot
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventLayoutSVG;
