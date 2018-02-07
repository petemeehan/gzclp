import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  Button,
} from 'react-native';

import { gzclp } from 'gzclp/js/gzclp';
import { styles, colours } from 'gzclp/js/styles';

import MenuItem from 'gzclp/js/Components/Common/MenuItem';


export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Settings',
    headerTintColor: '#fff',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
  });

  // Remove stored data and reset program state to initial values
  async handleResetButtonPress() {
    const { refreshHomeScreen } = this.props.navigation.state.params;

    try {
      await gzclp.deleteSavedProgramState();
      gzclp.resetProgramState();
    } catch (error) {
      console.log("Error removing data");
    }

    refreshHomeScreen();
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View>
        <MenuItem
          menuItemText='Edit Sessions'
          onPress={() => navigate('EditSessions')}
          hasNavArrow={true}
        />
        <MenuItem
          menuItemText='Increments'
          onPress={() => navigate('Increments')}
          hasNavArrow={true}
        />

        <View style={{marginTop: 22}}>
          <MenuItem
            menuItemText='Reset Everything'
            onPress={() => this.handleResetButtonPress()}
            hasNavArrow={false}
          />
        </View>
      </View>
    )
  }
}
