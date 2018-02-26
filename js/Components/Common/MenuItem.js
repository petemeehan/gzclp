import React from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  Switch,
} from 'react-native';

import { styles, colours } from 'gzclp/js/styles';

import Icon from 'react-native-vector-icons/Ionicons';
const navArrow = <Icon name="ios-arrow-forward" size={22} color={colours.mediumGrey} />;
const menuTick = <Icon name="md-checkmark-circle" size={26} color={colours.primaryColour} />;

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
            {hasTick ? <Text style={styles.menuTick}>{menuTick}</Text> : null}
            {hasNavArrow ? navArrow : null}

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
