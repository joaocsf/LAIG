var Animation = function(object) {
    if (this.constructor === Animation) {
        throw new Error("Can't instantiate abstract class!");
    }
    this.obj = object;
    //Animation initialization...
};

Animation.prototype.getPos = function() {
    throw new Error("Abstract class!");
}
