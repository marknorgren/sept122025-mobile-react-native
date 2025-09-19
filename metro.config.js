// Metro configuration for Expo SDK 54
// Revert experimental ESM import support if it causes issues with your Node version.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  experimentalImportSupport: false,
};

module.exports = config;

