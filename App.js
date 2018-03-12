import React from 'react';
import { StackNavigator } from 'react-navigation';

import { gzclp } from 'gzclp/js/gzclp';
import { styles } from 'gzclp/js/styles';


/*-------------------- APP COMPONENTS --------------------*/

import HomeScreen from './js/Components/Home/HomeScreen';
import SessionScreen from './js/Components/Session/SessionScreen';
import SettingsScreen from './js/Components/Settings/SettingsScreen';

import EditSessionsPickerScreen from './js/Components/Settings/EditSessionsPicker/EditSessionsPickerScreen';
import IncrementsScreen from './js/Components/Settings/Increments/IncrementsScreen';
import IncrementsPickerScreen from './js/Components/Settings/Increments/IncrementsPickerScreen';
import WeightsScreen from './js/Components/Settings/Weights/WeightsScreen';

import WelcomeScreen from './js/Components/Welcome/WelcomeScreen';



export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dataFinishedFetching: false};
  }

  // Overwrite initial default program state values with stored ones, if they exist
  async fetchSavedData() {
    var storedProgramState;

    try {
      storedProgramState = await gzclp.fetchProgramState();
      if (storedProgramState !== null) {
        gzclp.setProgramState(storedProgramState);
      } else {
        console.log("No sessions completed yet");
      }
    } catch (error) {
      console.log("Error setting fetched data");
    }

    this.setState({dataFinishedFetching: true});
  }

  componentWillMount() {
    // Initialise program state with default values
    gzclp.resetProgramState();

    // Overwrite with saved values if applicable
    this.fetchSavedData();
  }

  render() {
    return this.state.dataFinishedFetching ? <RootStack /> : null;
  }
}


/*-------------------- REACT NAVIGATION NAVIGATORS --------------------*/

const MainStack = StackNavigator({
  Home: {screen: HomeScreen},
  Session: {screen: SessionScreen},
}, {
  navigationOptions: {
    headerTintColor: '#fff',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
  }
})

const SettingsStack = StackNavigator({
  Settings: {screen: SettingsScreen},
  EditSessionsPicker: {screen: EditSessionsPickerScreen},
  Increments: {screen: IncrementsScreen},
  IncrementsPicker: {screen: IncrementsPickerScreen},
  Weights: {screen: WeightsScreen},
}, {
  navigationOptions: {
    headerTintColor: '#fff',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
  }
})

const RootStack = StackNavigator({
  MainStack: {screen: MainStack},
  SettingsStack: {screen: SettingsStack},
  Welcome: {screen: WelcomeScreen},
}, {
  initialRouteName: 'Welcome',
  mode: 'modal',
  headerMode: 'none',
});
