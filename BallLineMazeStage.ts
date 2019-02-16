const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.05
const scDiv : number = 0.51
const sizeFactor : number = 2.8
const strokeFactor : number = 3
const foreColor : string = '#4CAF50'
const backColor : string = '#BDBDBD'

const maxScale : Function = (scale : number, i : number, n : number) : number => {
    return Math.max(0, scale - i / n)
}

const divideScale : Function = (scale : number, i : number, n : number) : number => {
    return Math.min(1 / n, maxScale(scale, i, n)) * n
}

const scaleFactor : Function = (scale : number) =>  Math.floor(scale / scDiv)

const mirrorValue : Function = (scale : number, a : number, b : number) => {
    const k : number = scaleFactor(scale)
    return (1 - k) / a + k / b
}

const updateValue : Function = (scale : number, dir : number, a : number, b : number) => {
    return mirrorValue(scale, a, b) * dir * scGap
}

class BallLineMazeStage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static initCanvas() {
        const stage : BallLineMazeStage = new BallLineMazeStage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}
