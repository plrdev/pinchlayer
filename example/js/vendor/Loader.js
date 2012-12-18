Kinetic.Plugins.Loader = function(files){
    this.files = files;
    this.progressFunc = null;
    this.errorFunc = null;
    this.completeFunc = null;
    Kinetic.Global.Assets = {};
    this.extensions ={
        'jpg':'image',
        'png':'image',
        'gif':'image',
        'jpeg':'image',
        'bmp':'image',
        'svg':'image'
    }
}

Kinetic.Plugins.Loader.prototype.onProgress = function(progress){
    this.progressFunc = progress;
    return this; 	
}
Kinetic.Plugins.Loader.prototype.onError = function(error){
    this.errorFunc = error;
    return this;
}
Kinetic.Plugins.Loader.prototype.onComplete = function(complete){
    this.completeFunc = complete;
    return this;
}
Kinetic.Plugins.Loader.prototype.load = function(){
    var i = 0,l=this.files.length,total = l,loaded = 0;
    var that = this;
    function progress(e){
        ++loaded;
        
        var src = e.target.src;
   
        if(that.progressFunc) that.progressFunc({
            loaded:loaded,
            total:total,
            percent:loaded/total*100,
            src:src,
            name:src.substr(src.lastIndexOf('/') + 1).toLowerCase()
        });
        if(loaded >= total && that.completeFunc) that.completeFunc();
    }
    function error(e){
        loaded++; 
          var src = e.target.src;
        
        if(that.errorFunc) that.errorFunc({
            loaded:loaded,
            total:total,
            percent:loaded/total*100,
            src:src,
            name:src.substr(src.lastIndexOf('/') + 1).toLowerCase()
        });
        if(loaded >= total && that.completeFunc) that.completeFunc();
    }
    for(;i<l;++i){
        var file = this.files[i],fileObj =null,src,ext,id;

        if(typeof file === "object"){
            src = file.src;
            id = file.id;
            ext = src.substr(src.lastIndexOf('.') + 1).toLowerCase();
            
        }
 
        if(this.extensions[ext] == 'image'){
            fileObj = new Image();
            if(!Kinetic.Global.Assets[id]) Kinetic.Global.Assets[id] = fileObj;
            fileObj.onload = function(e){
                progress(e);
            }
            fileObj.onerror = function(e){
                error(e);
            }
            fileObj.src = src;
          
          
        }else if(this.extensions[ext] == 'audio'){
        //TODO
        }else if(this.extensions[ext] == 'video'){
        //TODO
        }else{
            total--;
            continue;
        }
    }
    
}
