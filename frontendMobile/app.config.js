export default {
  expo: {
    newArchEnabled: true,
    scheme: "frontendmobile",
    plugins: [
      "@reactvision/react-viro"
    ],
    android: {
      package: "com.mtbvr.frontendmobile",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_API_KEY,
        }
      }
    },
    extra: {
      googleApiKey: process.env.GOOGLE_API_KEY,
      deeplApiKey: process.env.DEEPL_API_KEY,
      apiUrl: "http://192.168.1.42:5000/api",
    },
  }
};