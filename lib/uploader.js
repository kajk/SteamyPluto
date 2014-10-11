//
function uploadVideo(videoBLOB) {
 var accessToken = gapi.auth.getToken().access_token;
 var VIDEOS_UPLOAD_SERVICE_URL = 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet';

 var metadata = {
  snippet: {
    title: 'Test 2',
    description: 'Test Video Upload Duplicate?',
    categoryId: 22
  }
 };

 $.ajax({
  url: VIDEOS_UPLOAD_SERVICE_URL,
  type: 'POST',
  contentType: 'application/json',
  headers: {
    Authorization: 'Bearer ' + accessToken,
    'x-upload-content-length': videoBLOB.size,
    'x-upload-content-type': videoBLOB.type
  },
  data: JSON.stringify(metadata)
 }).done(function(data, textStatus, jqXHR) {
  resumableUpload({
    url: jqXHR.getResponseHeader('Location'),
    file: videoBLOB,
    start: 0
  });
 });

}

function resumableUpload(options){
  var ajax = $.ajax({
    url: options.url,
    type: 'PUT',
    contentType: options.file.type,
    headers: {
      'Content-Range': 'bytes ' + options.start + '-' + (options.file.size - 1) + '/' + options.file.size
    },
    xhr: function() {
      // Thanks to http://stackoverflow.com/a/8758614/385997
      var xhr = $.ajaxSettings.xhr();

      return xhr;
    },
    processData: false,
    data: options.file
  });

  ajax.done(function(response) {
    console.log('Done.');
    var videoId = response.id;
    checkVideoStatus(videoId, 15 * 1000);
  });

  ajax.fail(function() {
    console.log('Not work.');
  });
}

function checkVideoStatus(videoId, waitForNextPoll) {
  var VIDEOS_SERVICE_URL = 'https://www.googleapis.com/youtube/v3/videos';

  var accessToken = gapi.auth.getToken().access_token;

  $.ajax({
    url: VIDEOS_SERVICE_URL,
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    data: {
      part: 'status,processingDetails,player',
      id: videoId
    }
  }).done(function(response) {
    var processingStatus = response.items[0].processingDetails.processingStatus;
    var uploadStatus = response.items[0].status.uploadStatus;

    //$('#post-upload-status').append('<li>Processing status: ' + processingStatus + ', upload status: ' + uploadStatus + '</li>');

    if (processingStatus == 'processing') {
      setTimeout(function() {
        checkVideoStatus(videoId, waitForNextPoll * 2);
      }, waitForNextPoll);
    } else {
      if (uploadStatus == 'processed') {
        // $('#player').append(response.items[0].player.embedHtml);
        $('#post-upload').addClass("hide");
        $("#startbutton").removeClass("hide");
        window.onSteamyPlutoUploaded(response.items[0].player.embedHtml);
      }

      $('#post-upload-status').append('<li>Final status.</li>');
    }
  });
}
