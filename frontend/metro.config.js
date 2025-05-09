const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Suporte para arquivos .json
config.resolver.assetExts.push("json");

// Configuração para react-native-maps no web
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && moduleName === "react-native-maps") {
    return {
      type: "empty",
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Suporte ao alias @config
config.resolver.sourceExts = [...config.resolver.sourceExts, "ts", "tsx"];
config.resolver.extraNodeModules = {
  "@config": path.resolve(__dirname, "src/config"),
};

module.exports = config;