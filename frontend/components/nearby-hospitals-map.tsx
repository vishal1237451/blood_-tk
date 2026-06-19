"use client";

import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Loader2, MapPin, Search, Star, Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";

// Component that handles the actual Places API search once the map is loaded
function PlacesHandler({
  userLocation,
  onPlacesFound,
}: {
  userLocation: google.maps.LatLngLiteral | null;
  onPlacesFound: (places: google.maps.places.PlaceResult[]) => void;
}) {
  const map = useMap();
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLib || !map || !userLocation) return;

    const service = new placesLib.PlacesService(map);
    const request = {
      location: userLocation,
      radius: 5000, // 5km radius
      type: "hospital",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === placesLib.PlacesServiceStatus.OK && results) {
        onPlacesFound(results);
      }
    });
  }, [placesLib, map, userLocation, onPlacesFound]);

  return null;
}

// Component to handle map centering and zoom level dynamically
function MapCenterController({
  userLocation,
  selectedHospital,
}: {
  userLocation: google.maps.LatLngLiteral | null;
  selectedHospital: google.maps.places.PlaceResult | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (selectedHospital && selectedHospital.geometry?.location) {
      map.panTo({
        lat: selectedHospital.geometry.location.lat(),
        lng: selectedHospital.geometry.location.lng(),
      });
      map.setZoom(15);
    } else if (userLocation) {
      map.panTo(userLocation);
      map.setZoom(13);
    }
  }, [map, selectedHospital, userLocation]);

  return null;
}

// Mock data generator helper for local testing
const getMockHospitals = (userLocation: google.maps.LatLngLiteral): google.maps.places.PlaceResult[] => {
  const baseLat = userLocation.lat;
  const baseLng = userLocation.lng;

  return [
    {
      place_id: "mock_hosp_1",
      name: "City Central Hospital",
      vicinity: "123 Healthcare Ave, Downtown",
      rating: 4.6,
      user_ratings_total: 245,
      business_status: "OPERATIONAL",
      opening_hours: {
        open_now: true,
        periods: [],
        weekday_text: []
      },
      geometry: {
        location: {
          lat: () => baseLat + 0.008,
          lng: () => baseLng - 0.005,
          equals: () => false,
          toJSON: () => ({ lat: baseLat + 0.008, lng: baseLng - 0.005 })
        } as any,
        viewport: null as any
      }
    },
    {
      place_id: "mock_hosp_2",
      name: "Metro General Hospital",
      vicinity: "456 Medical Parkway, Northside",
      rating: 4.2,
      user_ratings_total: 180,
      business_status: "OPERATIONAL",
      opening_hours: {
        open_now: false,
        periods: [],
        weekday_text: []
      },
      geometry: {
        location: {
          lat: () => baseLat - 0.006,
          lng: () => baseLng + 0.009,
          equals: () => false,
          toJSON: () => ({ lat: baseLat - 0.006, lng: baseLng + 0.009 })
        } as any,
        viewport: null as any
      }
    },
    {
      place_id: "mock_hosp_3",
      name: "St. Jude Care Center",
      vicinity: "789 Hope Street, East End",
      rating: 4.8,
      user_ratings_total: 312,
      business_status: "OPERATIONAL",
      opening_hours: {
        open_now: true,
        periods: [],
        weekday_text: []
      },
      geometry: {
        location: {
          lat: () => baseLat + 0.003,
          lng: () => baseLng + 0.004,
          equals: () => false,
          toJSON: () => ({ lat: baseLat + 0.003, lng: baseLng + 0.004 })
        } as any,
        viewport: null as any
      }
    },
    {
      place_id: "mock_hosp_4",
      name: "Grace Community Clinic",
      vicinity: "101 Wellness Blvd, Westside",
      rating: 3.9,
      user_ratings_total: 48,
      business_status: "CLOSED_TEMPORARILY",
      opening_hours: {
        open_now: false,
        periods: [],
        weekday_text: []
      },
      geometry: {
        location: {
          lat: () => baseLat - 0.004,
          lng: () => baseLng - 0.007,
          equals: () => false,
          toJSON: () => ({ lat: baseLat - 0.004, lng: baseLng - 0.007 })
        } as any,
        viewport: null as any
      }
    },
    {
      place_id: "mock_hosp_5",
      name: "Apex Emergency Hospital",
      vicinity: "202 Sector 4, South Plaza",
      rating: 4.5,
      user_ratings_total: 95,
      business_status: "OPERATIONAL",
      opening_hours: {
        open_now: true,
        periods: [],
        weekday_text: []
      },
      geometry: {
        location: {
          lat: () => baseLat + 0.011,
          lng: () => baseLng - 0.002,
          equals: () => false,
          toJSON: () => ({ lat: baseLat + 0.011, lng: baseLng - 0.002 })
        } as any,
        viewport: null as any
      }
    }
  ];
};

