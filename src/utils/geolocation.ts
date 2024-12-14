export const getCurrentLocation = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      resolve('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.display_name || `${latitude},${longitude}`;
          resolve(address);
        } catch (error) {
          console.error('Geocoding error:', error);
          resolve(`${latitude},${longitude}`);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        resolve('Location access denied');
      }
    );
  });
};