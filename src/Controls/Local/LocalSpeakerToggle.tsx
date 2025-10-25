import React, {useContext} from 'react';
import PropsContext, {
  ToggleState,
  UidInterface,
} from '../../Contexts/PropsContext';
import RtcContext from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import {LocalContext} from '../../Contexts/LocalUserContext';
import {DispatchType} from '../../Contexts/RtcContext';
import {IRtcEngine, RtcTextureView} from 'react-native-agora';
interface LocalSpeakerToggleProps {
  btnText?: string;
  variant?: 'outlined' | 'text';
}

const LocalSpeakerToggle: React.FC<LocalSpeakerToggleProps> = (props) => {
  const {btnText = 'Speaker', variant = 'Outlined'} = props;
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles, remoteBtnStyles} = styleProps || {};
  const {muteLocalAudio} = localBtnStyles || {};
  const {muteRemoteAudio} = remoteBtnStyles || {};
  const {RtcEngine, dispatch} = useContext(RtcContext);
  const localUser = useContext(LocalContext);

  return (
    <BtnTemplate
      name={localUser.speaker === ToggleState.enabled ? 'speaker' : 'speakerOff'}
      btnText={btnText}
      style={{
        ...styles.localBtn,
        ...(variant === 'Outlined'
          ? (muteLocalAudio as object)
          : (muteRemoteAudio as object)),
      }}
      onPress={() => switchSpeaker(localUser, dispatch, RtcEngine)}
    />
  );
};

export const switchSpeaker = async (
  local: UidInterface,
  dispatch: DispatchType,
  RtcEngine: IRtcEngine,
) => {
  const localState = local.speaker;
  // Don't do anything if it is in a transitional state
  if (
    localState === ToggleState.enabled ||
    localState === ToggleState.disabled
  ) {
    // Disable UI
    dispatch({
      type: 'LocalSpeakerToggle',
      value: [
        localState === ToggleState.enabled
          ? ToggleState.disabling
          : ToggleState.enabling,
      ],
    });

    try {
      await RtcEngine.setEnableSpeakerphone(localState === ToggleState.disabled);
      // Enable UI
      dispatch({
        type: 'LocalSpeakerToggle',
        value: [
          localState === ToggleState.enabled
            ? ToggleState.disabled
            : ToggleState.enabled,
        ],
      });
    } catch (e) {
      console.error(e);
      dispatch({
        type: 'LocalSpeakerToggle',
        value: [localState],
      });
    }
  } else {
    // console.log('LocalSwitchSpeaker in transition', local, ToggleState);
  }
};

export default LocalSpeakerToggle;
