import { AppRegistry } from 'react-native';
import App from './App'; // Olettaen, että App.js sijaitsee juuressa
import { name as appName } from './app.json'; // Varmista, että tämä polku ja tiedosto ovat oikein

AppRegistry.registerComponent(appName, () => App);
