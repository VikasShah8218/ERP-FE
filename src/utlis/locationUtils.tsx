import axios from "axios";

export const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number }> => {
    if (!("geolocation" in navigator)) {
        throw new Error("Geolocation is not supported by this browser.");
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
            },
            (error) => {
                reject(`Error getting location: ${error.message}`);
            }
        );
    });
};

export const getPlaceName = async (latitude: number, longitude: number): Promise<string> => {
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
                params: {
                    format: "json",
                    lat: latitude,
                    lon: longitude,
                },
            }
        );
        const data = response.data;
        return data.display_name || "Unknown Location";
    } catch (error) {
        console.error("Error during reverse geocoding:", error);
        return "Unknown Location";
    }
};
