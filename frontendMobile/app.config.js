require('./loadEnv');

export default {
  expo: {
    scheme: "frontendmobile",
    extra: {
      googleApiKey: process.env.GOOGLE_API_KEY,
      deeplApiKey: process.env.DEEPL_API_KEY,
    },
  },
};