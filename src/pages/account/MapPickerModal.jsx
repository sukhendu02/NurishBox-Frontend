import { useState, useEffect, useRef, useCallback } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { MapPin, Navigation, Search, X, ArrowRight, Loader } from "lucide-react";

// ─── Stable libraries ref (must not be declared inline) ───────────────────────
const LIBRARIES = ["places"];

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 }; // centre of India

// ─── Custom map style (clean, brand-tinted) ───────────────────────────────────
const MAP_STYLES = [
  { featureType: "poi",          elementType: "labels",       stylers: [{ visibility: "off"    }] },
  { featureType: "transit",      elementType: "labels.icon",  stylers: [{ visibility: "off"    }] },
  { featureType: "road",         elementType: "geometry",     stylers: [{ color: "#f0f5f2"     }] },
  { featureType: "road.highway", elementType: "geometry",     stylers: [{ color: "#B2E8D6"     }] },
  { featureType: "water",        elementType: "geometry",     stylers: [{ color: "#c9e8f0"     }] },
  { featureType: "landscape",    elementType: "geometry",     stylers: [{ color: "#f8faf8"     }] },
];

// ─── Custom SVG pin ───────────────────────────────────────────────────────────
const buildPinIcon = () => ({
  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">
      <filter id="s"><feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="rgba(0,0,0,.25)"/></filter>
      <g filter="url(#s)">
        <path d="M20 2C11.16 2 4 9.16 4 18c0 12.5 16 32 16 32S36 30.5 36 18C36 9.16 28.84 2 20 2z" fill="#0D9E7E"/>
        <circle cx="20" cy="18" r="6.5" fill="white"/>
      </g>
    </svg>`)}`,
  scaledSize: { width: 40, height: 52 },
  anchor:     { x: 20,   y: 52       },
});

// ─── Reverse geocode → your API field shapes ──────────────────────────────────
function parseComponents(components) {
  const get = (type, short = false) => {
    const c = components.find(c => c.types.includes(type));
    return c ? (short ? c.short_name : c.long_name) : "";
  };

  const streetNumber = get("street_number");
  const route        = get("route");
  const line1 =
    [streetNumber, route].filter(Boolean).join(" ") ||
    get("premise") ||
    get("establishment") ||
    "";

  const line2 =
    get("sublocality_level_1") ||
    get("sublocality")         ||
    get("neighborhood")        ||
    get("sublocality_level_2") ||
    "";

  return {
    line1,
    line2,
    city:    get("locality")                    || get("administrative_area_level_2"),
    state:   get("administrative_area_level_1"),
    pincode: get("postal_code"),
    country: get("country") || "India",
  };
}

