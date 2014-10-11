//
function uploadVideo(videoBLOB) {
  /*var request = gapi.client.youtube.videos.insert({
    part: 'snippet',
    snippet: {
      title: 'Test1',
      description: 'This is a test upload.',
      categoryId: 22
    }
  }, videoBLOB);
  request.execute(function(response) {
    console.log('I did it.')
  });*/
  var accessToken = gapi.auth.getToken().access_token;
  var VIDEOS_UPLOAD_SERVICE_URL = 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet';


  var metadata = {
        snippet: {
          title: 'Test 1',
          description: 'Test Video Upload.',
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

function uploadVideoHelper(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:8000/video.webm', true);
  xhr.responseType = 'blob';
  xhr.onload = function(e) {
    if (this.status == 200) {
      var myBlob = new Blob([this.response], {type: 'video/webm'});
      console.log('UpIrgendwas');
      uploadVideo(myBlob);
    }
  };
  xhr.send();

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

      $('#post-upload-status').append('<li>Processing status: ' + processingStatus + ', upload status: ' + uploadStatus + '</li>');

      if (processingStatus == 'processing') {
        setTimeout(function() {
          checkVideoStatus(videoId, waitForNextPoll * 2);
        }, waitForNextPoll);
      } else {
        if (uploadStatus == 'processed') {
          $('#player').append(response.items[0].player.embedHtml);
        }

        $('#post-upload-status').append('<li>Final status.</li>');
      }
    });
}
