module.exports = {
  preset: '@react-native/jest-preset',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|react-native.*|@react-navigation.*|react-native-vector-icons.*|@expo.*))',
  ],
};