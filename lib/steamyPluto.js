(function(){
  $('div[data-steamy-pluto]').append('<div id="login-container" class="pre-auth"></div>' +
  '<div id="upload-container" class="row">' +
    '<video id="replayVideo"></video>' +
    '<a id="startbutton" onclick="return recordButtonClicked()">' +
    '  <img src="img/cameraPlaceholder.png"/>' +
    '</a></div><div class="row">' +
    '<button id="stopbutton" class="hide" onclick="return doneRecordingButtonClicked();">Stop Recording</button>' +
  '</div>' +
  '<div id="post-upload" class="hide">' +
       '<p><img src="img/loading.gif" style="display: inline; height:5em"/>Uploading video. Please wait...</p>' +
  '</div>');
})();

var shouldStartRecording = false;

function recordButtonClicked() {
  shouldStartRecording = true;
  if (!!$('.pre-auth.hide')) {
   googleApiAuthorize();
  }
  handleAPILoaded();
  return false;
}

function doneRecordingButtonClicked() {
  $("#stopbutton").addClass("hide");
  $('#replayVideo').addClass("hide");
  $('#post-upload').removeClass("hide");
  Recorder.stopRecording();
  return false;
}

function handleAPILoaded() {
  if (shouldStartRecording) {
    console.log("API loaded called");
    $("#startbutton").addClass("hide");
    $("#stopbutton").removeClass("hide");
    $("#replayVideo").removeClass("hide");
    Recorder.startRecording(document.querySelector('#replayVideo'));
  }
}

