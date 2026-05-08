import { useState } from "react";
import {
  Wifi,
  Utensils,
  WashingMachine,
  Wind,
  Thermometer,
  Tv,
  Droplets,
  Flame,
  ParkingCircle,
  Zap,
  Dumbbell,
  Drill,
  Waves,
  MountainSnow,
  MapPin,
  ChevronDown,
} from "lucide-react";

const AMENITY_ICONS: Record<string, any> = {
  Wifi: Wifi,
  Kitchen: Utensils,
  Washer: WashingMachine,
  Dryer: Wind,
  "Air conditioning": Droplets,
  Heating: Thermometer,
  TV: Tv,
  Pool: Waves,
  "Hot tub": Flame,
  "Free parking": ParkingCircle,
  "EV charger": Zap,
  Gym: Dumbbell,
  "BBQ grill": Drill,
  Beachfront: MapPin,
  Waterfront: MapPin,
  "Ski-in/Ski-out": MountainSnow,
};

interface AmenityGroupProps {
  title: string;
  items: string[];
  amenities: string[];
  setAmenities: React.Dispatch<React.SetStateAction<string[]>>;
  toggleArrayItem: (
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => void;
}

const AmenityGroup: React.FC<AmenityGroupProps> = ({
  title,
  items,
  amenities,
  setAmenities,
  toggleArrayItem,
}) => {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? items : items.slice(0, 6);
  const canExpand = items.length > 6;

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {visibleItems.map((amenity) => {
          const Icon = AMENITY_ICONS[amenity];
          const isSelected = amenities.includes(amenity);

          return (
            <button
              key={amenity}
              onClick={() => toggleArrayItem(amenities, setAmenities, amenity)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all duration-200 text-left
                ${isSelected
                  ? 'border-[#C45D3E] bg-[#FDF8F3] ring-1 ring-[#C45D3E]/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
            >
              {Icon && (
                <Icon
                  size={16}
                  className={`shrink-0 ${isSelected ? 'text-[#C45D3E]' : 'text-gray-500'}`}
                />
              )}
              <span className={`text-xs sm:text-sm font-medium truncate ${isSelected ? 'text-[#C45D3E]' : 'text-gray-700'}`}>
                {amenity}
              </span>
            </button>
          );
        })}
      </div>

      {canExpand && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-1 text-sm font-medium text-[#C45D3E] hover:text-[#A84B32] mt-2 transition"
        >
          Show more
          <ChevronDown size={14} />
        </button>
      )}
    </div>
  );
};

export default AmenityGroup;