// Helper function to safely extract the open_now boolean from a PlaceResult
const getIsOpen = (hospital: google.maps.places.PlaceResult): boolean | undefined => {
  if (!hospital.opening_hours) return undefined;
  
  if (typeof hospital.opening_hours.open_now === "boolean") {
    return hospital.opening_hours.open_now;
  }
  
  if (typeof hospital.opening_hours.open_now === "function") {
    try {
      return (hospital.opening_hours.open_now as any)();
    } catch (e) {}
  }
  
  if (typeof hospital.opening_hours.isOpen === "function") {
    try {
      return hospital.opening_hours.isOpen();
    } catch (e) {}
  }
  
  return undefined;
};

export function NearbyHospitalsMap() {
  const [mounted, setMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [hospitals, setHospitals] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<google.maps.places.PlaceResult | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Initialize mock data when user location is retrieved
  useEffect(() => {
    if (userLocation) {
      setHospitals(getMockHospitals(userLocation));
    }
  }, [userLocation]);

  useEffect(() => {
    setMounted(true);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setLocationError("Unable to retrieve your location. Please enable location services.");
        setLoading(false);
      }
    );
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[650px] w-full flex-col items-center justify-center rounded-xl border bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Initializing Map...</p>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <Card className="border-dashed border-2 bg-muted/50 p-12 text-center">
        <h3 className="text-lg font-semibold text-foreground">Google Maps API Key Missing</h3>
        <p className="text-muted-foreground mt-2">
          Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.
        </p>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[500px] w-full flex-col items-center justify-center rounded-xl border bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Finding your location...</p>
      </div>
    );
  }

  if (locationError || !userLocation) {
    return (
      <Card className="border-destructive/50 bg-destructive/10 p-12 text-center">
        <h3 className="text-lg font-semibold text-destructive">Location Error</h3>
        <p className="text-destructive/80 mt-2">{locationError}</p>
      </Card>
    );
  }

  // Filter hospitals based on search input
  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.vicinity?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <APIProvider apiKey={apiKey}>
      <div className="flex flex-col md:flex-row h-[650px] w-full rounded-xl border overflow-hidden bg-background">
        {/* Left Side: Hospital List Sidebar */}
        <div className="flex flex-col w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r bg-card overflow-hidden h-[250px] md:h-full">
          {/* Search Header */}
          <div className="p-4 border-b bg-muted/20 flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search hospitals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </div>

          {/* List Status Summary */}
          <div className="px-4 py-2 bg-muted/10 border-b text-xs text-muted-foreground flex justify-between items-center shrink-0">
            <span>Found {filteredHospitals.length} hospitals</span>
            {selectedHospital && (
              <button
                onClick={() => setSelectedHospital(null)}
                className="text-primary hover:underline font-semibold"
              >
                Clear Selection
              </button>
            )}
          </div>

          {/* Scrollable Hospital List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {filteredHospitals.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No hospitals found nearby.
              </div>
            ) : (
              filteredHospitals.map((hospital) => {
                const isSelected = selectedHospital?.place_id === hospital.place_id;
                const rating = hospital.rating;
                const isOpen = getIsOpen(hospital);
                const isOperational = hospital.business_status === "OPERATIONAL";

                return (
                  <button
                    key={hospital.place_id}
                    onClick={() => setSelectedHospital(hospital)}
                    className={`w-full text-left p-4 transition-all hover:bg-muted/40 flex flex-col gap-1.5 border-l-4 ${
                      isSelected
                        ? "bg-muted/80 border-primary font-medium"
                        : "border-transparent"
                    }`}
                  >
                    <div className="font-semibold text-foreground text-sm line-clamp-1">
                      {hospital.name}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {hospital.vicinity}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {isOperational ? (
                        isOpen === true ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">
                            <Clock className="h-3 w-3" />
                            Open Now
                          </span>
                        ) : isOpen === false ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
                            <Clock className="h-3 w-3" />
                            Closed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                            <Clock className="h-3 w-3" />
                            Operational
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold text-yellow-600 dark:text-yellow-400">
                          <AlertTriangle className="h-3 w-3" />
                          Temporarily Closed
                        </span>
                      )}
                      {rating && (
                        <span className="inline-flex items-center gap-0.5 text-xs text-amber-500 font-medium">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          {rating}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        {hospital.vicinity && (
                          <div>
                            <span className="font-semibold text-foreground">Address:</span> {hospital.vicinity}
                          </div>
                        )}
                        {rating && (
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-foreground">Rating:</span>
                            <span className="inline-flex items-center gap-0.5 text-amber-500 font-medium">
                              ★ {rating}
                            </span>
                            {hospital.user_ratings_total && (
                              <span>({hospital.user_ratings_total} reviews)</span>
                            )}
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-foreground">Status:</span>{" "}
                          {isOperational ? (
                            isOpen === true ? "Open Now" : isOpen === false ? "Closed" : "Operational"
                          ) : (
                            "Temporarily Closed"
                          )}
                        </div>
                        <div className="mt-2 flex gap-2">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              hospital.name || ""
                            )}&query_place_id=${hospital.place_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                            onClick={(e) => e.stopPropagation()} // Prevent clicking the card button again
                          >
                            Open in Google Maps
                          </a>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Map Container */}
        <div className="flex-1 relative h-[400px] md:h-full">
          <Map
            defaultCenter={userLocation}
            defaultZoom={13}
            mapId="hospital_finder_map"
            disableDefaultUI={true}
            zoomControl={true}
          >
            {/* Dynamic Map Auto-Centering */}
            <MapCenterController userLocation={userLocation} selectedHospital={selectedHospital} />

            {/* User Location Marker */}
            <AdvancedMarker position={userLocation}>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 shadow-lg ring-4 ring-blue-500/30">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
            </AdvancedMarker>

            {/* Hospital Markers */}
            {filteredHospitals.map((hospital, index) => (
              <AdvancedMarker
                key={hospital.place_id || index}
                position={{
                  lat: hospital.geometry?.location?.lat() || 0,
                  lng: hospital.geometry?.location?.lng() || 0,
                }}
                onClick={() => setSelectedHospital(hospital)}
              >
                <MapPin className="h-8 w-8 text-red-500 fill-white drop-shadow-md" />
              </AdvancedMarker>
            ))}

            {/* Info Window for Selected Hospital */}
            {selectedHospital && (
              <InfoWindow
                position={{
                  lat: selectedHospital.geometry?.location?.lat() || 0,
                  lng: selectedHospital.geometry?.location?.lng() || 0,
                }}
                onCloseClick={() => setSelectedHospital(null)}
              >
                <div className="p-2 max-w-[250px]">
                  <h3 className="font-semibold text-gray-900">{selectedHospital.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedHospital.vicinity}</p>

                  <div className="mt-3 flex items-center gap-2">
                    {selectedHospital.business_status === "OPERATIONAL" ? (
                      getIsOpen(selectedHospital) === true ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Open Now
                        </span>
                      ) : getIsOpen(selectedHospital) === false ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          Closed
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          Operational
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Temporarily Closed
                      </span>
                    )}
                    {selectedHospital.rating && (
                      <span className="text-xs text-gray-500 font-medium">
                        ★ {selectedHospital.rating}
                      </span>
                    )}
                  </div>
                </div>
              </InfoWindow>
            )}

            <PlacesHandler userLocation={userLocation} onPlacesFound={setHospitals} />
          </Map>
        </div>
      </div>
    </APIProvider>
  );
}

