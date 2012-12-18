Kinetic.Plugins.PinchLayer = function(config) {
	self = this;
	Kinetic.Layer.call(self, config);
	config.container.add(self);
	self.setDragBoundFunc(self.checkBounds);
	// set minScale so that the layer will always cover the whole screen if possible
	if (self.getWidth() / self.getParent().getWidth() < self.getHeight() / self.getParent().getHeight()) {
   	 self.minScale = self.getParent().getWidth() / self.getWidth();
    } else {
   	 self.minScale = self.getParent().getHeight() / self.getHeight();
    }
    self.maxScale = config.maxScale || 3;
    self.maxSpeed = config.maxSpeed || 10;
    self.durationCoeff = config.durationCoeff || 0.05;
    
	self.on('dragstart', self.dragStarted);
	self.on('dragmove', self.dragMoved);
	self.on('dragend', self.dragEnded);
    self.dStage = self.getParent().getDOM();
	self.dStage.addEventListener("touchmove", self.layerTouchMove, true);
	self.dStage.addEventListener("touchend", self.layerTouchEnd, true);	
	document.addEventListener("mousewheel", self.mouseScroll, true);
	document.addEventListener("DOMMouseScroll", self.mouseScroll, true);
	self.setDraggable(true);
    
	self.startDistance = undefined;
	self.startScale = 1;
	self.lastPosition = { x: 0, y: 0 }
	self.touchPosition = { x: 0, y: 0 }
	self.layerPosition = { x: 0, y: 0 }
	self.panDelta = { x: 0, y: 0 }
}

Kinetic.Plugins.PinchLayer.prototype = new Kinetic.Layer();

Kinetic.Plugins.PinchLayer.prototype.checkBounds = function(pos) {
		var boundX, boundY, posX, posY;
		var picDimensionX = (-self.getWidth() * self.getScale().x) + self.getParent().getWidth();
		var picDimensionY = (-self.getHeight() * self.getScale().y) + self.getParent().getHeight();
		if (pos.x > 0) {
			boundX = 0;
		} else if (pos.x < picDimensionX) {
			boundX = picDimensionX;
		} else {
			boundX = pos.x;
		}
		if (pos.y > 0) {
			boundY = 0;
		} else if (pos.y < picDimensionY) {
			boundY = picDimensionY;
		} else {
			boundY = pos.y;
		}
		return { x: boundX, y: boundY }
}

Kinetic.Plugins.PinchLayer.prototype.mouseScroll = function(e) {
  	  var wheelData = e.detail ? e.detail * -1 : e.wheelDelta / 40;
	  var zoomAmount = wheelData * 0.04;
	  if (zoomAmount) {
		  var newScale = self.getScale().x + zoomAmount;
		  if (newScale < self.minScale) { newScale = self.minScale; }
		  if (newScale > self.maxScale) { newScale = self.maxScale; }
		  self.setScale(newScale);
		  var pos = self.checkBounds({ x: self.getX(), y: self.getY() });
		  self.setPosition(pos.x, pos.y);
		  self.draw();
	  }
	  // cancel scrollwheel
	  if(e.stopPropagation) {
   		 e.stopPropagation();
	  }
  	  if(e.preventDefault) {
    	e.preventDefault();
  	  }
  	  e.cancelBubble = true;
  	  e.cancel = true;
  	  e.returnValue = false;
  return false;}

Kinetic.Plugins.PinchLayer.prototype.dragStarted = function(event) {
 	if (!event.touches || event.touches.length <= 1) {
	 	self.lastPosition.x = (event.clientX || self.getParent().getTouchPosition().x);
	 	self.lastPosition.y = (event.clientY || self.getParent().getTouchPosition().y);
	}
}

Kinetic.Plugins.PinchLayer.prototype.dragMoved = function(event) {
 	if (!event.touches || event.touches.length <= 1) {
	 	var calcDeltaX = (event.clientX || self.getParent().getTouchPosition().x) - self.lastPosition.x;
	 	var calcDeltaY = (event.clientY || self.getParent().getTouchPosition().y) - self.lastPosition.y;
	 	self.lastPosition.x = (event.clientX || self.getParent().getTouchPosition().x);
	 	self.lastPosition.y = (event.clientY || self.getParent().getTouchPosition().y);
	 	self.panDelta.x = event.webkitMovementX || calcDeltaX;
	 	self.panDelta.y = event.webkitMovementY || calcDeltaY;
 	}
 }

Kinetic.Plugins.PinchLayer.prototype.dragEnded = function(event) {
 	if (!event.touches || event.touches.length <= 1) {
 		var speed = (Math.abs(self.panDelta.x) + Math.abs(self.panDelta.y)) / 2;
 		if (speed > self.maxSpeed) { speed = self.maxSpeed; }
 		if (speed < -self.maxSpeed) { speed = -self.maxSpeed; } 	 		
 		var dur = self.durationCoeff * speed;
 		var newX = self.getX() + (self.panDelta.x * speed);
		var newY = self.getY() + (self.panDelta.y * speed);
		var pos = self.checkBounds({ x: newX, y: newY });
 		self.trans = self.transitionTo({
 			x: pos.x,
 			y: pos.y,
 			easing: 'strong-ease-out',
 			duration: Math.abs(dur)
 		});
 	}
 }

Kinetic.Plugins.PinchLayer.prototype.getDistance = function(touch1, touch2) {
	var x1 = touch1.clientX;
    var x2 = touch2.clientX;
    var y1 = touch1.clientY;
    var y2 = touch2.clientY;
    return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
  }

Kinetic.Plugins.PinchLayer.prototype.layerTouchMove = function(event) {
   var touch1 = event.touches[0];
   var touch2 = event.touches[1];	

    if (touch1 && touch2) {
    	self.setDraggable(false);
    	if (self.trans != undefined) { self.trans.stop(); }
        if (self.startDistance === undefined) {
            self.startDistance = self.getDistance(touch1, touch2);
            self.touchPosition.x = (touch1.clientX + touch2.clientX) / 2;
            self.touchPosition.y = (touch1.clientY + touch2.clientY) / 2;
            self.layerPosition.x = (Math.abs(self.getX()) + self.touchPosition.x) / self.startScale;
            self.layerPosition.y = (Math.abs(self.getY()) + self.touchPosition.y) / self.startScale;
        }
        else {
            var dist = self.getDistance(touch1, touch2);
            var scale = (dist / self.startDistance) * self.startScale;
            if (scale < self.minScale) { scale = self.minScale; }
            if (scale > self.maxScale) { scale  = self.maxScale; }
            self.setScale(scale, scale);
	        var x = (self.layerPosition.x * scale) - self.touchPosition.x;
	        var y = (self.layerPosition.y * scale) - self.touchPosition.y;
	        var pos = self.checkBounds({ x: -x, y: -y });
            self.setPosition(pos.x, pos.y);
            self.draw();
        	}
    	}
	}
		
Kinetic.Plugins.PinchLayer.prototype.layerTouchEnd = function(event) {
   	self.setDraggable(true);
    self.startDistance = undefined;
    self.startScale = self.getScale().x;
}


