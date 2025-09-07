import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge,
  Cloud,
  Sunrise,
  Sunset,
  ArrowLeft,
  Loader2,
  Navigation,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
  cloudiness: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  coordinates: {
    lat: number;
    lon: number;
  };
}

interface ForecastItem {
  datetime: number;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  cloudiness: number;
}

interface ForecastData {
  city: string;
  country: string;
  forecast: ForecastItem[];
}

const Weather = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null);

  const API_BASE_URL = "/api/weather";

  useEffect(() => {
    // Try to get current location on component mount
    getCurrentLocationWeather();
  }, []);

  const getCurrentLocationWeather = async () => {
    console.log('🔍 Starting location detection...');
    
    if (!navigator.geolocation) {
      console.log('❌ Geolocation not supported');
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support location services. Showing weather for Delhi.",
        variant: "destructive"
      });
      handleSearch("New Delhi");
      return;
    }

    setLocationLoading(true);
    setError(null);
    console.log('📍 Requesting geolocation permission...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setLocationPermission('granted');
          
          console.log('📍 Got coordinates:', latitude, longitude);
          
          // Fetch weather using coordinates
          const apiUrl = `${API_BASE_URL}/demo/coordinates/${latitude}/${longitude}`;
          console.log('🌐 Fetching from:', apiUrl);
          
          const response = await fetch(apiUrl);
          console.log('📡 Response status:', response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.log('❌ Response error:', errorText);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const weatherData = await response.json();
          console.log('🌤️ Weather data received:', weatherData);
          
          setCurrentWeather(weatherData);
          
          // Generate mock forecast for current location
          const mockForecast: ForecastData = {
            city: weatherData.city,
            country: weatherData.country,
            forecast: Array.from({ length: 8 }, (_, i) => ({
              datetime: Math.floor(Date.now() / 1000) + (i + 1) * 3 * 3600,
              temperature: weatherData.temperature + (Math.random() - 0.5) * 10,
              description: ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 'light rain'][Math.floor(Math.random() * 5)],
              icon: ['01d', '02d', '03d', '04d', '10d'][Math.floor(Math.random() * 5)],
              humidity: Math.floor(Math.random() * 40) + 40,
              windSpeed: Math.floor(Math.random() * 10) + 5,
              cloudiness: Math.floor(Math.random() * 50) + 20
            }))
          };
          setForecast(mockForecast);

          toast({
            title: "Location Found",
            description: `Showing weather for ${weatherData.city}, ${weatherData.country}`,
          });
        } catch (err) {
          console.error('❌ Location weather error:', err);
          toast({
            title: "Location Weather Failed",
            description: "Couldn't get weather for your location. Showing Delhi weather.",
            variant: "destructive"
          });
          handleSearch("New Delhi");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        setLocationPermission('denied');
        
        console.log('❌ Geolocation error:', error.code, error.message);
        
        let errorMessage = "Location access denied.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services and refresh.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Location Access Failed",
          description: `${errorMessage} Showing weather for Delhi.`,
          variant: "destructive"
        });
        
        // Fallback to default city
        handleSearch("New Delhi");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // Cache for 5 minutes
      }
    );
  };

  const handleSearch = async (query?: string) => {
    const searchCity = query || searchQuery.trim();
    if (!searchCity) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch current weather
      const currentResponse = await fetch(`${API_BASE_URL}/demo/${encodeURIComponent(searchCity)}`);
      if (!currentResponse.ok) {
        throw new Error('Weather data not found');
      }
      const currentData = await currentResponse.json();
      setCurrentWeather(currentData);

      // For demo purposes, generate mock forecast data
      const mockForecast: ForecastData = {
        city: currentData.city,
        country: currentData.country,
        forecast: Array.from({ length: 8 }, (_, i) => ({
          datetime: Math.floor(Date.now() / 1000) + (i + 1) * 3 * 3600, // Every 3 hours
          temperature: currentData.temperature + (Math.random() - 0.5) * 10,
          description: ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 'light rain'][Math.floor(Math.random() * 5)],
          icon: ['01d', '02d', '03d', '04d', '10d'][Math.floor(Math.random() * 5)],
          humidity: Math.floor(Math.random() * 40) + 40,
          windSpeed: Math.floor(Math.random() * 10) + 5,
          cloudiness: Math.floor(Math.random() * 50) + 20
        }))
      };
      setForecast(mockForecast);

      if (!query) setSearchQuery(""); // Clear search if manually triggered
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      toast({
        title: "Weather Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="container py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Weather</h1>
        </div>
      </header>

      <main className="container pb-10">
        {/* Search Section */}
        <section className="mx-auto w-full max-w-2xl mb-8">
          <div className="flex gap-2">
            <Input
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={() => handleSearch()} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={getCurrentLocationWeather}
              disabled={locationLoading}
              className="flex items-center gap-2"
            >
              {locationLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Current Location</span>
            </Button>
          </div>
          
          {locationPermission === 'denied' && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Location Access Denied:</strong> Enable location permissions in your browser settings to get weather for your current location.
              </p>
            </div>
          )}
          
          {/* Debug Info */}
          <div className="mt-3 p-2 bg-gray-50 border rounded text-xs text-gray-600">
            <p><strong>Debug:</strong> Location permission: {locationPermission || 'unknown'}</p>
            <p>API Base URL: {API_BASE_URL}</p>
            {currentWeather && (
              <p>Current weather for: {currentWeather.city} ({currentWeather.coordinates?.lat}, {currentWeather.coordinates?.lon})</p>
            )}
          </div>
        </section>

        {error && (
          <div className="mx-auto w-full max-w-2xl mb-8">
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive text-center">{error}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {currentWeather && (
          <>
            {/* Current Weather */}
            <section className="mx-auto w-full max-w-4xl mb-8">
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {currentWeather.city}, {currentWeather.country}
                        {locationPermission === 'granted' && (
                          <Navigation className="h-4 w-4 text-blue-500" title="Using your current location" />
                        )}
                      </CardTitle>
                      <CardDescription>{new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant="outline" className="text-sm">
                        {locationPermission === 'granted' ? 'Your Location' : 'Live Weather'}
                      </Badge>
                      {locationPermission === 'granted' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={getCurrentLocationWeather}
                          disabled={locationLoading}
                          className="text-xs"
                        >
                          {locationLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <RefreshCw className="h-3 w-3 mr-1" />
                          )}
                          Refresh
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main Weather Display */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={getWeatherIcon(currentWeather.icon)}
                        alt={currentWeather.description}
                        className="w-20 h-20"
                      />
                      <div>
                        <div className="text-4xl font-bold">
                          {currentWeather.temperature}°C
                        </div>
                        <div className="text-muted-foreground capitalize">
                          {currentWeather.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 mb-1">
                        <Sunrise className="h-4 w-4" />
                        {formatTime(currentWeather.sunrise)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Sunset className="h-4 w-4" />
                        {formatTime(currentWeather.sunset)}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Weather Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">Humidity</div>
                        <div className="font-semibold">{currentWeather.humidity}%</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Wind className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">Wind</div>
                        <div className="font-semibold">{currentWeather.windSpeed} m/s</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Gauge className="h-5 w-5 text-orange-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">Pressure</div>
                        <div className="font-semibold">{currentWeather.pressure} hPa</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Eye className="h-5 w-5 text-purple-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">Visibility</div>
                        <div className="font-semibold">{(currentWeather.visibility / 1000).toFixed(1)} km</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Indicators */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <Cloud className="h-4 w-4" />
                          Cloudiness
                        </span>
                        <span>{currentWeather.cloudiness}%</span>
                      </div>
                      <Progress value={currentWeather.cloudiness} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <Droplets className="h-4 w-4" />
                          Humidity
                        </span>
                        <span>{currentWeather.humidity}%</span>
                      </div>
                      <Progress value={currentWeather.humidity} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Forecast */}
            {forecast && (
              <section className="mx-auto w-full max-w-4xl">
                <Card>
                  <CardHeader>
                    <CardTitle>8-Hour Forecast</CardTitle>
                    <CardDescription>Weather conditions for the next 24 hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {forecast.forecast.slice(0, 8).map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                        >
                          <div className="text-sm text-muted-foreground mb-2">
                            {formatDate(item.datetime)}
                          </div>
                          <img
                            src={getWeatherIcon(item.icon)}
                            alt={item.description}
                            className="w-12 h-12 mb-2"
                          />
                          <div className="text-lg font-semibold mb-1">
                            {Math.round(item.temperature)}°C
                          </div>
                          <div className="text-xs text-muted-foreground text-center capitalize">
                            {item.description}
                          </div>
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Droplets className="h-3 w-3" />
                            {item.humidity}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Weather;