function reverseGeocode(lat, lng) {
  return new Promise(resolve => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        resolve(parseComponents(results[0].address_components));
      } else {
        resolve(null);
      }
    });
  });
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function MapPickerModal({ open, onClose, onConfirm, initial }) {
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  // Pin position on map
  const [pin, setPin] = useState(null);
  // Separate center so we can fly without resetting pin
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom,   setZoom]   = useState(5);

  const [locating,   setLocating]   = useState(false); // GPS request in-flight
  const [geocoding,  setGeocoding]  = useState(false); // reverse geocode in-flight
  const [confirming, setConfirming] = useState(false); // confirm button in-flight
  const [preview,    setPreview]    = useState("");    // short address shown below map

  const mapRef    = useRef(null);
  const searchRef = useRef(null);
  const pinIcon   = useRef(null);

  // Initialise pin when modal opens
  useEffect(() => {
    if (!open) return;

    if (initial?.latitude && initial?.longitude) {
      const pos = {
        lat: parseFloat(initial.latitude),
        lng: parseFloat(initial.longitude),
      };
   
      setPin(pos);
      setCenter(pos);
      setZoom(16);
    } else {
      setPin(null);
      setCenter(DEFAULT_CENTER);
      setZoom(5);
      setPreview("");
    }
  }, [open]);

  // Build icon once Maps SDK is loaded
  useEffect(() => {
    if (isLoaded) pinIcon.current = buildPinIcon();
  }, [isLoaded]);

  // Reverse-geocode whenever pin moves
  useEffect(() => {
    if (!pin || !isLoaded) return;
    let stale = false;

    setGeocoding(true);
    reverseGeocode(pin.lat, pin.lng).then(result => {
      if (stale) return;
      setGeocoding(false);
      if (result) {
        setPreview(
          [result.line1, result.line2, result.city, result.state]
            .filter(Boolean).join(", ")
        );
      } else {
        setPreview("");
      }
    });

    return () => { stale = true; };
  }, [pin, isLoaded]);

  // ── Map interactions ──────────────────────────────────────────────────────
  const handleMapClick = useCallback(e => {
    setPin({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  }, []);

  const handleMarkerDragEnd = useCallback(e => {
    setPin({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  }, []);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = { lat: coords.latitude, lng: coords.longitude };
        setPin(pos);
        setCenter(pos);
        setZoom(17);
        setLocating(false);
        mapRef.current?.panTo(pos);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePlacesChanged = () => {
    const places = searchRef.current?.getPlaces();
    if (!places?.length) return;
    const place = places[0];
    if (!place.geometry?.location) return;
    const pos = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setPin(pos);
    setCenter(pos);
    setZoom(17);
    mapRef.current?.panTo(pos);
  };

  const handleConfirm = async () => {
    if (!pin) return;
    setConfirming(true);
    const addressFields = await reverseGeocode(pin.lat, pin.lng);
    setConfirming(false);
    onConfirm({
      latitude:  String(pin.lat),
      longitude: String(pin.lng),
      ...(addressFields ?? {}),
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: "90vh", maxHeight: 680 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#eef5f0] flex-shrink-0">
          <div>
            <p className="text-[17px] font-extrabold text-[#033428]">
              Pick Location
            </p>
            <p className="text-[12px] text-[#999] mt-0.5">
              Search or tap the map to drop a pin
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0f5f2] flex items-center justify-center text-[#999] hover:text-[#033428] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search box */}
        <div className="px-4 pt-3 pb-2 flex-shrink-0 bg-white">
          {isLoaded ? (
            <StandaloneSearchBox
              onLoad={ref  => { searchRef.current = ref; }}
              onPlacesChanged={handlePlacesChanged}
            >
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa] pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search address, landmark, area…"
                  className="w-full h-10 pl-9 pr-4 rounded-xl border-[1.5px] border-[#e0ebe0] text-[13px] font-medium text-[#1a2e1a] outline-none bg-[#fafcfa] focus:border-brand-primary transition-colors placeholder:text-[#ccc] placeholder:font-normal"
                />
              </div>
            </StandaloneSearchBox>
          ) : (
            <div className="w-full h-10 rounded-xl bg-[#eef5f0] animate-pulse" />
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative min-h-0">
          {/* Loading */}
          {!isLoaded && !loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#f8faf8]">
              <Loader size={26} className="text-brand-primary animate-spin" />
              <p className="text-[13px] text-[#999]">Loading map…</p>
            </div>
          )}

          {/* Load error */}
          {loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#f8faf8] px-6 text-center">
              <MapPin size={28} className="text-red-300" />
              <p className="text-[14px] font-bold text-[#033428]">Map failed to load</p>
              <p className="text-[12px] text-[#999]">
                Check your <code className="text-brand-primary">VITE_GOOGLE_MAPS_API_KEY</code> and
                that Maps JavaScript API + Places API are enabled in Google Cloud.
              </p>
            </div>
          )}

          {/* Map itself */}
          {isLoaded && !loadError && (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={zoom}
              options={{
                styles:           MAP_STYLES,
                disableDefaultUI: true,
                zoomControl:      true,
                gestureHandling:  "greedy",
                clickableIcons:   false,
                zoomControlOptions: {
                  position: window.google.maps.ControlPosition.RIGHT_CENTER,
                },
              }}
              onClick={handleMapClick}
              onLoad={map => { mapRef.current = map; }}
            >
              {pin && (
                <Marker
                  position={pin}
                  draggable
                  onDragEnd={handleMarkerDragEnd}
                  icon={pinIcon.current}
                  animation={window.google.maps.Animation.DROP}
                />
              )}
            </GoogleMap>
          )}

          {/* "Tap to drop pin" hint */}
          {isLoaded && !pin && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 border border-[#e0ebe0] shadow-sm">
                <MapPin size={12} className="text-brand-primary" />
                <p className="text-[12px] font-semibold text-[#555]">
                  Tap anywhere to drop a pin
                </p>
              </div>
            </div>
          )}

          {/* Current location FAB */}
          {isLoaded && (
            <button
              onClick={handleCurrentLocation}
              disabled={locating}
              title="Use my current location"
              className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-brand-primary hover:bg-brand-surface transition-colors disabled:opacity-50 border border-[#e0ebe0]"
            >
              {locating
                ? <Loader size={18} className="animate-spin" />
                : <Navigation size={18} />
              }
            </button>
          )}
        </div>

        {/* Bottom panel */}
        <div className="flex-shrink-0 bg-white border-t border-[#eef5f0] px-4 py-4 space-y-3">
          {/* Address preview */}
          {pin && (
            <div className="flex items-start gap-2.5 bg-brand-surface rounded-xl px-3 py-2.5 min-h-[40px]">
              {geocoding
                ? <Loader size={14} className="text-brand-primary animate-spin mt-0.5 flex-shrink-0" />
                : <MapPin  size={14} className="text-brand-primary mt-0.5 flex-shrink-0" />
              }
              <p className="text-[12px] text-[#033428] font-medium leading-relaxed">
                {geocoding
                  ? "Fetching address details…"
                  : preview || "Address not found — you can fill the fields manually"
                }
              </p>
            </div>
          )}

          {/* Confirm CTA */}
          <button
            onClick={handleConfirm}
            disabled={!pin || confirming}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-deeper text-white font-extrabold text-[15px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(13,158,126,.25)] hover:scale-[1.01] active:scale-[.98] transition-transform disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {confirming
              ? <Loader size={16} className="animate-spin" />
              : <ArrowRight size={16} />
            }
            {confirming ? "Getting address…" : "Confirm Location"}
          </button>
        </div>
      </div>
    </div>
  );
}