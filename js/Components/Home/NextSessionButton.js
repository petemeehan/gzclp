import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import { styles, colours } from 'gzclp/js/styles';
import { gzclp } from 'gzclp/js/gzclp';


// TODO: dont use inline styles
export default props => {

  function handlePress() {
    const { navigate, refreshHomeScreen } = props;

    // Navigate to Session screen, which will display according to provided parameters
    navigate('Session', {
      sessionID: gzclp.getCurrentSessionID(),
      refreshHomeScreen: refreshHomeScreen
    });
  }

  // lifts is an array where each element is a lift's ID
  const sessionLifts = gzclp.getSessionLifts( gzclp.getCurrentSessionID() );
  // Populate arrays of data to display in the Next Session component
  var tiers = [];
  var names = [];
  var weights = [];
  var repSchemes = [];

  sessionLifts.forEach( (liftID, i) => {
    let tier = gzclp.getLiftTier(liftID);
    let name = gzclp.getLiftName(liftID);

    // TODO This is all WAY more cumbersome than it needs to be,
    // see CompletedSessionResult.js
    tiers.push(
      <Text key={i}>
        {tier}
      </Text>
    );
    names.push(
      <Text key={i}>
        {gzclp.getLiftName(liftID)}
      </Text>
    );
    weights.push(
      <Text key={i}>
        {gzclp.getNextAttemptWeight(liftID)} kg
      </Text>
    );
    repSchemes.push(
      <Text key={i}>
        {gzclp.getNumberOfSets( tier, gzclp.getNextAttemptRepSchemeIndex(liftID) )}
        ×
        {gzclp.getDisplayedRepsPerSet( tier, gzclp.getNextAttemptRepSchemeIndex(liftID) )}
      </Text>
    );
  });

  return (
    <TouchableOpacity
      style={styles.genericContainer}
      activeOpacity={0.8}
      // Navigate to session screen and pass as two parameters the required session
      // and the callback function that will refresh the home screen when session is finished
      onPress={() => handlePress()}
    >
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
          <Text style={styles.nextSessionTitle}>
            {'Next Session: ' + gzclp.getSessionName( gzclp.getCurrentSessionID() )}
          </Text>

          <View style={{flexDirection: 'row'}}>
            <View style={{width: 25}}>{tiers}</View>
            <View style={{width: 120}}>{names}</View>
            <View style={{width: 50}}>{repSchemes}</View>
            <View style={{width: 50, alignItems: 'flex-end'}}>{weights}</View>
          </View>
        </View>

        <View style={{justifyContent: 'center'}}>
          <Text style={styles.navArrow}>></Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
