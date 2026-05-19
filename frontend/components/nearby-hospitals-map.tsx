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
import { Loader2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/frontend/components/ui/card";

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

export function NearbyHospitalsMap() {
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [hospitals, setHospitals] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<google.maps.places.PlaceResult | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
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

  return (
    <div className="flex h-[600px] w-full flex-col rounded-xl border overflow-hidden">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={userLocation}
          defaultZoom={13}
          mapId="hospital_finder_map"
          disableDefaultUI={true}
          zoomControl={true}
        >
          {/* User Location Marker */}
          <AdvancedMarker position={userLocation}>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 shadow-lg ring-4 ring-blue-500/30">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </AdvancedMarker>

          {/* Hospital Markers */}
          {hospitals.map((hospital, index) => (
            <AdvancedMarker
              key={hospital.place_id || index}
              position={{
                lat: hospital.geometry?.location?.lat() || 0,
                lng: hospital.geometry?.location?.lng() || 0,
              }}
              onClick={() => setSelectedHospital(hospital)}
            >
              <MapPin className="h-8 w-8 text-red-500 fill-white" />
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
                    selectedHospital.opening_hours?.open_now ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Open Now
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        Closed
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
      </APIProvider>
    </div>
  );
}
