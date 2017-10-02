import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import {Platform, ionicBootstrap} from 'ionic-angular';
import {Skate} from '../../assets/skate';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

tags: any = {};
file: any;

  constructor(public navCtrl: NavController,private skate: Skate) {

    //this.tags = {};

  }


  ionViewDidLoad(){
    // Get tags from skate database and create a checkbox tag list
    this.skate.getTags((tags)=>{
         this.tags=tags;
  	     var html = "";
         for (var i=0;i<tags.length;i++)
  		     html += "<input type='checkbox' id='tag"+i+"'> "+tags[i]+"<br>";
         formDiv.innerHTML=html;
  	   });

  // Create listener that show the selected picture
  fileInput.addEventListener("change",(e) => {
    var fileReaderImg = new FileReader();
  	this.file = e.target.files[0];
  	fileReaderImg.onload = function (readerEvent) {
  		picture.src = readerEvent.target.result;
  	}
  	fileReaderImg.readAsDataURL(fileInput.files[0]);
  });


}

// This function is executed when the upload button is pressed
uploadFile(){

  var meta = {};

  // Check which tags are selected and add those to meta in the form of an array
  meta.tags = [];
  for (var i=0;i<this.tags.length;i++){
    if (document.getElementById("tag"+i).checked) meta.tags.push(this.tags[i]);
  }

  meta.nick = nick.value.trim();

  meta.description = description.value.trim();

  this.skate.getExif(this.file,(exif) => {

    Object.assign(meta,exif);
    //console.log(meta);
    this.skate.upload(this.file,meta,function(x){
      console.log(x);
    });

  });
}

//uploadFile() {
//  var url = 'http://nile16.nu:5984/media/';
//  var fileReader = new FileReader();
//  var file = fileInput.files[0];
//  var xhr1 =  new XMLHttpRequest();
//  xhr1.open('POST', url, true);
//  xhr1.setRequestHeader("Content-Type", "application/json");
//  xhr1.onreadystatechange = function(response) {
//    if (xhr1.readyState == 4) {
//      var docId = JSON.parse(xhr1.response).id;
//      var docRev = JSON.parse(xhr1.response).rev;
//      var name = encodeURIComponent(file.name);
//      var type = file.type;
//      var xhr2 = new XMLHttpRequest();
//      xhr2.open('PUT', url+docId+'/'+name+'?rev='+docRev, true);
//      xhr2.setRequestHeader('Content-Type', type);
//      xhr2.onreadystatechange = function(response) {
//        if (xhr2.readyState == 4) {
//          console.log(xhr2.response);
//          alert("Uploaded!");
//        }
//      }
//      fileReader.onload = function (readerEvent) {
//        xhr2.send(readerEvent.target.result);
//      };
//      fileReader.readAsArrayBuffer(file);
//    }
//  }
//  var selectedTags = [];
//  for (var i=0;i<self.tags.length;i++){
//    if (document.getElementById("tag"+i).checked) selectedTags.push(self.tags[i]);
//  }
  //var uploadTime = Math.floor((new Date().getTime())/1000);
//  var uploadTime = (new Date()).toString();
//  xhr1.send(JSON.stringify({description:description.value.trim(),nick:nick.value.trim(),tags:selectedTags,uploadTime:uploadTime,takenTime:takenTime,lat:lat,lon:lon}));
//}


}
