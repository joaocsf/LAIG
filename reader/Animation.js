var Animation = function() {

    if (this.constructor === Animation) {
        throw new Error("Can't instantiate abstract class!");
    }

};

Animation.prototype.getTransformation = function(time) {
    throw new Error("Abstract class!");
}

Animation.prototype.getTime = function() {
    throw new Error("Abstract class!");
}
