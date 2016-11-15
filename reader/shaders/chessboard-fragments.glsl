#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

    vec2 position = ( gl_FragCoord.xy / resolution.xy );

    vec2 casas = vec2(10,2);

    casas = vec2(1,1)/casas;

    vec4 test = vec4(0.0,0.0,0.0,0.0);

    vec2 res = position/casas;

    vec2 total = vec2(mod(floor(res.x),2.0), mod(floor(res.y) + 0.0, 2.0));


    float t = total.x + total.y;

    if(total.x > 0.1 && total.y > 0.1)
        t = 0.0;

    test.r = t * 1.0;
    test.b = t * 1.0;

    gl_FragColor = test;

}
