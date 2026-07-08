import { memo, useEffect, useRef } from 'react'
import { Camera, Geometry, Mesh, Program, Renderer } from 'ogl'

interface ParticlesProps {
  particleCount?: number
  particleSpread?: number
  speed?: number
  particleColors?: string[]
  className?: string
}

const hexToRgb = (hex: string): [number, number, number] => {
  const clean = hex.replace(/^#/, '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const int = parseInt(full, 16)
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255]
}

const vertex = `
attribute vec3 position;
attribute vec4 random;
attribute vec3 color;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uSpread;
uniform float uBaseSize;
uniform float uSizeRandomness;
varying vec3 vColor;
void main() {
  vColor = color;
  vec3 pos = position * uSpread;
  pos.z *= 10.0;
  vec4 mPos = modelMatrix * vec4(pos, 1.0);
  float t = uTime;
  mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
  mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
  mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
  vec4 mvPos = viewMatrix * mPos;
  gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
  gl_Position = projectionMatrix * mvPos;
}`

const fragment = `
precision highp float;
uniform float uTime;
varying vec3 vColor;
void main() {
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv - vec2(0.5));
  if (d > 0.5) discard;
  gl_FragColor = vec4(vColor + 0.15 * sin(uv.yxx + uTime), 0.6);
}`

export const Particles = memo(function Particles({
  particleCount = 120,
  particleSpread = 10,
  speed = 0.08,
  particleColors = ['#e9d5ff', '#fbcfe8', '#ddd6fe', '#fce7f3'],
  className = '',
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let renderer: Renderer
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 1.5), depth: false, alpha: true })
    } catch {
      return
    }

    const gl = renderer.gl
    container.appendChild(gl.canvas)
    gl.clearColor(0, 0, 0, 0)

    const camera = new Camera(gl, { fov: 15 })
    camera.position.set(0, 0, 20)

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight)
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height })
    }
    resize()
    window.addEventListener('resize', resize)

    const count = particleCount
    const positions = new Float32Array(count * 3)
    const randoms = new Float32Array(count * 4)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number, len: number
      do {
        x = Math.random() * 2 - 1
        y = Math.random() * 2 - 1
        z = Math.random() * 2 - 1
        len = x * x + y * y + z * z
      } while (len > 1 || len === 0)
      const r = Math.cbrt(Math.random())
      positions.set([x * r, y * r, z * r], i * 3)
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4)
      const col = hexToRgb(particleColors[Math.floor(Math.random() * particleColors.length)])
      colors.set(col, i * 3)
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    })

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: 80 },
        uSizeRandomness: { value: 0.8 },
      },
      transparent: true,
      depthTest: false,
    })

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program })
    let raf = 0
    let elapsed = 0
    let last = performance.now()

    const update = (t: number) => {
      raf = requestAnimationFrame(update)
      elapsed += (t - last) * speed
      last = t
      ;(program.uniforms.uTime as { value: number }).value = elapsed * 0.001
      particles.rotation.y = elapsed * 0.00015
      renderer.render({ scene: particles, camera })
    }
    raf = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      try {
        container.removeChild(gl.canvas)
      } catch {
        /* noop */
      }
    }
  }, [particleCount, particleSpread, speed, particleColors])

  return <div ref={containerRef} className={`h-full w-full ${className}`} />
})

export default Particles
