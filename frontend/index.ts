import { registerRootComponent } from 'expo';
import App from './src/App'; // Corrigir o caminho
// REMOVER ESTA LINHA: import 'leaflet/dist/leaflet.css';
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);