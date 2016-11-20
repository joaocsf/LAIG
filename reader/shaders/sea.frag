#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;//Referencia da textura

uniform float inv;

varying vec2 vTextureCoord;//Variavel recebida do vertex shader
varying float newY;

void main( void ) {

    vec4 texel = texture2D(uSampler,vTextureCoord);
	
    gl_FragColor = vec4(texel.rgb * clamp(newY,0.3,0.6),texel.a);
}
