window.Recorder = (function() {
  var mediaRecorder = null;

  navigator.getMedia = ( navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia);

  startRecording = function(videoElement){
    navigator.getMedia(
      { audio:true, video:true },
      function(stream) { onMediaSuccess(videoElement, stream); },
      onMediaError);
  }

  stopRecording = function() {
    if (!!mediaRecorder) {
      mediaRecorder.stop();
    }
  }

  function onMediaSuccess(videoElement, stream) {
    videoElement.src = URL.createObjectURL(stream);

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.mimeType = 'video/webm';
    mediaRecorder.ondataavailable = function(e) {
      console.log("data available");
      b = new Blob([e.data], { type: e.data.type });
      uploadVideo(b);
      stream.stop();
    }

    mediaRecorder.start();
    videoElement.play();
  }

  function onMediaError(error) {
    console.error("media error", error)
  }

  return { startRecording: startRecording, stopRecording: stopRecording };
})();
