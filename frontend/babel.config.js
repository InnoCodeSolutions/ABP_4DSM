require('dotenv').config(); // carrega .env antes do plugin

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      // permite alternar .env por NODE_ENV ou outra var
      path: process.env.ENVFILE || '.env',
      safe: false,            // se true, exige .env.example com todas as keys
      allowUndefined: true,   // não falha se faltar VAR
      verbose: false,
    }],
  ],
};
