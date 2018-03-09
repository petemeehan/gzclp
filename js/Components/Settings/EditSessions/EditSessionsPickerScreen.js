import React from 'react';
import {
  View,
  ScrollView,
  Text,
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
    title: gzclp.getSessionName(navigation.state.params.sessionID),
  });

  render() {
    const { sessionID, refreshParentScreen } = this.props.navigation.state.params;

    const sessionLifts = gzclp.getSessionLifts(sessionID);

    // TODO DUPLICATION!!...

    const liftIDsT1 = gzclp.getAllLiftIDsInTier('T1');
    const liftIDsT2 = gzclp.getAllLiftIDsInTier('T2');
    const liftIDsT3 = gzclp.getAllLiftIDsInTier('T3');

    const menuItemsT1 = [];
    const menuItemsT2 = [];
    const menuItemsT3 = [];

    for (let i = 0; i < liftIDsT1.length; i++) {
      menuItemsT1.push(
        <MenuItem
          key={i}
          title={gzclp.getLiftName( liftIDsT1[i] )}
          hasSwitch={true}
          switchEnabled={sessionLifts.includes(liftIDsT1[i])}
          switchOnValueChange={() => {
            // If the lift is already in the session, remove it. If not, add it
            sessionLifts.includes(liftIDsT1[i]) ?
              sessionLifts.splice( sessionLifts.indexOf(liftIDsT1[i]), 1 ) :
              sessionLifts.push(liftIDsT1[i]);
            gzclp.refreshComponent(this);

            // Refresh previous menu screen (to update menu info)
            refreshParentScreen();

            // Store current state of the app
            try {
              gzclp.saveProgramState();
            } catch (error) {
              console.log("Error saving data")
            }
          }}
        />
      )
    };
    for (let i = 0; i < liftIDsT2.length; i++) {
      menuItemsT2.push(
        <MenuItem
          key={i}
          title={gzclp.getLiftName( liftIDsT2[i] )}
          hasSwitch={true}
          switchEnabled={sessionLifts.includes(liftIDsT2[i])}
          switchOnValueChange={() => {
            // If the lift is already in the session, remove it. If not, add it
            sessionLifts.includes(liftIDsT2[i]) ?
              sessionLifts.splice( sessionLifts.indexOf(liftIDsT2[i]), 1 ) :
              sessionLifts.push(liftIDsT2[i]);
            gzclp.refreshComponent(this);

            // Refresh previous menu screen (to update menu info)
            refreshParentScreen();

            // Store current state of the app
            try {
              gzclp.saveProgramState();
            } catch (error) {
              console.log("Error saving data")
            }
          }}
        />
      )
    };
    for (let i = 0; i < liftIDsT3.length; i++) {
      menuItemsT3.push(
        <MenuItem
          key={i}
          title={gzclp.getLiftName( liftIDsT3[i] )}
          hasSwitch={true}
          switchEnabled={sessionLifts.includes(liftIDsT3[i])}
          switchOnValueChange={() => {
            // If the lift is already in the session, remove it. If not, add it
            sessionLifts.includes(liftIDsT3[i]) ?
              sessionLifts.splice( sessionLifts.indexOf(liftIDsT3[i]), 1 ) :
              sessionLifts.push(liftIDsT3[i]);
            gzclp.refreshComponent(this);

            // Refresh previous menu screen (to update menu info)
            refreshParentScreen();

            // Store current state of the app
            try {
              gzclp.saveProgramState();
            } catch (error) {
              console.log("Error saving data")
            }
          }}
        />
      )
    };

    return (
      <ScrollView>
        <Text style={styles.menuHeading}>T1 LIFTS</Text>
        <View style={{marginBottom: 10}}>{menuItemsT1}</View>

        <Text style={styles.menuHeading}>T2 LIFTS</Text>
        <View style={{marginBottom: 10}}>{menuItemsT2}</View>

        <Text style={styles.menuHeading}>T3 LIFTS</Text>
        <View style={{marginBottom: 10}}>{menuItemsT3}</View>

      </ScrollView>
    )
  }
}
