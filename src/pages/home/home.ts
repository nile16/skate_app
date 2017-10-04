import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import {Platform, ionicBootstrap} from 'ionic-angular';
import { SkateProvider } from '../../providers/skate/skate';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tags: any = {};
  file: any;
  nick:string = "";
  description:string = "";

  constructor(public navCtrl: NavController, public skate:SkateProvider) {
    this.skate.getTags((tags) => console.log("provider:",tags));
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

  // Create listener that display the selected picture when a picture is selected.
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

  var meta = {
    tags:[],
    nick:"",
    description:""
  };

  // Check which tags are selected and add those to meta in the form of an array
  //meta.tags = [];
  for (var i=0;i<this.tags.length;i++){
    if (document.getElementById("tag"+i).checked) meta.tags.push(this.tags[i]);
  }

  //meta.nick = nick.value.trim();
  meta.nick = this.nick.trim();

  //meta.description = description.value.trim();
  meta.description = this.description.trim();

  this.skate.getExif(this.file,(exif) => {

    Object.assign(meta,exif);
    console.log(meta);
    this.skate.upload(this.file,meta,function(x){
      console.log(x);
      alert("Uppladdning klar!")
    });

  });
}


}
