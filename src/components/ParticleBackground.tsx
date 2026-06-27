import { useEffect, useRef } from "react"

const SPACING = 20
const CROSS_ARM = 1
const DOT_ALPHA = 0.28

const BAYER_8 = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
]
const REPULSION_RADIUS = 110
const REPULSION_FORCE = 3.5
const SPRING = 0.06
const DAMPING = 0.82
const RESOLUTION = 2
// Cap the effective supersample. On high-DPR phones dpr*RESOLUTION balloons the
// canvas backing store (and per-frame fill cost ~dpr²) for no visible gain.
const MAX_DPR = 3
// Below this per-frame velocity the field is effectively at rest, so we stop
// scheduling frames until something (pointer, resize) wakes it again.
const REST_EPS = 0.01

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    hx: number
    hy: number
    alpha: number
}

interface ParticleBackgroundProps {
    flipped?: boolean
    className?: string
}

export function ParticleBackground({
    flipped = false,
    className = "h-lvh",
}: ParticleBackgroundProps = {}) {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const container = containerRef.current
        const canvas = canvasRef.current
        if (!container || !canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let width = container.clientWidth
        let height = container.clientHeight
        let particles: Particle[] = []
        let mouseX = -9999
        let mouseY = -9999
        let raf = 0
        let inView = false
        let pointerInside = false
        const reduced = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

        const schedule = () => {
            if (!raf && inView && !reduced) raf = requestAnimationFrame(tick)
        }

        const buildParticles = () => {
            const next: Particle[] = []
            const cx = width / 2
            const cy = flipped ? height : 0
            const maxR = Math.hypot(width / 2, height)
            const cols = Math.floor(width / SPACING)
            const rows = Math.floor(height / SPACING)
            const offX = (width - (cols - 1) * SPACING) / 2
            const offY = (height - (rows - 1) * SPACING) / 2
            for (let j = 0; j < rows; j++) {
                for (let i = 0; i < cols; i++) {
                    const x = offX + i * SPACING
                    const y = offY + j * SPACING
                    const radial = Math.min(1, Math.hypot(x - cx, y - cy) / maxR)
                    const vt = flipped ? 1 - y / height : y / height
                    const intensity = (1 - radial * radial) * (1 - vt * vt * 0.6)
                    const threshold = (BAYER_8[j % 8][i % 8] + 0.5) / 64
                    if (intensity <= threshold) continue
                    const baseAlpha = DOT_ALPHA * (1 - radial * 0.5) * (1 - vt * vt * 0.85)
                    next.push({
                        x,
                        y,
                        vx: 0,
                        vy: 0,
                        hx: x,
                        hy: y,
                        alpha: baseAlpha,
                    })
                }
            }
            particles = next
        }

        const resize = () => {
            width = container.clientWidth
            height = container.clientHeight
            const dpr = Math.min((window.devicePixelRatio || 1) * RESOLUTION, MAX_DPR)
            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            buildParticles()
            // Redraw the (possibly static) field after a resize.
            if (reduced) tick()
            else schedule()
        }

        const ro = new ResizeObserver(resize)
        ro.observe(container)

        // Only animate while the canvas is on screen.
        const io = new IntersectionObserver(
            ([entry]) => {
                inView = entry.isIntersecting
                if (inView) schedule()
            },
            { threshold: 0 },
        )
        io.observe(container)

        const onMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouseX = e.clientX - rect.left
            mouseY = e.clientY - rect.top
            pointerInside = true
            schedule()
        }

        const onLeave = () => {
            mouseX = -9999
            mouseY = -9999
            pointerInside = false
            schedule()
        }

        const onTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 0) return
            const touch = e.touches[0]
            const rect = canvas.getBoundingClientRect()
            mouseX = touch.clientX - rect.left
            mouseY = touch.clientY - rect.top
            pointerInside = true
            schedule()
        }

        const onTouchEnd = () => {
            mouseX = -9999
            mouseY = -9999
            pointerInside = false
            schedule()
        }

        if (!reduced) {
            window.addEventListener("mousemove", onMove)
            window.addEventListener("mouseleave", onLeave)
            window.addEventListener("touchmove", onTouchMove, { passive: true })
            window.addEventListener("touchend", onTouchEnd)
            window.addEventListener("touchcancel", onTouchEnd)
        }

        const tick = () => {
            raf = 0
            ctx.clearRect(0, 0, width, height)

            let energy = 0
            for (const p of particles) {
                const dx = p.x - mouseX
                const dy = p.y - mouseY
                const dist = Math.sqrt(dx * dx + dy * dy)

                if (dist < REPULSION_RADIUS && dist > 0) {
                    const falloff = 1 - dist / REPULSION_RADIUS
                    const force = falloff * falloff * REPULSION_FORCE
                    p.vx += (dx / dist) * force
                    p.vy += (dy / dist) * force
                }

                p.vx += (p.hx - p.x) * SPRING
                p.vy += (p.hy - p.y) * SPRING
                p.vx *= DAMPING
                p.vy *= DAMPING
                p.x += p.vx
                p.y += p.vy
                energy += Math.abs(p.vx) + Math.abs(p.vy)

                ctx.fillStyle = `rgba(255,255,255,${p.alpha})`
                const px = Math.round(p.x)
                const py = Math.round(p.y)
                ctx.fillRect(px - CROSS_ARM, py, CROSS_ARM * 2 + 1, 1)
                ctx.fillRect(px, py - CROSS_ARM, 1, CROSS_ARM * 2 + 1)
            }

            // Keep going only while there's motion or the pointer is engaged;
            // otherwise idle until an event wakes us. On touch (no pointer) the
            // field settles after one frame and stops repainting entirely.
            if (inView && !reduced && (energy > REST_EPS || pointerInside)) {
                raf = requestAnimationFrame(tick)
            }
        }

        if (reduced) tick()
        else schedule()

        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            io.disconnect()
            window.removeEventListener("mousemove", onMove)
            window.removeEventListener("mouseleave", onLeave)
            window.removeEventListener("touchmove", onTouchMove)
            window.removeEventListener("touchend", onTouchEnd)
            window.removeEventListener("touchcancel", onTouchEnd)
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className={`absolute inset-x-0 -z-10 ${flipped ? "bottom-0" : "top-0"} pointer-events-none ${className}`}
        >
            <canvas ref={canvasRef} className="block" />
        </div>
    )
}
