# Sound Assets

This directory contains sound assets for the STOMP application.

## Metronome Sound

The `metronome.mp3` file is a placeholder for a metronome sound that would be used in the CPR guide component. In a real implementation, you would need to replace this with an actual metronome sound file.

You can find free metronome sounds at:
- [Freesound.org](https://freesound.org/search/?q=metronome)
- [Mixkit](https://mixkit.co/free-sound-effects/metronome/)

Or create your own using audio editing software.

## Usage

The sound is loaded in the CPRGuide component using Expo's Audio API:

```javascript
const { sound } = await Audio.Sound.createAsync(
  require('../assets/sounds/metronome.mp3'),
  { isLooping: true }
);
```