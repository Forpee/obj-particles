uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 pos=position;
    vec3 stable=position;
    
    float dist=distance(stable.xy,uMouse);
    float area=1.-smoothstep(0.,30.,dist);
    
    // pos.x+=uMouse.x*20.*area;
    pos.x+=uMouse.y*2.*area;
    // pos.z+=uMouse.z*.01;
    // pos.y+=50.+uMouse.y;
    // pos.z+=50.+uMouse.z;
    vec4 mvPosition=modelViewMatrix*vec4(pos,1.);
    gl_PointSize=1.*(10./-mvPosition.z);
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
    
    vUv=uv;
    vNormal=normal;
    vPosition=position;
}