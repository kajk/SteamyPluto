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
        method: 'POST',
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
