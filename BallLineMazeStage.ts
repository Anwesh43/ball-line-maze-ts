const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.05
const scDiv : number = 0.51
const sizeFactor : number = 2.8
const strokeFactor : number = 3
const foreColor : string = '#4CAF50'
const backColor : string = '#BDBDBD'

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
