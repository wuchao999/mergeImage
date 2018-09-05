
function Merge (options) {
    this.initCanvas(options)
}
Merge.prototype = {
    initCanvas (options) {
        this.data = options.data || []
        /**
         * 画布中图片大小
         */
        this.imgWidth = 100
        this.imgHeight = 100
        this.aFewLines = 8 // 一行可以放几张图片
        this.severalLines = 0 // 默认为第0行
        this.top = 0
        /**
         * 图像间距
         */
        this.imgMargin = 10
        /**
         * 画布大小
         */
        this.width = options.width || 890
        this.height = options.height || this.computedCanvasHeight()

        this.canvas = options.canvas
        this.ctx = options.canvas.getContext('2d')

        this.canvas.width = this.width
        this.canvas.height = this.height
        this.ctx.rect(0, 0, this.width, this.height)
        this.ctx.fillStyle = '#fff'
        this.ctx.fill()
        this.getTransBase64 = options.getTransBase64
        this.createImg(this.data, 0)
    },
    computedCanvasHeight () {
        this.aFewLines = Math.floor(this.width / this.imgWidth)
        let lines = Math.ceil(this.data.length / this.aFewLines)
        // console.log(lines)
        return ( this.imgHeight + this.imgMargin) * lines + this.imgMargin // 加上上下顶端的间距
    },
    createImg (data, i) {
        const img = new Image()
        img.setAttribute("crossOrigin",'Anonymous')
        img.onload = () => {
            let column = i % this.aFewLines // 取余保证行数增加,
            let left = column * this.imgWidth + ((column + 1) * this.imgMargin) // 左间距依次加10
            if (column === 0) { // 当索引序号与一行所放的个数取余为0时，就重开一行，并把top设为上一行乘以画布上插入的图片高度
                this.top = this.severalLines * this.imgHeight + ((this.severalLines + 1) * this.imgMargin) // 上间距
                this.severalLines++ // 另起一行
            }
            this.ctx.drawImage(img, left, this.top, this.imgWidth, this.imgHeight)
            if (i < data.length - 1) this.createImg(data, ++i) // 如果索引小于数据数组长度，则递归调用
            else this.canvas2Img() // 结束后输出合并后的img
        }
        img.src = data[i]
    },
    canvas2Img () {
        this.base64 = this.canvas.toDataURL("image/png") // 取出canvas画布转成图片的base64路径，发送给后端
        this.getTransBase64(this.base64)
    }
}