# Local Jitsi Recording and getDisplayMedia experiments

See the webrtcHacks [post](https://webrtchacks.com/jitsi-recording-getdisplaymedia-audio) for full details. 

## Local Jitsi Meet Recording

Quick hack to record your self hosted [Jitsi Meet](https://github.com/jitsi/jitsi-meet) session locally, just using your browser. Uses `getDisplayMedia` to capture user selected screen and `getUserMedia` for local audio. 
Makes sure to  click "Capture Audio" if you are using Chrome to capture the remote participant 
sound via the system audio.

## Installation

```
git clone https://github.com/webrtchacks/jitsiLocalRecorder.git
cd jitsiLocalRecorder
./install.sh
```

Installation assumes Jitsi Meet's web files are located in `/usr/share/jitsi-meet/index.html`. 
If your files are located somewhere else, then run `./install.sh {{meet_web_dir}}` with the 
correct directory.

## getDisplayMedia testing

Load `getDisplayMedia.html` to:
 1. Check if your browser supports `getDisplayMedia` (it should)
 1. Demonstrate how getDisplayMedia ignores user constraints 
 1. Check if you can capture audio (currently only Chrome for some user selections)
 
 
 
