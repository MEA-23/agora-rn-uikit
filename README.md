# react-native-agora-uikit

A fork of [`agora-rn-uikit`](https://www.npmjs.com/package/agora-rn-uikit) (last release **5.0.2, 2023-12-04**), updated to work with current `react-native-agora`.

Drop-in video *and* audio calling for React Native, with built-in UI. Adds audio-only call mode, speaker/earpiece routing, scoped Android runtime permissions, and support for modern `react-native-agora` (including Android 16 KB page-size aligned native libraries).

> **Not affiliated with Agora.** This is an independent community fork, not published or endorsed by Agora Lab, Inc. It wraps the official [`react-native-agora`](https://www.npmjs.com/package/react-native-agora) SDK, which you install separately. For official support, see [Agora's documentation](https://docs.agora.io/).

## Why this fork

| | `agora-rn-uikit@5.0.2` | `react-native-agora-uikit` |
|---|---|---|
| Last release | 5.0.2, Dec 2023 | 6.0.0, 2026 |
| `react-native-agora` peer | `^4.1.0` | `>=4.5.2` |
| Android 16 KB page size | ✗ (pre-4.5.2 native libs) | ✓ via `react-native-agora >= 4.5.2` |
| Audio-only call mode | ✗ | ✓ `enableVideoOnHost: false` |
| Speaker / earpiece toggle | ✗ | ✓ `<LocalSpeakerToggle />` |
| Android permissions | camera + mic, always | only what the call mode needs |
| RTM / signalling | ✓ | ✗ **removed — see below** |

## ⚠️ Read this before migrating from `agora-rn-uikit`

**The RTM (signalling) layer is not implemented in this fork.** `RtmConfigure` and `RTMEngine` are no-op stubs so the package can be installed without `agora-react-native-rtm`. Concretely, the following **silently do nothing**:

- remote usernames (`<Username />` renders nothing meaningful)
- the remote mute *request* flow and its confirmation pop-up
- `sendChannelMessage`, `sendPeerMessage`, `sendMuteRequest`
- every `rtmCallbacks` handler — they are never invoked

`rtmProps` and `rtmCallbacks` are still accepted so v5 call sites keep compiling, but they are marked `@deprecated` and have no effect. **If your app depends on RTM, stay on `agora-rn-uikit@5.0.2`.** Direct RTC-level mute/video controls are unaffected and work normally.

## About the Android 16 KB claim

This package contains no native code. 16 KB page-size alignment comes entirely from `react-native-agora`'s native `.so` files — this fork's contribution is requiring a peer version that ships them (`>=4.5.2`) instead of the stale `^4.1.0`, which resolves to unaligned binaries and fails Google Play's 16 KB requirement. Verified in production on React Native 0.79.2 with `react-native-agora@4.5.2`.

## Install

```sh
npm i react-native-agora react-native-agora-uikit
# or
yarn add react-native-agora react-native-agora-uikit
```

Requires an [Agora developer account](https://www.agora.io/en/) (free), a physical Android or iOS device, and `react-native-agora >= 4.5.2`.

## Usage

### Video call

```jsx
import React, {useState} from 'react';
import {Text} from 'react-native';
import AgoraUIKit from 'react-native-agora-uikit';

const App = () => {
  const [videoCall, setVideoCall] = useState(true);
  const connectionData = {appId: '<Agora App ID>', channel: 'test'};
  const rtcCallbacks = {EndCall: () => setVideoCall(false)};

  return videoCall ? (
    <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
  ) : (
    <Text onPress={() => setVideoCall(true)}>Start Call</Text>
  );
};

export default App;
```

### Audio-only call

Set `enableVideoOnHost: false`. The video surface is skipped entirely, and the control bar swaps the camera buttons for a speaker toggle. Only `RECORD_AUDIO` is requested on Android — the camera permission is never asked for.

```jsx
<AgoraUIKit
  connectionData={{appId: '<Agora App ID>', channel: 'test'}}
  settings={{enableVideoOnHost: false}}
  rtcCallbacks={{EndCall: () => setCall(false)}}
/>
```

Audio calls start on the **earpiece**; video calls start on the **speaker**.

A standalone audio control bar is also exported if you're composing your own screen:

```jsx
import {LocalControlsAudio} from 'react-native-agora-uikit/Components';
```

### Speaker toggle in a custom layout

```jsx
import {LocalSpeakerToggle, LocalAudioMute, Endcall} from 'react-native-agora-uikit/Components';

<View style={{flexDirection: 'row'}}>
  <LocalAudioMute />
  <LocalSpeakerToggle btnText="Speaker" />
  <Endcall />
</View>
```

Speaker state lives on the local user, so you can read it anywhere:

```jsx
import {useContext} from 'react';
import {ToggleState} from 'react-native-agora-uikit';
import {LocalContext} from 'react-native-agora-uikit/Contexts';

const {speaker} = useContext(LocalContext);
const onSpeaker = speaker === ToggleState.enabled;
```

## Tokens

For an App ID in secured mode, pass `rtcToken` in `connectionData`, or deploy the [token server](https://github.com/AgoraIO-Community/agora-token-service) and pass `tokenUrl` — tokens are then fetched and renewed automatically.

## Platform setup

**Android** — run on a physical device; emulators generally can't reach the camera or mic. Permissions are requested at runtime by the UIKit based on call mode.

**iOS** — run `npx pod-install`, then add **Privacy - Camera Usage Description** (video calls only) and **Privacy - Microphone Usage Description** to `Info.plist`. The simulator has no camera, so use a real device.

## Credits & license

MIT. Originally built by [AgoraIO-Community](https://github.com/AgoraIO-Community/VideoUIKit-ReactNative) (Ekaansh Arora, Vineeth S); Agora's copyright is retained in [LICENSE](LICENSE). This is an independent community fork and is **not** an official Agora product.
