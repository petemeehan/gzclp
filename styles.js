import {
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

const primaryColour = '#fa375a';

const DEVICE_W = Dimensions.get('window').width;
const DEVICE_H = Dimensions.get('window').height;

StatusBar.setBarStyle('light-content');

export default StyleSheet.create({
  nextSessionContainer: {
    backgroundColor: '#fff',
    paddingLeft: (0.03125+0.015625) * DEVICE_W,
    paddingRight: (0.03125+0.015625) * DEVICE_W / 2,
    paddingVertical: 10,
  },
  nextSessionTitle: {
    //color: primaryColour,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressDataContainer: {
    ///backgroundColor: '#fff',
    paddingHorizontal: (0.03125+0.015625) * DEVICE_W,
    marginVertical: 20,
  },
  progressDataTitle: {
    marginVertical: 10
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
  setButtonContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    marginHorizontal: 0.03125 * DEVICE_W,
    flexWrap: 'wrap',
    //borderWidth: 1
  },
  setButtonActive: {
    borderColor: primaryColour,
    borderWidth: 1.5,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButtonInactive: {
    backgroundColor: '#eee',
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButtonClicked: {
    backgroundColor: primaryColour,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButtonTextActive: {
    color: primaryColour,
  },
  setButtonTextInactive: {
    color: '#777'
  },
  setButtonTextClicked: {
    color: '#fff',
  },
  timerContainer: {
    backgroundColor: '#777',
  },
  timerText: {
    marginHorizontal: (0.03125+0.015625) * DEVICE_W,
    marginVertical: 2,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Courier',
  }
});
