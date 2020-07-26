const createHexMap = (x0, y0, r) => {
    let map = new hexMap(x0, y0, r)
    let matrix = []
    //let text = '指數與科學記號記號'
    let text = '1'
    for (let i=1;i<12;i++) {
        for (let j=1;j<7;j++) {
            //matrix.push([i, j, `${i}${j}`])
            matrix.push([i, j, text.length < 8 ? text : `${text.slice(0,7)}...` ])
        }
    }
    let allHex = map.hexMatrix(matrix)
    return allHex
}

class hexMap {
    constructor(x0, y0, r) {
        this.r = r
        this.x0 = x0
        this.y0 = y0
        this.one = r
        this.two = r * 2
        this.three = r * Math.sqrt(3)
        this.rowD = r * 3
        this.colD = r * Math.sqrt(3) * 2
    }

    createHex(row, col){
        let x = this.x0 + this.rowD * row
        let y = this.y0 + this.colD * (row % 2 === 0 ? col + 0.5 : col)
        let p1 = `M${x - this.one}, ${y - this.three}\n`
        let p2 = `L${x + this.one}, ${y - this.three}\n`
        let p3 = `L${x + this.two}, ${y}\n`
        let p4 = `L${x + this.one}, ${y + this.three}\n`
        let p5 = `L${x - this.one}, ${y + this.three}\n`
        let p6 = `L${x - this.two}, ${y}\n`
        let p0 = `L${x - this.one}, ${y - this.three}\n`
        let hexPath = p1 + p2 + p3 + p4 + p5 + p6 + p0
        let hexData = {
            path: hexPath,
            tx: x,
            ty: y
        }
        return hexData
    }

    hexMatrix(matrix) {
        let allHex = []
        matrix.map(hexXY => {
            let hex = this.createHex(hexXY[0], hexXY[1])
            let hexData = {
                d: hex.path,
                code: hexXY[3],
                text: hexXY[2],
                tx: hex.tx,
                ty: hex.ty
            }
            allHex.push(hexData)
        })
        return allHex
    }
}

module.exports = {
    createHexMap, 
    hexMap
}
