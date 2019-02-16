const w : number = window.innerWidth
const h : number = window.innerHeight
const nodes : number = 5
const parts : number = 2
const scGap : number = 0.05
const scDiv : number = 0.51
const sizeFactor : number = 2.8
const strokeFactor : number = 3
const foreColor : string = '#4CAF50'
const backColor : string = '#BDBDBD'
const rFactor : number = 5

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

const drawBallLine : Function = (context : CanvasRenderingContext2D, size : number, sc : number, i : number, r : number) => {
    const sck : number = divideScale(sc, i, parts)
    context.save()
    context.translate(0, -size * i)
    context.rotate(Math.PI / 2 * i)
    context.fillRect(-r, -size * sck, 2 * r, size * sck)
    context.beginPath()
    context.arc(0, -size * sck, r, 0, 2 * Math.PI)
    context.fill()
    context.restore()
}

const drawBLMNode : Function = (context : CanvasRenderingContext2D, i : number, scale : number) => {
    const gap : number = h / (nodes + 1)
    const size : number = gap / sizeFactor
    context.fillStyle = foreColor
    context.save()
    context.translate(w / 2, gap * (i + 1))
    for (var j = 0; j < parts; j++) {
        const sc : number = divideScale(scale, j, parts)
        context.save()
        context.scale(1 - 2 * j, 1 - 2 * j)
        for (var k = 0; k < parts; k++) {
            drawBallLine(context, size, sc, k, size / rFactor)
        }
        context.restore()
    }
    context.restore()
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

class State {
    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += updateValue(this.scale, parts, parts)
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {
    interval : number
    animated : boolean = false

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class BLMNode {

    state : State = new State()
    prev : BLMNode
    next : BLMNode

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < nodes - 1) {
            this.next = new BLMNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context : CanvasRenderingContext2D) {
        drawBLMNode(context, this.i, this.state.scale)
        if (this.next) {
            this.next.draw(context)
        }
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : BLMNode {
        var curr : BLMNode = this.prev
        if (dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}

class BallLineMaze {
    root : BLMNode = new BLMNode(0)
    curr : BLMNode = this.root
    dir : number = 1

    draw(context : CanvasRenderingContext2D) {
        this.root.draw(context)
    }

    update(cb : Function) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb : Function) {
        this.curr.startUpdating(cb)
    }
}

class Renderer {

    blm : BallLineMaze = new BallLineMaze()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.blm.draw(context)
    }

    handleTap(cb : Function) {
        this.blm.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.blm.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}
