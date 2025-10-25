import React, { createContext } from "react";

/**
 * Callbacks to pass to RTM events (lightweight placeholder)
 * We intentionally avoid depending on agora-react-native-rtm here so the
 * UI Kit can be used without the RTM SDK. Consumers that still use RTM may
 * provide an object of event handlers keyed by event name.
 */
export type rtmCallbacks = Record<string, any>;

export enum rtmStatusEnum {
  // Initialisation failed
  initFailed,
  // Login has not been attempted
  offline,
  // RTM is initialising, process is not yet complete
  initialising,
  // Currently attempting to log in
  loggingIn,
  // RTM has logged in
  loggedIn,
  // RTM is logged in, and connected to the current channel
  connected,
  // RTM Login Failed
  loginFailed,
}

export type messageType = "UserData" | "MuteRequest";

export type messageObjectType = userDataType | muteRequest | genericAction;

export enum clientRoleRaw {
  broadcaster,
  audience,
}

export enum mutingDevice {
  camera,
  microphone,
}

export type genericAction = {
  messageType: "RtmDataRequest";
  type: "ping" | "pong" | "userData";
};

export type muteRequest = {
  messageType: "MuteRequest";
  rtcId: number;
  mute: boolean;
  device: mutingDevice;
  isForceful: boolean;
};

export type userDataType = {
  messageType: "UserData";
  rtmId: string;
  rtcId: number;
  username?: string;
  role: clientRoleRaw;
  uikit: {
    platform: string;
    framework: string;
    version: string;
  };
  agora: {
    rtm: string;
    rtc: string;
  };
};

export enum popUpStateEnum {
  closed,
  muteMic,
  muteCamera,
  unmuteMic,
  unmuteCamera,
}

type NewType = React.Dispatch<React.SetStateAction<popUpStateEnum>>;

/**
 * Interface for RTM Context
 */
interface rtmContext {
  /**
   * rtm connection status
   */
  rtmStatus: rtmStatusEnum;
  /**
   * send message to everyone in the channel
   */
  sendChannelMessage: (msg: messageObjectType) => void;
  /**
   * send message to a specific user
   */
  sendPeerMessage: (msg: messageObjectType, uid: string) => void;
  /**
   * RTM Client instance (opaque, kept as any to avoid hard dependency)
   */
  rtmClient: any;
  /**
   * map with userdata for each rtc uid in the channel
   */
  userDataMap: Object;
  /**
   * map with rtm uid for each rtc uid in the channel
   */
  uidMap: Record<number, string>;
  /**
   * Send a mute request
   */
  sendMuteRequest: (device: mutingDevice, rtcId: number, mute: boolean) => void;
  /**
   * RTM usernames
   */
  usernames: Record<string, string>;
  /**
   * state to display pop up on remote mute request
   */
  popUpState: popUpStateEnum;
  /**
   * set state to hide pop up
   */
  setPopUpState: NewType;
}
/**
 * Context to access RTM data. It's setup by {@link RtmConfigure}.
 */
const RtmContext = createContext(null as unknown as rtmContext);

export const RtmProvider = RtmContext.Provider;
export const RtmConsumer = RtmContext.Consumer;
export default RtmContext;
