import { StackNavigator } from 'react-navigation';


/*-------------------- APP COMPONENTS --------------------*/

import HomeScreen from './js/Components/Home/HomeScreen';
import SessionScreen from './js/Components/Session/SessionScreen';
import SettingsScreen from './js/Components/Settings/SettingsScreen';

import IncrementsScreen from './js/Components/Settings/Increments/IncrementsScreen';
import IncrementsPickerScreen from './js/Components/Settings/Increments/IncrementsPickerScreen';
import EditSessionsScreen from './js/Components/Settings/EditSessions/EditSessionsScreen';
import EditSessionsPickerScreen from './js/Components/Settings/EditSessions/EditSessionsPickerScreen';


/*-------------------- REACT NAVIGATION NAVIGATOR --------------------*/

export default StackNavigator({
  Home: {screen: HomeScreen},
  Session: {screen: SessionScreen},
  Settings: {screen: SettingsScreen},
  Increments: {screen: IncrementsScreen},
  IncrementsPicker: {screen: IncrementsPickerScreen},
  EditSessions: {screen: EditSessionsScreen},
  EditSessionsPicker: {screen: EditSessionsPickerScreen},
}, {
    initialRouteName: 'Home',
});
