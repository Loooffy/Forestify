const createHexMap = (x0, y0, r, outerHexRatio, innerHexRatio) => {
    let map = new hexMap(x0, y0, r, outerHexRatio, innerHexRatio)
    let outerHexMatrix = []
    let innerHexMatrix = []
    for (let i=1;i<7;i++) {
        for (let j=1;j<6;j++) {
            outerHexMatrix.push([i, j])
            innerHexMatrix.push([i, j])
        }
    }
    let allHex = map.hexMatrix(outerHexMatrix, innerHexMatrix)
    return allHex
}

class hexMap {
    constructor(x0, y0, d, outerHexRatio, innerHexRatio) {
        this.d = d //length of one side of hex
        this.r = d * 0.6 //border radius
        this.outerHexRatio = outerHexRatio/100
        this.innerHexRatio = innerHexRatio/100
        this.x0 = x0
        this.y0 = y0
        this.one = d
        this.two = d * 2
        this.three = d * Math.sqrt(3)
        this.rowD = d * 3
        this.colD = d * Math.sqrt(3) * 2
    }

    createOuterHex(row, col){
        let one = this.one * this.outerHexRatio
        let two = this.two * this.outerHexRatio
        let three = this.three * this.outerHexRatio
        let x = this.x0 + this.rowD * row
        let y = this.y0 + this.colD * (row % 2 === 0 ? col + 0.5 : col)
        let p1 = `M${x - one + this.r * 0.5}, ${y - three}\n`
        let p2 = `L${x + one - this.r * 0.5}, ${y - three}\n`
        let pa1 = `A ${this.r} ${this.r} 0 0 1 ${x + one + this.r * 0.366} ${y - one - this.r * 0.5}\n`
        let p3 = `L${x + two - this.r * 0.289}, ${y - this.r * 0.5}\n`
        let pa2 = `A ${this.r} ${this.r} 0 0 1 ${x + two - this.r * 0.289} ${y +  this.r * 0.5}\n`
        let p4 = `L${x + one + this.r * 0.366}, ${y + three - this.r * 0.5}\n`
        let pa3 = `A ${this.r} ${this.r} 0 0 1 ${x + one - this.r * 0.5} ${y + three}\n`
        let p5 = `L${x - one + this.r * 0.5}, ${y + three}\n`
        let pa4 = `A ${this.r} ${this.r} 0 0 1 ${x - one - this.r * 0.336} ${y + three - this.r * 0.5}\n`
        let p6 = `L${x - two + this.r * 0.289}, ${y + this.r * 0.5}\n`
        let pa5 = `A ${this.r} ${this.r} 0 0 1 ${x - two + this.r * 0.289} ${y - this.r * 0.5}\n`
        let p7 = `L${x - one - this.r * 0.366}, ${y - one - this.r * 0.5}\n`
        let pa6 = `A ${this.r} ${this.r} 0 0 1 ${x - one + this.r * 0.5} ${y - three}\n`
        let hexPath = p1 + p2 + pa1 + p3 + pa2 + p4 + pa3 + p5 + pa4 + p6 + pa5 + p7 + pa6
        let hexData = {
            path: hexPath,
            x: Math.floor(x),
            y: Math.floor(y)
        }
        return hexData
    }

    createInnerHex(row, col){
        let one = this.one * this.innerHexRatio
        let two = this.two * this.innerHexRatio
        let three = this.three * this.innerHexRatio
        let x = this.x0 + this.rowD * row
        let y = this.y0 + this.colD * (row % 2 === 0 ? col + 0.5 : col)
        let p2 = `M${x + one - this.r * 0.5}, ${y - three}\n`
        let pa1 = `A ${this.r} ${this.r} 0 0 1 ${x + one + this.r * 0.366} ${y - one - this.r * 0.5}\n`
        let p3 = `M${x + two - this.r * 0.289}, ${y - this.r * 0.5}\n`
        let pa2 = `A ${this.r} ${this.r} 0 0 1 ${x + two - this.r * 0.289} ${y +  this.r * 0.5}\n`
        let p4 = `M${x + one + this.r * 0.366}, ${y + three - this.r * 0.5}\n`
        let pa3 = `A ${this.r} ${this.r} 0 0 1 ${x + one - this.r * 0.5} ${y + three}\n`
        let p5 = `M${x - one + this.r * 0.5}, ${y + three}\n`
        let pa4 = `A ${this.r} ${this.r} 0 0 1 ${x - one - this.r * 0.336} ${y + three - this.r * 0.5}\n`
        let p6 = `M${x - two + this.r * 0.289}, ${y + this.r * 0.5}\n`
        let pa5 = `A ${this.r} ${this.r} 0 0 1 ${x - two + this.r * 0.289} ${y - this.r * 0.5}\n`
        let p7 = `M${x - one - this.r * 0.366}, ${y - one - this.r * 0.5}\n`
        let pa6 = `A ${this.r} ${this.r} 0 0 1 ${x - one + this.r * 0.5} ${y - three}\n`
        let hexPath = p2 + pa1 + p3 + pa2 + p4 + pa3 + p5 + pa4 + p6 + pa5 + p7 + pa6
        let hexData = {
            path: hexPath,
            x: Math.floor(x),
            y: Math.floor(y)
        }
        return hexData
    }

    hexMatrix(outerHexMatrix, innerHexMatrix) {

        let allOuterHex = []
        let allInnerHex = []

        outerHexMatrix.map(hexXY => {
            let hex = this.createOuterHex(hexXY[0], hexXY[1])
            let hexData = {
                d: hex.path,
                code: hexXY[3],
                text: hexXY[2],
                x: hex.x,
                y: hex.y
            }
            allOuterHex.push(hexData)
        })

        innerHexMatrix.map(hexXY => {
            let hex = this.createInnerHex(hexXY[0], hexXY[1])
            let hexData = {
                d: hex.path
            }
            allInnerHex.push(hexData)
        })

        return [...allInnerHex, ...allOuterHex]
    }
}

module.exports = {
    createHexMap, 
    hexMap
}
