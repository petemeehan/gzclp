import React from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  Switch,
  TextInput
} from 'react-native';

import { styles, colours } from 'gzclp/js/styles';
import { navArrow, menuTick } from 'gzclp/js/Components/Common/Icons';


// TODO Use inline styles - since only used here and easier to keep track
// TODO Hacked to to use for starting weight form - consider making new component

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
      hasTextInput,
      textInputDefaultValue,
      textInputOnChangeText,
      textInputPlaceholder,
      style,
      textColour,
    } = props;

    return (
      <TouchableHighlight
        underlayColor={colours.underlayColor}
        onPress={hasSwitch ? null : onPress}
        style={style ? style : {
          backgroundColor: '#fff',
          marginBottom: 1,
        }}
      >
        <View style={styles.menuItemContainer}>
          <View style={styles.menuItemTitleContainer}>
            <Text style={!hasSwitch || switchEnabled ? styles.menuItemTitle : styles.menuItemTitleGreyedOut}><Text style={textColour ? {color: textColour} : null}>{title}</Text></Text>
            {subtitle ? <Text style={styles.menuItemSubtitle}><Text>{subtitle}</Text></Text> : null}
          </View>

          {hasTextInput ? <TextInput
            style={[styles.menuItemTextInput, textColour ? {color: textColour} : null]}
            keyboardType='numeric'
            placeholder={textInputPlaceholder}
            defaultValue={textInputDefaultValue}
            onChangeText={textInputOnChangeText}
            returnKeyType='done'
          /> : null}

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
