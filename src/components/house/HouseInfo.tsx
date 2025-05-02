"use client";

import { 
  Wifi, Car, Waves, Anchor, Bath, Flame, Tv, 
  Snowflake, UtensilsCrossed, Fish, Trees, Wind,
  Sunrise, Coffee
} from 'lucide-react';

export function HouseInfo() {
  const amenities = [
    { icon: <Wifi className="w-6 h-6" />, name: "High-speed WiFi" },
    { icon: <Car className="w-6 h-6" />, name: "Free parking (3 spaces)" },
    { icon: <Waves className="w-6 h-6" />, name: "Private beach access" },
    { icon: <Anchor className="w-6 h-6" />, name: "Private dock" },
    { icon: <Bath className="w-6 h-6" />, name: "Hot tub" },
    { icon: <UtensilsCrossed className="w-6 h-6" />, name: "BBQ grill" },
    { icon: <Flame className="w-6 h-6" />, name: "Indoor fireplace" },
    { icon: <Sunrise className="w-6 h-6" />, name: "Fire pit & seating area" },
    { icon: <Wind className="w-6 h-6" />, name: "2 Kayaks & paddle boards" },
    { icon: <Fish className="w-6 h-6" />, name: "Fishing gear provided" },
    { icon: <Coffee className="w-6 h-6" />, name: "Fully equipped kitchen" },
    { icon: <Tv className="w-6 h-6" />, name: "65\" Smart TV with Netflix" },
    { icon: <Snowflake className="w-6 h-6" />, name: "Central air conditioning" },
    { icon: <Trees className="w-6 h-6" />, name: "Outdoor dining for 10" },
  ];

  const rules = [
    { title: "Check-in/out", description: "Check-in: 3:00 PM | Check-out: 11:00 AM" },
    { title: "Maximum guests", description: "8 people maximum (including children)" },
    { title: "Quiet hours", description: "10:00 PM - 8:00 AM. Please respect our neighbors" },
    { title: "No smoking", description: "Smoking is not permitted inside the house" },
    { title: "Pets", description: "Pets are welcome! Please clean up after them and keep them leashed near water" },
    { title: "Events", description: "No parties or large gatherings without prior approval" },
    { title: "Parking", description: "Maximum 3 vehicles. Use designated parking area only" },
    { title: "Water safety", description: "Children must be supervised near water at all times" },
    { title: "Dock & boats", description: "Life jackets required for all water activities" },
    { title: "Trash disposal", description: "Please sort recycling and take trash to designated bins" },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">Amenities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="text-gray-700">{amenity.icon}</div>
              <span className="text-gray-900">{amenity.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">House rules</h2>
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
              <h3 className="font-semibold text-gray-900 mb-1">{rule.title}</h3>
              <p className="text-gray-600">{rule.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Important information</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            Welcome to our lakefront retreat! This house has been in our family for generations, 
            and we&apos;re excited to share it with you. The lake is pristine and perfect for swimming, 
            fishing, and water sports.
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Emergency contacts:</strong><br />
            House Manager: (555) 123-4567<br />
            Local Emergency: 911
          </p>
          <p className="text-gray-600">
            <strong>WiFi:</strong> Network: LakeHouse_Guest | Password: Will be provided upon booking confirmation
          </p>
        </div>
      </div>
    </div>
  );
}