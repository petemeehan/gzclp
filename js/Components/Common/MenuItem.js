import React from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  Switch,
} from 'react-native';

import { styles, colours } from 'gzclp/js/styles';
import { navArrow, menuTick } from 'gzclp/js/Components/Common/Icons';


// TODO Use inline styles - since only used here and easier to keep track

export default (props) => {
    var {
      onPress,
      title,
      subtitle,
      info,
      hasTick,
      hasNavArrow,
      hasSwitch,
      switchEnabled,
      switchOnValueChange,
    } = props;

    return (
      <TouchableHighlight
        underlayColor={colours.underlayColor}
        onPress={hasSwitch ? null : onPress}
        style={{
          backgroundColor: '#fff',
          marginBottom: 1,
        }}
      >
        <View style={styles.menuItemContainer}>
          <View style={styles.menuItemTitleContainer}>
            <Text style={!hasSwitch || switchEnabled ? styles.menuItemTitle : styles.menuItemTitleGreyedOut}>{title}</Text>
            {subtitle ? <Text style={styles.menuItemSubtitle}>{subtitle}</Text> : null}
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {info ? <Text style={styles.menuItemInfo}>{info}</Text> : null}
            {hasTick ? <View style={styles.menuTick}>{menuTick}</View> : null}
            {hasNavArrow ? <View style={styles.navArrow}>{navArrow}</View> : null}

            {hasSwitch ? <Switch
              value={switchEnabled}
              onValueChange={switchOnValueChange}
              onTintColor={colours.primaryColour}
            /> : null}
          </View>
        </View>
      </TouchableHighlight>
    )
}
