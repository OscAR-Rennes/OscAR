require('./loadEnv');

export default {
  expo: {
    scheme: "frontendmobile",
    extra: {
      googleApiKey: process.env.GOOGLE_API_KEY,
      deeplApiKey: process.env.DEEPL_API_KEY,
      apiUrl: "http://192.168.1.42:5000/api",
    },
    android: {
      package: "com.mtbvr.frontendmobile", 
    },
  },
};