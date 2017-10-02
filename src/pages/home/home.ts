import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  constructor(public navCtrl: NavController) {

    var self = this;
    this.tags = {};
    this.lat  = false;
    this.lon  = false;
    this.takenTime = false;

  }


  ionViewDidLoad(){

    // Get tags from database and make a checkbox list
    var xhrTag =  new XMLHttpRequest();
    xhrTag.open('GET', 'http://nile16.nu:5984/misc/tags', true);
    xhrTag.onreadystatechange = function(response) {
      if (xhrTag.readyState == 4) {
        self.tags = JSON.parse(xhrTag.response).value;
  	     var html = "";
         for (var i=0;i<self.tags.length;i++)
  		     html += "<input type='checkbox' id='tag"+i+"'> "+self.tags[i]+"<br>"
         formDiv.innerHTML=html;
  	   }
    }
    xhrTag.send();

  function toDecimal(number) {
    return number[0].num/number[0].den + (number[1].num/(60 * number[1].den)) + (number[2].num/(3600 * number[2].den));
  };

  fileInput.addEventListener("change",function(e) {
    var fileReaderImg = new FileReader();
  	var file = e.target.files[0];
  	fileReaderImg.onload = function (readerEvent) {
      var fileReaderExif = new FileReader();
  		picture.src = readerEvent.target.result;
  		self.lat  = false;
  		self.lon  = false;
  		self.takenTime = false;
  		fileReaderExif.onloadend = function() {
  			var meta = (new JpegMeta.JpegFile(this.result, file.name).metaGroups);
  			if (meta.gps){
          self.lat  = toDecimal(meta.gps.GPSLatitude.value).toFixed(5);
          self.lon  = toDecimal(meta.gps.GPSLongitude.value).toFixed(5);
        }
  			if (meta.exif&&meta.exif.DateTimeOriginal)
          self.takenTime = meta.exif.DateTimeOriginal.value;
  		};
  		fileReaderExif.readAsBinaryString(file);
  	}
  	fileReaderImg.readAsDataURL(fileInput.files[0]);
  });


}

uploadFile() {
  var url = 'http://nile16.nu:5984/media/';
  var fileReader = new FileReader();
  var file = fileInput.files[0];
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
          console.log(xhr2.response);
          alert("Uploaded!");
        }
      }
      fileReader.onload = function (readerEvent) {
        xhr2.send(readerEvent.target.result);
      };
      fileReader.readAsArrayBuffer(file);
    }
  }
  var selectedTags = [];
  for (var i=0;i<self.tags.length;i++){
    if (document.getElementById("tag"+i).checked) selectedTags.push(self.tags[i]);
  }
  //var uploadTime = Math.floor((new Date().getTime())/1000);
  var uploadTime = (new Date()).toString();
  xhr1.send(JSON.stringify({description:description.value.trim(),nick:nick.value.trim(),tags:selectedTags,uploadTime:uploadTime,takenTime:takenTime,lat:lat,lon:lon}));
}


}
