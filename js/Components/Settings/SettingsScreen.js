import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';

import { gzclp } from 'gzclp/js/gzclp';
import { styles, colours } from 'gzclp/js/styles';

import MenuItem from 'gzclp/js/Components/Common/MenuItem';
import EditSessionsMenu from './EditSessionsMenu';


export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Settings',
    headerLeft: <Button
      // CHANGE BUTTON COLOUR FOR ANDROID VS IOS:
      // iOS
      //color='#fff'
      // android
      color={colours.primaryColour}

      title='Done'
      onPress={() => {
        navigation.state.params.refreshHomeScreen();
        navigation.goBack(null);
      }}
    />
  });

  // Remove stored data and reset program state to initial values
  async handleResetButton() {
    try {
      await gzclp.deleteSavedProgramState();
      gzclp.resetProgramState();
      this.props.navigation.navigate('Welcome');
    } catch (error) {
      console.log("Error removing data");
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <ScrollView>
        <Text style={styles.menuHeading}>EDIT SESSIONS</Text>
        <EditSessionsMenu
          navigate={navigate}
          refreshParentScreen={() => gzclp.refreshComponent(this)}
        />

        <Text style={styles.menuHeading}>EDIT LIFTS</Text>
        <MenuItem
          title='Increments'
          onPress={() => navigate('Increments')}
          hasNavArrow={true}
        />
        <MenuItem
          title='Weights'
          onPress={() => navigate('Weights')}
          hasNavArrow={true}
        />

        <View style={{marginTop: 40}}>
          <MenuItem
            title='Privacy Policy'
            onPress={() => navigate('Privacy')}
            hasNavArrow={true}
          />
        </View>

        <View style={{marginTop: 40}}>
          <MenuItem
            title='Reset Everything'
            onPress={() => this.handleResetButton()}
            hasNavArrow={false}
          />
        </View>
      </ScrollView>
    )
  }
}
