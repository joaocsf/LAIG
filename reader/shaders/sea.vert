attribute vec3 aVertexPosition;//Valor default
attribute vec3 aVertexNormal;//Valor default
attribute vec2 aTextureCoord;//Valor default

uniform mat4 uMVMatrix;//Matrix relativa ao objecto
uniform mat4 uPMatrix;//Matrix relativa ao objecto
uniform mat4 uNMatrix;//Matrix relativa ao objecto

uniform float time;
uniform float inv;

varying vec2 vTextureCoord;//Parametro a ser partilhado com o fragment shader
varying float newY;//Parametro da nova altura do vertice para determinar a sua cor


void main( void ) {
	
	float pi = 3.14;
	float d = inv;
	vec2 pos = aTextureCoord;
	vec2 uv = pos;
	
	pos.y = abs( d - aTextureCoord.y);
	pos *= 10.0;
	float waveFactor = 10.0;
    float c = (time + pos.x);
    float s = (time + pos.y);
    float h = cos(1.5 * c + pi) * 0.35 * sin(1.0 * s + pi);
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + aVertexNormal * h, 1.0);
    newY = (h + 0.35)/0.7;
    vTextureCoord = uv;

}
