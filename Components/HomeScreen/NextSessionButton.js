import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import { styles, colours } from '../../js/styles';
import { gzclp } from '../../js/gzclp';


// TODO: dont use inline styles
export default props => {
  function handlePress() {
    const { navigate, onGoBack } = props;

    // Navigate to Session screen, which will display according to provided parameters
    navigate('Session', {
      sessionID: gzclp.getCurrentSessionID(),
      onGoBack: () => onGoBack()
    });
  }

  // lifts is an array where each element is a lift's ID
  const sessionLifts = gzclp.getSessionLifts( gzclp.getCurrentSessionID() );
  // Populate arrays of data to display in the Next Session component
  var tiers = [];
  var labels = [];
  var weights = [];
  var repSchemes = [];

  sessionLifts.forEach( (liftID, i) => {
    let tier = gzclp.getLiftTier(liftID);
    let name = gzclp.getLiftName(liftID);

    tiers.push(
      <Text key={i}>
        {tier}
      </Text>
    );
    labels.push(
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
      style={styles.sessionContainer}
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
            <View style={{width: 120}}>{labels}</View>
            <View style={{width: 50}}>{repSchemes}</View>
            <View style={{width: 50, alignItems: 'flex-end'}}>{weights}</View>
          </View>
        </View>

        <View style={{justifyContent: 'center'}}>
          <Text style={{fontSize: 20, color: colours.primaryColour}}>＞</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
