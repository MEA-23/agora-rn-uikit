import {PermissionsAndroid, Permission} from 'react-native';
/**
 * @name requestCameraAndAudioPermission
 * @description Requests the Android runtime permissions the call actually needs.
 * Audio-only calls never prompt for the camera.
 * @param needsCamera Whether the call renders video. Defaults to true.
 */
export default async function requestCameraAndAudioPermission(
  needsCamera: boolean = true,
) {
  try {
    const required: Permission[] = needsCamera
      ? [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]
      : [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];

    const granted = await PermissionsAndroid.requestMultiple(required);

    const allGranted = required.every(
      permission => granted[permission] === PermissionsAndroid.RESULTS.GRANTED,
    );

    if (!allGranted) {
      console.warn(
        `Permission denied: ${required
          .filter(p => granted[p] !== PermissionsAndroid.RESULTS.GRANTED)
          .join(', ')}`,
      );
    }
    return allGranted;
  } catch (err) {
    console.warn(err);
    return false;
  }
}
