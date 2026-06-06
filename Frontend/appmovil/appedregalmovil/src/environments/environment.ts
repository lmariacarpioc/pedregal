export const environment = {
  production: false,
  // Since we are running in an emulator or device, localhost might not work.
  // Using 10.0.2.2 for Android emulator or localhost for browser testing.
  // Assuming localhost for now as we test in browser.
  apiUrl: 'http://localhost:8080/api'
};
