import { StackNavigator } from 'react-navigation';


/*-------------------- APP COMPONENTS --------------------*/

import HomeScreen from './js/Components/HomeScreen/HomeScreen';
import SessionScreen from './js/Components/SessionScreen/SessionScreen';
import SettingsScreen from './js/Components/SettingsScreen/SettingsScreen';


/*-------------------- REACT NAVIGATION NAVIGATOR --------------------*/

export default StackNavigator({
  Home: {screen: HomeScreen},
  Session: {screen: SessionScreen},
  Settings: {screen: SettingsScreen}
});
