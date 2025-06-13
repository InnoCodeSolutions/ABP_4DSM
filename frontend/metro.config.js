const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Suporte para arquivos .json
config.resolver.assetExts.push("json");

// A convenção de nomenclatura de arquivos (e.g., .web.tsx) já lida com a resolução específica de plataforma.
// Não precisamos mais do `resolveRequest` para 'react-native-maps' no web,
// pois o MapView.web.tsx será usado para a web.

// Suporte ao alias @config
config.resolver.sourceExts = [...config.resolver.sourceExts, "ts", "tsx"];
config.resolver.extraNodeModules = {
  "@config": path.resolve(__dirname, "src/config"),
};

module.exports = config;