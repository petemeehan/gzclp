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
    // Session state used to keep track of which lifts are complete
    // eg., if lifts with IDs 2 and 5 had been completed, lift-2 successfully
    // and lift-5 not, and lift-7 was left uncompleted,
    // state object would look as follows:
    // {2: 1, 5: 2, 7: 0}
    this.state = {};
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Session ' + gzclp.getSessionName(navigation.state.params.sessionID)
  })

  componentDidMount() {
    // Initialise state
    const { params } = this.props.navigation.state;
    const lifts = gzclp.getSessionLifts(params.sessionID);
    for (var i = 0; i < lifts.length; i++) {
      this.setState( { [lifts[i]]: 0 } )
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

  async handleDoneButtonPress(lifts) {
    const { goBack } = this.props.navigation;
    const { refreshHomeScreen } = this.props.navigation.state.params;

    // Keep a record of this session
    gzclp.addCompletedSession(this.state);   // TODO use setter method

    // Clicking "Done" button calls the "success" or "failure" function for each lift,
    // depending on whether all sets were successful/failed, or do nothing if incomplete
    lifts.forEach(liftID => {
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
    refreshHomeScreen();
    goBack();
  }

  render() {
    const { params } = this.props.navigation.state;

    // lifts parameter is an array where each element is a lift's ID
    const lifts = gzclp.getSessionLifts(params.sessionID);

    // Populate an array of Lift components to display in this Session Screen component
    var liftComponents = [];
    lifts.forEach( (liftID, index) => {   // TODO No need for forEach, just use For Loop
      let tier = gzclp.getLiftTier(liftID);
      let name = gzclp.getLiftName(liftID);
      let repSchemeIndex = gzclp.getNextAttemptRepSchemeIndex(liftID);
      let weight = gzclp.getNextAttemptWeight(liftID);

      liftComponents.push(
        <Lift key={index} tier={tier} name={name}
          repSchemeIndex={repSchemeIndex} weight={weight}
          // Test for whether lift is
          // 1. Successful (all sets successful),
          // 2. Failed (all sets attempted but not all successful)
          // 3. Incomplete (not all sets attempted)
          setLiftResult={(liftResult) => {this.setState( { [liftID]: liftResult } )}}
        />
      )
    });

    return (
      <View style={{flex: 1}}>
        <ScrollView>
          {liftComponents}
        </ScrollView>

        <Button
          title='Done'
          color={colours.primaryColour}
          onPress={() => this.handleDoneButtonPress(lifts)}
        />
      </View>
    );
  }
}
