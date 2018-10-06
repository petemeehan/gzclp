import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
} from 'react-native';

import { gzclp } from 'gzclp/js/gzclp';
import { styles, colours } from 'gzclp/js/styles';

import MenuItem from 'gzclp/js/Components/Common/MenuItem';



export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => ({
    title: gzclp.getLiftTier(navigation.state.params.liftID)
     + ' ' + gzclp.getLiftName(navigation.state.params.liftID),
  });

  render() {
    const { liftID, refreshPreviousScreen } = this.props.navigation.state.params;

    const increments = gzclp.getIncrements();
    const menuItems = []

    for (let i = 0; i < increments.length; i++) {
      menuItems.push(
        <MenuItem
          title={increments[i]}
          onPress={() => {
            gzclp.setLiftIncrement(liftID, increments[i]);
            gzclp.refreshComponent(this);

            // Refresh previous menu screen (to update menu info)
            refreshPreviousScreen();

            // Store current state of the app
            try {
              gzclp.saveProgramState();
            } catch (error) {
              console.log("Error saving data")
            }
          }}
          hasTick={gzclp.getLiftIncrement(liftID) == increments[i]}
          key={i}
        />
      )
    };

    return (
      <ScrollView>
        {menuItems}
      </ScrollView>
    )
  }
}
