attribute vec3 aVertexPosition;//Valor default
attribute vec3 aVertexNormal;//Valor default
attribute vec2 aTextureCoord;//Valor default

uniform mat4 uMVMatrix;//Matrix relativa ao objecto
uniform mat4 uPMatrix;//Matrix relativa ao objecto
uniform mat4 uNMatrix;//Matrix relativa ao objecto

varying vec2 vTextureCoord;//Parametro a ser partilhado com o fragment shader


void main( void ) {
/*
    vec2 res = aTextureCoord * size;

    float multi = 0.0;


    if(selected.x <= floor(res.x - 0.0) && selected.y <= floor(res.y - 0.0))
        if(selected.x >= floor(res.x -0.1) && selected.y >= floor(res.y -0.1))
        multi = altura;


    vTextureCoord = aTextureCoord;
    */
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

}
