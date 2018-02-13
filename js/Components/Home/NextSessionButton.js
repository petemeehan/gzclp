import React from 'react';
import {
  Text,
  View,
  TouchableHighlight,
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

  const liftIDs = gzclp.getSessionLifts( gzclp.getCurrentSessionID() );
  const sortedLiftIDs = gzclp.sortLiftIDsByTier(liftIDs);

  var lifts = [];
  for (var i = 0; i < sortedLiftIDs.length; i++) {
    const liftID = sortedLiftIDs[i];

    const tier = gzclp.getLiftTier( liftID );
    const name = gzclp.getLiftName( liftID );
    const weight = gzclp.getNextAttemptWeight( liftID )
    const numberOfSets = gzclp.getNumberOfSets( tier, gzclp.getNextAttemptRepSchemeIndex(liftID) );
    const numberOfReps = gzclp.getDisplayedRepsPerSet( tier, gzclp.getNextAttemptRepSchemeIndex(liftID) );

    lifts.push(
      <View key={i} style={{flexDirection: 'row'}}>
        <Text style={{width: 25}}>{tier}</Text>
        <Text style={{width: 120}}>{name}</Text>
        <Text style={{width: 50}}>{numberOfSets}×{numberOfReps}</Text>

        <View style={{width: 50, alignItems: 'flex-end'}}>
          <Text>{weight} kg</Text>
        </View>
      </View>
    )
  }

  return (
    <TouchableHighlight
      style={styles.genericContainer}
      underlayColor={colours.underlayColor}
      // Navigate to session screen and pass as two parameters the required session
      // and the callback function that will refresh the home screen when session is finished
      onPress={() => handlePress()}
    >
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View>
          <Text style={styles.nextSessionTitle}>
            {'Next Session: ' + gzclp.getSessionName( gzclp.getCurrentSessionID() )}
          </Text>

          {lifts}
        </View>

        <Text style={styles.navArrow}>></Text>
      </View>
    </TouchableHighlight>
  )
}
