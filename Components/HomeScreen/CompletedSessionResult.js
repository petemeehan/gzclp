import React from 'react';
import {
  Text,
  View,
} from 'react-native';

import { styles, colours } from '../../js/styles';
import { gzclp } from '../../js/gzclp';



export default props => {
  const sessionID = props.sessionID;

  const session = gzclp.getCompletedSession(sessionID);
  const liftIDs = Object.keys(session);
  const liftResults = Object.values(session);

  const resultStrings = ['Not Completed', '✓', '✕'];  // TODO Define as global and use everywhere

  // Populate an array to display each lift result in the session
  var lifts = [];
  for (var i = 0; i < liftIDs.length; i++) {
    let tier = gzclp.getLiftTier(liftIDs[i]);
    let name = gzclp.getLiftName(liftIDs[i]);
    let resultString = resultStrings[ liftResults[i] ];

    lifts.push(
      <View key={i} style={{flexDirection: 'row'}}>
        <Text style={{width: 25}}>{tier}</Text>
        <Text style={{width: 120}}>{name}</Text>
        <Text>{resultString}</Text>
      </View>
    )
  }

  return (
    <View style={styles.sessionContainer}>
      <Text style={styles.completedSessionTitle}>
        Session {sessionID + 1}: {gzclp.getSessionName(sessionID % gzclp.getNumberOfSessions())}
      </Text>

      {lifts}
    </View>
  )
}
