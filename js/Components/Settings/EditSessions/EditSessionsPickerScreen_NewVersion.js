import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  Button
} from 'react-native';

import { gzclp } from 'gzclp/js/gzclp';
import { styles, colours } from 'gzclp/js/styles';

import MenuItem from 'gzclp/js/Components/Common/MenuItem';



export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Session ' + gzclp.getSessionName(navigation.state.params.sessionID),
    headerRight: <Button
      title='Add Lift'
      color='white'
      onPress={() => null}
    />
  });

  render() {
    const { sessionID } = this.props.navigation.state.params;

    const liftIDs = gzclp.getSessionLifts(sessionID);

    const menuItems = [];
    for (let i = 0; i < liftIDs.length; i++) {
      menuItems.push(
        <MenuItem
          menuItemText={gzclp.getLiftTier( liftIDs[i] ) + ' ' + gzclp.getLiftName( liftIDs[i] )}
          onPress={() => {
            // Remove lift from session
            liftIDs.splice( liftIDs.indexOf(liftIDs[i]), 1 );
            gzclp.refreshComponent(this);

            // Store current state of the app
            try {
              gzclp.saveProgramState();
            } catch (error) {
              console.log("Error saving data")
            }
          }}
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
