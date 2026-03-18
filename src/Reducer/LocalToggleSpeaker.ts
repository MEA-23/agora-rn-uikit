import {UidInterface} from '../Contexts/PropsContext';
import {ActionType, UidStateInterface} from '../Contexts/RtcContext';

export default function LocalToggleSpeaker(
  state: UidStateInterface,
  action: ActionType<'LocalSpeakerToggle'>,
) {
  let stateUpdate = {};
  const LocalSpeakerToggle = (user: UidInterface) => {
    if (user.uid === 'local') {
      user.speaker = action.value[0];
    }
    return user;
  };
  stateUpdate = {
    min: state.min.map(LocalSpeakerToggle),
    max: state.max.map(LocalSpeakerToggle),
  };
  return stateUpdate;
}
