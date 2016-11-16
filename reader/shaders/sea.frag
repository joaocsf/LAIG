#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;//Referencia da textura

uniform float time;

varying vec2 vTextureCoord;//Variavel recebida do vertex shader
varying float newY;

void main( void ) {

    float coisa = mod(floor(newY),2.0);
    vec4 color = vec4(newY * coisa,newY * coisa, newY, 1.0);
    gl_FragColor = color;

}
