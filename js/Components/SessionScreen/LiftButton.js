import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { styles } from '../../styles';



// TODO control layout using flexbox (space-between), not by setting exact widths
export default props => {
  var {
    id,
    reps,
    isClickable,
    buttonState,
    handleButtonClick,
    areAllSetsSuccessful,
  } = props;

  var isClicked = buttonState != 0;
  var isSuccessful = buttonState == 1;

  // If button is clicked, display a tick either a tick or cross depending on
  // whether lift is successful or failed. Otherwise display number of reps
  var buttonText = isClicked ? (isSuccessful ? '✓' : '✕') : reps;   //TODO generalise

  // Apply style depending on whether button is inactive, active, or clicked
  // And, if clicked, successful or unsuccessful
  var currentStyle, currentTextStyle, currentBorderStyle;
  if (isClicked) {
    if (isSuccessful) {
      currentStyle = styles.liftButtonSuccessful;
      currentTextStyle = styles.liftButtonTextSuccessful;
      currentBorderStyle = styles.liftButtonBorderSuccessful;
    } else {
      currentStyle = styles.liftButtonFailed;
      currentTextStyle = styles.liftButtonTextFailed;
      currentBorderStyle = styles.liftButtonBorderFailed;
    }
  } else if (isClickable) {
    currentStyle = styles.liftButtonClickable;
    currentTextStyle = styles.liftButtonTextClickable;
    currentBorderStyle = styles.liftButtonBorderClickable;
  } else {
    currentStyle = styles.liftButtonNotClickable;
    currentTextStyle = styles.liftButtonTextNotClickable;
    currentBorderStyle = styles.liftButtonBorderNotClickable;
  }
  if (areAllSetsSuccessful) {
    currentStyle = styles.liftButtonAllSuccessful;
    currentBorderStyle = styles.liftButtonBorderAllSuccessful;
  }

  return (
    <View style={styles.individualLiftButtonContainer}>
      <View style={currentBorderStyle}></View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={currentStyle}
        onPress={() => {
          if (isClickable) {
            handleButtonClick(id);
          }
        }}
      >
        <Text style={currentTextStyle}>
          {buttonText}
        </Text>
      </TouchableOpacity>

      {//<View style={styles.liftButtonBorderAllSuccessful}></View>}
      }
    </View>
  )
}
