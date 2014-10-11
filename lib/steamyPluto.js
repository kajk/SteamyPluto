function(){
  $('#spUploader').append('<div id="login-container" class="pre-auth">
    This application requires access to your YouTube account.
    Please <a href="#" id="login-link">authorize</a> to continue.
  </div>
  <div id="upload-container">
    <video id="replayVideo" width="320" height="240"></video>
    <button id="upload-button" onclick="Recorder.startRecording(document.querySelector(''#replayVideo'')); return false;">Start Recording</button>
    <button id="upload-button" onclick="Recorder.stopRecording(); return false;">Stop Recording</button>
  </div>

  <div class="post-upload">
      <p>Uploaded video with id <span id="video-id"></span>. Polling for status...</p>
      <ul id="post-upload-status"></ul>
      <div id="player"></div>
  </div>

  <script type="text/javascript" src="auth.js"></script>
  <script type="text/javascript" src="uploader.js"></script>
  <script type="text/javascript" src="recorder.js"></script>
  <script src="https://apis.google.com/js/client.js?onload=googleApiClientReady"></script>
');
}
