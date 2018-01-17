import {
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

StatusBar.setBarStyle('light-content');

const DEVICE_W = Dimensions.get('window').width;
const DEVICE_H = Dimensions.get('window').height;

export const colours = {
  primaryColour: '#fa375a',
  lightGrey: '#eee',
  mediumGrey: '#999',
  darkGrey: '#666',
  successful: '#4cd964',
  //successful: '#fa375a',
  failed: '#999',
};

export const styles = StyleSheet.create({
  header: {
    backgroundColor: colours.primaryColour
  },
  settingsIcon: {
    marginLeft: (0.03125+0.015625) * DEVICE_W,
    height: 24,
    width: 24
  },
  sessionContainer: {
    //borderWidth: 1,
    backgroundColor: '#fff',
    paddingLeft: (0.03125+0.015625) * DEVICE_W,
    paddingRight: (0.03125+0.015625) * DEVICE_W / 2,
    paddingVertical: 10,
    marginBottom: 2,
  },
  nextSessionTitle: {
    color: colours.primaryColour,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedSessionTitle: {
    marginBottom: 5,
    fontSize: 14.5,
    fontWeight: 'bold',
  },
  progressDataContainer: {
    paddingHorizontal: (0.03125+0.015625) * DEVICE_W,
  },
  progressDataTitle: {
    marginVertical: 10,
  },
  progressDataContent: {
    fontFamily: 'Courier New',
  },
  liftContainer: {
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  liftInfoContainer: {
    marginHorizontal: (0.03125+0.015625) * DEVICE_W,
    marginTop: 5 + 0.015625 * DEVICE_W,
    marginBottom: 5,
  },
  liftName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  liftDetails: {
    marginVertical: 5,
  },
  liftButtonsContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    marginHorizontal: 0.03125 * DEVICE_W,
    flexWrap: 'wrap',
    //borderWidth: 1
  },
  liftButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    //borderWidth: 1
  },

  liftButtonClickable: {
    borderColor: colours.primaryColour,
    borderWidth: 1.25,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonNotClickable: {
    backgroundColor: colours.lightGrey,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonSuccessful: {
    backgroundColor: colours.primaryColour,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonAllSuccessful: {
    backgroundColor: colours.successful,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonFailed: {
    backgroundColor: colours.failed,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /**
  liftButtonBorderSuccessful: {
    borderColor: colours.primaryColour,
    borderWidth: 1.5,
    width: 0.175 * DEVICE_W,
    height: 0.175 * DEVICE_W,
    borderRadius: 0.175 * DEVICE_W / 2,
    position: 'absolute',
  },
  liftButtonBorderFailed: {
    borderColor: colours.failed,
    borderWidth: 1.5,
    width: 0.175 * DEVICE_W,
    height: 0.175 * DEVICE_W,
    borderRadius: 0.175 * DEVICE_W / 2,
    position: 'absolute',
  },
  liftButtonBorderAllSuccessful: {
    borderColor: colours.successful,
    borderWidth: 1.5,
    width: 0.175 * DEVICE_W,
    height: 0.175 * DEVICE_W,
    borderRadius: 0.175 * DEVICE_W / 2,
    position: 'absolute',
  },
  **/
  liftButtonTextClickable: {
    color: colours.primaryColour,
  },
  liftButtonTextNotClickable: {
    color: colours.mediumGrey,
  },
  liftButtonTextSuccessful: {
    color: '#fff',
  },
  liftButtonTextFailed: {
    color: '#fff',
  },

  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.darkGrey,
    paddingHorizontal: (0.03125+0.015625) * DEVICE_W,
    paddingVertical: 2,
  },
  timerNumbers: {
    width: 50,
    color: 'white',
    fontSize: 18,
  },
  timerText: {
    color: 'white',
  }
});
