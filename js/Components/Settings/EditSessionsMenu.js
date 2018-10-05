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



export default props => {
  const { navigate, refreshParentScreen } = props;

  const menuItems = []
  for (let i = 0; i < gzclp.getNumberOfSessions(); i++) {
    const liftIDs = gzclp.sortLiftIDsByTier( gzclp.getSessionLifts(i) );
    const lifts = liftIDs.map(id => gzclp.getLiftTier(id) + ' ' + gzclp.getLiftName(id));
    const liftsString = lifts.join('\n');

    menuItems.push(
      <MenuItem
        title={gzclp.getSessionName(i)}
        subtitle={liftsString}
        onPress={() => navigate('EditSessionsPicker', {
          sessionID: i,
          refreshParentScreen: refreshParentScreen
        })}
        hasNavArrow={true}
        key={i}
        hasTopBorder={i == 0}
      />
    )
  };

  return <View>{menuItems}</View>
}
