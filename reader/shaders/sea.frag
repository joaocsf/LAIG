#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;//Referencia da textura

varying vec2 vTextureCoord;//Variavel recebida do vertex shader


void main( void ) {
/*
    vec2 position = vTextureCoord;

    vec4 pixelColor = texture2D(uSampler, vTextureCoord);

    float r = grid(vTextureCoord,size);

    vec4 overlay = r * color1 + (1.0-r) * color2;

    vec2 res = position * size;

    float isSelect = 0.0;

    if(selected.x == floor(res.x) && selected.y == floor(res.y))
        isSelect = 1.0;

    if(isSelect > 0.1)
        overlay = colorSel;

    pixelColor.rgba *= overlay.rgba;
*/
    gl_FragColor = vec4(0.0,0.0,0.61,1.0);

}
