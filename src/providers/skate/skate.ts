import { Injectable } from '@angular/core';
//import * as exif from '../../assets/jpegmeta.js';
//import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';

/*
  Generated class for the SkateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var JpegMeta;

@Injectable()
export class SkateProvider {

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

  getMedia(callback){
    var xhrTag =  new XMLHttpRequest();
    xhrTag.open('GET', 'http://nile16.nu:5984/media/_all_docs?include_docs=true', true);
    xhrTag.onreadystatechange = function(response) {
      if (xhrTag.readyState == 4) {
        var rows = JSON.parse(xhrTag.response).rows;
        var result = [];
        for (var i=0;i<rows.length;i++){
          var temp = {
          description:null,
          nick:null,
          tags:null,
          takenTime:null,
          uploadTime:null,
          lat:null,
          lon:null,
          //mediaType:false,
          url:null
          }
          if (rows[i].doc.description) temp.description = rows[i].doc.description;
          if (rows[i].doc.nick) temp.nick = rows[i].doc.nick;
          if (rows[i].doc.tags) temp.tags = rows[i].doc.tags;
          if (rows[i].doc.takenTime) temp.takenTime = rows[i].doc.takenTime;
          if (rows[i].doc.uploadTime) temp.uploadTime = rows[i].doc.uploadTime;
          if (rows[i].doc.lat) temp.lat = rows[i].doc.lat;
          if (rows[i].doc.lon) temp.lon = rows[i].doc.lon;
          if (rows[i].doc._attachments) temp.url = "http://nile16.nu:5984/media/"+rows[i].doc._id+"/"+Object.keys(rows[i].doc._attachments)[0];
          result.push(temp);
        }
        callback(result);
       }
    }
    xhrTag.send();
  }

    getExif(file,callback){
        var self=this;
        var fileReaderExif = new FileReader();
    		var lat  = null;
    		var lon  = null;
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
            xhr2.send(this.result);
          };
          fileReader.readAsArrayBuffer(file);
        }
      }
      //var uploadTime = Math.floor((new Date().getTime())/1000);
      meta.uploadTime = (new Date()).toString();
      xhr1.send(JSON.stringify(meta));
    }


}
