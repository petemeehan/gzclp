import React from 'react';
import {
  View,
  ScrollView,
  Button,
} from 'react-native';

import { styles, colours } from 'gzclp/js/styles';
import { gzclp } from 'gzclp/js/gzclp';

import Lift from './Lift';



export default class extends React.Component {
  constructor(props) {
    super(props);
    // Session state used to keep track of which liftIDs are complete
    // eg., if liftIDs with IDs 2 and 5 had been completed, lift-2 successfully
    // and lift-5 not, and lift-7 was left uncompleted,
    // state object would look as follows:
    // {2: 1, 5: 2, 7: 0}
    this.state = {};
  }

  static navigationOptions = ({ navigation }) => {
    const sessionID = navigation.state.params.sessionID;
    return {
      title: 'Session ' + (sessionID + 1) + ': ' + gzclp.getSessionName(sessionID)
    }
  }

  componentWillMount() {
    // Initialise state
    const { params } = this.props.navigation.state;
    const liftIDs = gzclp.getSessionLifts(params.sessionID);
    for (var i = 0; i < liftIDs.length; i++) {
      this.setState( { [liftIDs[i]]: 0 } )
    }
  }

  componentDidUpdate() {
    //console.log(this.state);
  }

  handleLiftResult( liftID, liftResult ) {
    if (liftResult == 1) {      // TODO generalise
      gzclp.handleSuccessfulLift(liftID);
    }
    if (liftResult == 2) {
      gzclp.handleFailedLift(liftID);
    }
  }

  async handleDoneButtonPress(liftIDs) {
    const { navigation } = this.props;

    // Keep a record of this session
    gzclp.addCompletedSession(this.state);   // TODO use setter method

    // Clicking "Done" button calls the "success" or "failure" function for each lift,
    // depending on whether all sets were successful/failed, or do nothing if incomplete
    liftIDs.forEach(liftID => {
      let liftResult = this.state[liftID];
      this.handleLiftResult( liftID, liftResult );
    });

    // Increment the session counter so sessions are cycled from A1 to B2
    // and back to A1 and so on
    gzclp.incrementSessionCounter();

    // Store current state of the app
    try {
      gzclp.saveProgramState();
    } catch (error) {
      console.log("Error saving data")
    }

    // Call refreshHomeScreen function to force rerender of home screen when it's navigated back to
    navigation.state.params.refreshHomeScreen();
    navigation.goBack();
  }

  render() {
    const { params } = this.props.navigation.state;

    const liftIDs = gzclp.getSessionLifts(params.sessionID);
    gzclp.sortLiftIDsByTier(liftIDs);

    // Populate an array of Lift components to display in this Session Screen component
    var lifts = [];
    for (var i = 0; i < liftIDs.length; i++) {
      const liftID = liftIDs[i];

      const tier = gzclp.getLiftTier(liftID);
      const name = gzclp.getLiftName(liftID);
      const repSchemeIndex = gzclp.getNextAttemptRepSchemeIndex(liftID);
      const weight = gzclp.getNextAttemptWeight(liftID);

      lifts.push(
        <Lift key={i} tier={tier} name={name}
          repSchemeIndex={repSchemeIndex} weight={weight}
          // Test for whether lift is
          // 1. Successful (all sets successful),
          // 2. Failed (all sets attempted but not all successful)
          // 3. Incomplete (not all sets attempted)
          setLiftResult={(liftResult) => {this.setState( { [liftID]: liftResult } )}}
        />
      )
    };

    return (
      <View style={{flex: 1}}>
        <ScrollView>
          {lifts}
        </ScrollView>

        <Button
          title='Done'
          color={colours.primaryColour}
          onPress={() => this.handleDoneButtonPress(liftIDs)}
        />
      </View>
    );
  }
}
