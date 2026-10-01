// GLSL for the "Still Field" hero — raw WebGL1, one fragment shader over a
// fullscreen quad. No three.js. The fragment shader casts a ray from a low
// camera onto a ground plane, lays a receding grid of dots on it, lifts the
// dots on a slow three-octave swell, fades them into depth fog, and tints only
// the highest crests with the accent colour. Colours arrive as uniforms read
// from the page's CSS tokens, so light/dark are the same shader.

export const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

export const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_look;    // yaw, pitch offset in radians (small, damped)
uniform float u_cell;    // world units per dot cell (scales with viewport width)
uniform vec3  u_bg;
uniform vec3  u_dot;
uniform vec3  u_accent;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 3; i++) {
    v += amp * vnoise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

  // Ray from a camera tilted ~12 degrees down toward the plane.
  float pitch = 0.21 + u_look.y;
  float yaw = u_look.x;
  vec3 rd = normalize(vec3(uv.x, uv.y - 0.16, 1.0));
  float cp = cos(pitch), sp = sin(pitch);
  rd = vec3(rd.x, rd.y * cp - rd.z * sp, rd.y * sp + rd.z * cp);
  float cyw = cos(yaw), syw = sin(yaw);
  rd = vec3(rd.x * cyw + rd.z * syw, rd.y, -rd.x * syw + rd.z * cyw);

  vec3 ro = vec3(0.0, 1.0, -2.0);

  // Above the horizon there is no ground: fall back to the background.
  if (rd.y > -0.0015) {
    gl_FragColor = vec4(u_bg, 1.0);
    return;
  }

  float t = -ro.y / rd.y;
  vec3 hit = ro + t * rd;
  vec2 w = hit.xz;

  // Slow swell: a ~40s period oscillation drifting the noise field.
  float swell = 0.5 + 0.5 * sin(u_time * 0.157);
  float h = fbm(w * 0.33 + vec2(u_time * 0.015, swell * 0.4));

  // Dot grid in world space — perspective makes it recede on its own.
  vec2 g = fract(w / u_cell) - 0.5;
  float dcl = length(g);
  float dot = 1.0 - smoothstep(0.14, 0.24, dcl);

  // Depth fog thins the far dots.
  float fog = exp(-t * 0.055);
  dot *= fog;

  // Accent only on the top ~8% of crests.
  float crest = smoothstep(0.70, 0.86, h);
  vec3 dotCol = mix(u_dot, u_accent, crest);

  vec3 col = mix(u_bg, dotCol, clamp(dot, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}
`;
