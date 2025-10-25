import React, { PropsWithChildren, useState } from "react";
import {
  RtmProvider,
  popUpStateEnum,
  rtmStatusEnum,
} from "./Contexts/RtmContext";

/**
 * Lightweight no-op RTM configure component.
 *
 * Since the project may be used without the `agora-react-native-rtm` SDK,
 * this component provides a minimal provider that supplies stubbed RTM
 * functions and state so the rest of the UI can operate without RTM.
 */
const RtmConfigure: React.FC<PropsWithChildren> = (props) => {
  const [popUpState, setPopUpState] = useState<popUpStateEnum>(
    popUpStateEnum.closed
  );

  const stubValue = {
    rtmStatus: rtmStatusEnum.offline,
    sendChannelMessage: (_: any) => {},
    sendPeerMessage: (_: any, __: any) => {},
    rtmClient: null,
    userDataMap: {},
    uidMap: {},
    sendMuteRequest: (_: any, __: any, ___: any) => {},
    usernames: {},
    popUpState,
    setPopUpState,
  } as any;

  return <RtmProvider value={stubValue}>{props.children}</RtmProvider>;
};

export default RtmConfigure;
