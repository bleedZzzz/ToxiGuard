'use client'

import { useEffect, useRef } from 'react'

export function TubesCursorAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        let app: any = null

        const initCursor = async () => {
            try {
                // @ts-ignore
                const module = await import('../lib/tubes-cursor.js')
                const TubesCursor = module.default

                app = TubesCursor(canvas, {
                    bloom: {
                        threshold: 0,
                        strength: 1.2,
                        radius: 0.5
                    },
                    tubes: {
                        count: 20,
                        colors: ["#00d9ff", "#ff006e", "#7b2cbf", "#06ffa5"],
                        minRadius: 0.01,
                        maxRadius: 0.08,
                        lights: {
                            intensity: 250,
                            colors: ["#00d9ff", "#ff006e", "#7b2cbf", "#06ffa5"]
                        }
                    },
                    sleepRadiusX: 500,
                    sleepRadiusY: 250,
                    sleepTimeScale1: 2,
                    sleepTimeScale2: 4
                })

                const handleClick = () => {
                    const colors = randomColors(4)
                    const lightsColors = randomColors(4)
                    if (app && app.tubes) {
                        app.tubes.setColors(colors)
                        app.tubes.setLightsColors(lightsColors)
                    }
                }

                document.body.addEventListener('click', handleClick)

                return () => {
                    document.body.removeEventListener('click', handleClick)
                    if (app && typeof app.dispose === 'function') {
                        app.dispose()
                    }
                }
            } catch (error) {
                console.error('Failed to load TubesCursor:', error)
            }
        }

        const cleanupPromise = initCursor()

        return () => {
            cleanupPromise.then(cleanup => cleanup && cleanup())
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            id="canvas"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: -1
            }}
        />
    )
}

function randomColors(count: number) {
    return new Array(count)
        .fill(0)
        .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'))
}
