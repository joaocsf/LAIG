/* This File must be used to write your own lerp methods
	-Example: lerpFunction(firstValue, secondValue, time);
	The time is normalize between [0,1]
 */
 
/* function to interpolate between two points */
function transition_vector3(p1, p2, time){
	
	var res= {
		x: p1.x + (p2.x - p1.x) * time,
		y: p1.y + (p2.y - p1.y) * time,
		z: p1.z + (p2.z - p1.z) * time
	}
	return res;
}