var Picking = function(scene) {
    this.scene = scene;
    this.selectables = [];

};

Picking.prototype.constructor = Picking;

Picking.prototype.logPicking = function () {
    if (this.scene.pickMode == false) {
        if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
            for (var i=0; i< this.scene.pickResults.length; i++) {
                var obj = this.scene.pickResults[i][0];
                if (obj)
                {
                    var customId = this.scene.pickResults[i][1];
                    console.log(this.scene.pickResults[i]);
                    console.log(obj);
                    console.log("Picked object: " + obj + ", with pick id " + customId);
                }
            }
            this.scene.pickResults.splice(0,this.scene.pickResults.length);//Limpa o array
        }
    }
};

Picking.prototype.clear = function () {
    this.scene.clearPickRegistration();
};

Picking.prototype.addObject = function (object) {
    this.selectables.push();
};

Picking.prototype.removeObject = function (object) {
    var index = this.selectables.indexOf(object);
    if(index == -1)
        return;
    this.selectables.splice(index,1);
    return;
};

Picking.prototype.register = function () {
    for(var i = 0; i < this.selectables.length; i++){
        
    }
};
