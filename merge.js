class MergeImg {
    constructor (options) {
        return this.initCanvas(options)
    }
    initCanvas (options) {
        this.data = options.data || []
        /**
         * 画布中图片大小
         */
        this.imgWidth = 130
        this.imgHeight = 130
        this.aFewLines = 6 // 一行可以放几张图片
        this.severalLines = 0 // 默认为第0行
        this.top = 0
        /**
         * 图像间距
         */
        this.imgMargin = 10
        this.textHeight = 38
        /**
         * 画布大小
         */
        this.width = options.width || 850
        this.height = options.height || this.computedCanvasHeight()

        this.canvas = options.canvas
        this.ctx = options.canvas.getContext('2d')

        this.canvas.width = this.width
        this.canvas.height = this.height
        this.ctx.rect(0, 0, this.width, this.height)
        this.ctx.fillStyle = '#fff'
        this.ctx.fill()
        Object.keys(options).forEach(item => {
            if (typeof options[item] === 'function') {
                this[item] = options[item]
            }
        })
        return new Promise(resolve => {
            this.createImg(this.data, 0, resolve)
        })
    }
    computedCanvasHeight () {
        this.aFewLines = Math.floor(this.width / this.imgWidth)
        let lines = Math.ceil(this.data.length / this.aFewLines)
        // console.log(lines)
        return ( this.imgHeight + this.imgMargin + this.textHeight) * lines + this.imgMargin // 加上上下顶端的间距
    }
    createImg (data, i, resolve) {
        let column = i % this.aFewLines // 取余保证行数增加,
        let left = column * this.imgWidth + ((column + 1) * this.imgMargin) // 左间距依次加10
        const img = new Image()
        img.setAttribute("crossOrigin",'Anonymous')
        this.ctx.fillStyle = '#000'
        this.ctx.font = '16px 宋体'
        this.ctx.textAlign = 'center'
        img.onload = () => {
            if (column === 0) { // 当索引序号与一行所放的个数取余为0时，就重开一行，并把top设为上一行乘以画布上插入的图片高度
                this.top = this.severalLines * (this.imgHeight + this.textHeight) + ((this.severalLines + 1) * this.imgMargin) // 上间距
                this.severalLines++ // 另起一行
            }
            let textTop = this.top + this.imgHeight + this.imgMargin + 5 // 5: 容错像素，考虑文字与图挤在一起
            let textLeft = left + this.imgWidth / 2
            this.ctx.fillText(data[i].name, textLeft, textTop)
            this.ctx.fillText(data[i].code, textLeft, textTop + 16)
            this.ctx.drawImage(img, left, this.top, this.imgWidth, this.imgHeight)
            if (i < data.length - 1) this.createImg(data, ++i, resolve) // 如果索引小于数据数组长度，则递归调用
            else resolve(this.canvas2Img()) // 结束后输出合并后的img
        }
        img.src = data[i].url
    }
    canvas2Img () {
        this.base64 = this.canvas.toDataURL("image/png") // 取出canvas画布转成图片的base64路径，发送给后端
        // this.getTransBase64(this.base64)
        return this.getBlob(this.base64)
    }
    getBlob (base64) {
        return this.b64toBlob(this.getImgData(base64), this.getContentType(base64));
    }
    getContentType (base64) {
        return /data:([^;]*);/i.exec(base64)[1];
    }
    getImgData (base64) {
        return base64.substr(base64.indexOf("base64,") + 7, base64.length);
    }
    b64toBlob (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
}
