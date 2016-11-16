attribute vec3 aVertexPosition;//Valor default
attribute vec3 aVertexNormal;//Valor default
attribute vec2 aTextureCoord;//Valor default

uniform mat4 uMVMatrix;//Matrix relativa ao objecto
uniform mat4 uPMatrix;//Matrix relativa ao objecto
uniform mat4 uNMatrix;//Matrix relativa ao objecto

uniform float time;

varying vec2 vTextureCoord;//Parametro a ser partilhado com o fragment shader
varying float newY;


void main( void ) {
/*
    vec2 res = aTextureCoord * size;

    float multi = 0.0;


    if(selected.x <= floor(res.x - 0.0) && selected.y <= floor(res.y - 0.0))
        if(selected.x >= floor(res.x -0.1) && selected.y >= floor(res.y -0.1))
        multi = altura;


    vTextureCoord = aTextureCoord;
    */
    float h = cos(time + aVertexPosition.x) * 0.5 * sin(time + aVertexPosition.y);
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + aVertexNormal * h, 1.0);
    newY = h + 0.5;

}
