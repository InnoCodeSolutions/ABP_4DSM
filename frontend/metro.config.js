// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && moduleName === "react-native-maps") {
    // Alias react-native-maps to an empty module for web
    return {
      type: "empty",
    };
  }
  // Use the default resolver for all other cases
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;