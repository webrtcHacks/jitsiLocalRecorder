const status = document.getElementById('status');

let recorder;
let recordingData = [];
let recorderStream;

/**
 * Mixes multiple audio tracks and the first video track it finds
 * */
function mixer(stream1, stream2) {
    const ctx = new AudioContext();
    const dest = ctx.createMediaStreamDestination();

    if(stream1.getAudioTracks().length > 0)
        ctx.createMediaStreamSource(stream1).connect(dest);

    if(stream2.getAudioTracks().length > 0)
        ctx.createMediaStreamSource(stream2).connect(dest);

    let tracks = dest.stream.getTracks();
    tracks = tracks.concat(stream1.getVideoTracks()).concat(stream2.getVideoTracks());

    return new MediaStream(tracks)

}

/**
 * Returns a filename based ono the Jitsi room name in the URL and timestamp
 * */
function getFilename(){
    const now = new Date();
    const timestamp = now.toISOString();
    const room = new RegExp(/(^.+)\s\|/).exec(document.title);
    if(room && room[1]!=="")
        return `${room[1]}_${timestamp}`;
    else
        return `recording_${timestamp}`;
}

/**
 * Start a new recording
 * */
const start = document.getElementById('recordStart');
start.addEventListener('click', async ()=> {
    let gumStream, gdmStream;
    recordingData = [];

    try {
        gumStream = await navigator.mediaDevices.getUserMedia({video: false, audio: true});
        gdmStream = await navigator.mediaDevices.getDisplayMedia({video: {displaySurface: "browser"}, audio: true});

    } catch (e) {
        console.error("capture failure", e);
        return
    }

    recorderStream = gumStream ? mixer(gumStream, gdmStream) : gdmStream;
    recorder = new MediaRecorder(recorderStream, {mimeType: 'video/webm'});

    recorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
            recordingData.push(e.data);
        }
    };

    recorder.onStop = () => {
        recorderStream.getTracks().forEach(track => track.stop());
        gumStream.getTracks().forEach(track => track.stop());
        gdmStream.getTracks().forEach(track => track.stop());

    };

    recorderStream.addEventListener('inactive', () => {
        console.log('Capture stream inactive');
        stopCapture();
    });

    recorder.start();
    console.log("started recording");
    start.innerText = "Recording";

    start.disabled = true;
    pause.disabled = false;
    stop.disabled = false;
    play.disabled = true;
    save.disabled = true;
});


/**
 * Stop recording
 * */
const stop = document.getElementById('recordStop');
function stopCapture(){
    console.log("Stopping recording");
    recorder.stop();

    start.disabled = false;
    pause.disabled = true;
    stop.disabled = true;
    play.disabled = false;
    save.disabled = false;

    start.innerText = "Record";
    pause.innerText = "Pause";

}
stop.addEventListener('click', stopCapture);

/**
 * Pause recording
 * */
const pause = document.getElementById('recordPause');
pause.addEventListener('click', ()=>{
    if(recorder.state ==='paused'){
        recorder.resume();
        pause.innerText = "Pause"
    }
    else if (recorder.state === 'recording'){
        recorder.pause();
        pause.innerText = "Resume"

    }
    else
        console.error(`recorder in unhandled state: ${recorder.state}`);

    console.log(`recorder ${recorder.state === 'paused' ? "paused" : "recording"}`);

});

/**
 * Play the recording in a popup window
 * */
let isPlaying = false;
const play = document.getElementById('recordPlay');
play.addEventListener('click', ()=>{
    playback.hidden = !playback.hidden;
    if (!isPlaying && !playback.hidden){
        playback.src = window.URL.createObjectURL(new Blob(recordingData, {type: 'video/webm'}));
        playback.play();
        play.innerText = "Hide";
    }
    else
        play.innerText = "Play";

});

const playback = document.getElementById('recordPlayback');
// Media playback handlers

playback.addEventListener('play', ()=>{isPlaying = true});
playback.addEventListener('pause', ()=>{isPlaying = false});
playback.addEventListener('playing', ()=>{isPlaying = true});
playback.addEventListener('ended', ()=>{isPlaying = false});

/**
 * Save the recording
 * */
const save = document.getElementById('recordSave');
save.addEventListener('click', () => {
    const blob = new Blob(recordingData, {type: 'video/webm'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${getFilename()}.webm`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        console.log(`${a.download} save option shown`);
    }, 100);
});
