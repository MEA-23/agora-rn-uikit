/**
 * Minimal RTM Engine stub.
 *
 * This file intentionally avoids importing `agora-react-native-rtm`. It
 * provides a small singleton object with the same API surface used by the
 * rest of the codebase but with no-op implementations. This allows the UI
 * Kit to be consumed without the RTM SDK being installed.
 */
class RTMEngine {
  engine: any = null;
  private localUID = "";
  private channelId = "";

  private static _instance: RTMEngine | null = null;

  public static getInstance(_appId: string) {
    if (!RTMEngine._instance) {
      RTMEngine._instance = new RTMEngine();
    }
    return RTMEngine._instance;
  }

  private constructor() {}

  setLoginInfo(localUID: string, channelID: string) {
    this.localUID = localUID;
    this.channelId = channelID;
  }

  get localUid() {
    return this.localUID;
  }

  get channelUid() {
    return this.channelId;
  }

  // No-op destroy
  destroy() {
    RTMEngine._instance = null;
  }
}

export default RTMEngine;
