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
    title: gzclp.getSessionName(navigation.state.params.sessionID),
  });

  render() {
    const { sessionID } = this.props.navigation.state.params;

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
          menuItemText={gzclp.getLiftName( liftIDsT1[i] )}
          onPress={() => {
            // If the lift is already in the session, remove it. If not, add it
            sessionLifts.includes(liftIDsT1[i]) ?
              sessionLifts.splice( sessionLifts.indexOf(liftIDsT1[i]), 1 ) :
              sessionLifts.push(liftIDsT1[i]);
            gzclp.refreshComponent(this);

            // Store current state of the app
            try {
              gzclp.saveProgramState();
            } catch (error) {
              console.log("Error saving data")
            }
          }}
          hasTick={sessionLifts.includes(liftIDsT1[i])}
          key={i}
        />
      )
    };
    for (let i = 0; i < liftIDsT2.length; i++) {
      menuItemsT2.push(
        <MenuItem
          menuItemText={gzclp.getLiftName( liftIDsT2[i] )}
          onPress={() => {
            // If the lift is already in the session, remove it. If not, add it
            sessionLifts.includes(liftIDsT2[i]) ?
              sessionLifts.splice( sessionLifts.indexOf(liftIDsT2[i]), 1 ) :
              sessionLifts.push(liftIDsT2[i]);
            gzclp.refreshComponent(this);

            // Store current state of the app
            try {
              gzclp.saveProgramState();
            } catch (error) {
              console.log("Error saving data")
            }
          }}
          isTickMenu={true}
          hasTick={sessionLifts.includes(liftIDsT2[i])}
          key={i}
        />
      )
    };
    for (let i = 0; i < liftIDsT3.length; i++) {
      menuItemsT3.push(
        <MenuItem
          menuItemText={gzclp.getLiftName( liftIDsT3[i] )}
          onPress={() => {
            // If the lift is already in the session, remove it. If not, add it
            sessionLifts.includes(liftIDsT3[i]) ?
              sessionLifts.splice( sessionLifts.indexOf(liftIDsT3[i]), 1 ) :
              sessionLifts.push(liftIDsT3[i]);
            gzclp.refreshComponent(this);

            // Store current state of the app
            try {
              gzclp.saveProgramState();
            } catch (error) {
              console.log("Error saving data")
            }
          }}
          isTickMenu={true}
          hasTick={sessionLifts.includes(liftIDsT3[i])}
          key={i}
        />
      )
    };

    return (
      <ScrollView>
        <Text style={styles.menuHeading}>T1 Lifts</Text>
        {menuItemsT1}

        <Text style={styles.menuHeading}>T2 Lifts</Text>
        {menuItemsT2}

        <Text style={styles.menuHeading}>T3 Lifts</Text>
        {menuItemsT3}

      </ScrollView>
    )
  }
}
