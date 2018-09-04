class merge {
    constructor (canvas, width, height) {
        console.log(canvas)
        this.width = width || 890
        this.height = height || 890
        canvas.width = this.width
        canvas.height = this.height
        init(canvas)
    }
    init (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.rect(0, 0, c.width, c.height)
        ctx.fillStyle = '#fff'
        ctx.fill()
    }
}