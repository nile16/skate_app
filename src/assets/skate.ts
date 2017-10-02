import { Injectable } from '@angular/core';

@Injectable()
export class Skate {

public version: string = "1.0";

  constructor() {
  }


toDecimal(number) {
    return number[0].num/number[0].den + (number[1].num/(60 * number[1].den)) + (number[2].num/(3600 * number[2].den));
  };

getTags(callback){
  var xhrTag =  new XMLHttpRequest();
  xhrTag.open('GET', 'http://nile16.nu:5984/misc/tags', true);
  xhrTag.onreadystatechange = function(response) {
    if (xhrTag.readyState == 4) {
      callback(JSON.parse(xhrTag.response).value);
     }
  }
  xhrTag.send();
}


  getExif(file,callback){
      var self=this;
      var fileReaderExif = new FileReader();
  		var lat  = false;
  		var lon  = false;
  		var takenTime = false;
  		fileReaderExif.onloadend = function() {
  			var meta = (new JpegMeta.JpegFile(this.result, file.name).metaGroups);
  			if (meta.gps){
          lat  = self.toDecimal(meta.gps.GPSLatitude.value).toFixed(5);
          lon  = self.toDecimal(meta.gps.GPSLongitude.value).toFixed(5);
        }
  			if (meta.exif&&meta.exif.DateTimeOriginal)
          takenTime = meta.exif.DateTimeOriginal.value;
        callback({takenTime:takenTime,lat:lat,lon:lon});
  		};
  		fileReaderExif.readAsBinaryString(file);
  	}

  upload(file,meta,callback) {
    var url = 'http://nile16.nu:5984/media/';
    var fileReader = new FileReader();
    var xhr1 =  new XMLHttpRequest();
    xhr1.open('POST', url, true);
    xhr1.setRequestHeader("Content-Type", "application/json");
    xhr1.onreadystatechange = function(response) {
      if (xhr1.readyState == 4) {
        var docId = JSON.parse(xhr1.response).id;
        var docRev = JSON.parse(xhr1.response).rev;
        var name = encodeURIComponent(file.name);
        var type = file.type;
        var xhr2 = new XMLHttpRequest();
        xhr2.open('PUT', url+docId+'/'+name+'?rev='+docRev, true);
        xhr2.setRequestHeader('Content-Type', type);
        xhr2.onreadystatechange = function(response) {
          if (xhr2.readyState == 4) {
            callback(xhr2.response);
          }
        }
        fileReader.onload = function (readerEvent) {
          xhr2.send(readerEvent.target.result);
        };
        fileReader.readAsArrayBuffer(file);
      }
    }
    //var uploadTime = Math.floor((new Date().getTime())/1000);
    meta.uploadTime = (new Date()).toString();
    xhr1.send(JSON.stringify(meta));
  }



}
