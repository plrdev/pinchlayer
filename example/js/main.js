var width = window.innerWidth;
var height = window.innerHeight;

initScreen = function() {
    stage = new Kinetic.Stage({
	container : 'container', 
	width : width, 
	height : height,
	});

   var image = new Kinetic.Image({
   	id: 'bg',
   	image : Kinetic.Global.Assets['bg'],
   });

	var layer = new Kinetic.Plugins.PinchLayer({
		container: stage,
		width: image.getWidth(),
		height: image.getHeight()
	});

   layer.add(image);

 uiLayer = new Kinetic.Layer({
 	id: 'uiLayer',
 });
 stage.add(uiLayer);

 var image2 = new Kinetic.Image({
	id: 'settings',
	image: Kinetic.Global.Assets['settings'],
	x: stage.getWidth() - 85,
	y: stage.getHeight() - 85
 });
 uiLayer.add(image2);
  
 var image3 = new Kinetic.Image({
	id: 'back',
	image: Kinetic.Global.Assets['back'],
	x: 10,
	y: stage.getHeight() - 85
 });
 uiLayer.add(image3);
   
 var text = new Kinetic.Text({
 	id: 'playerInfo',
 	text: 'Player 3',
 	x: 20,
 	y: 20,
 	width: 100,
 	height: 50,
	fontSize: 16,
	fontFamily: 'Times New Roman',
 	textFill: '#333333',
 	fill: 'white',
 	padding: 2,
 	shadow: {
 		color: 'black',
 		offset: [0 , 2],
 		blur: 0.1
 	} 	
  })
  uiLayer.add(text);
  stage.draw();
}

// loading images using Loader plugin
var images = [{  id: "bg", src: "img/test2.jpg" },
              { id: "settings", src: "img/UI_button_info.png" },
              { id: "back", src: "img/UI_button_exit.png"} ]

var loader = new Kinetic.Plugins.Loader(images);

//Function called after each loaded image
loader.onProgress(function(event) { 
	console.log('loaded: ' + event.name + ' - total: ' + event.percent);
});
//Function called after each error on loading
loader.onError(function(event){

});
//Function called after complete loading
loader.onComplete(function(event){
	console.log('complete!');
	initScreen();
});
//Start loading
loader.load();

