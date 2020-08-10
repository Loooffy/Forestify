const chai = require('chai')
const assert = chai.assert;
const {createHexMap, hexMap} = require('../util/hexMapCreator')
//const chaiHttp = require('chai-http')
//const server = require.('../app')
//chai.use(chaiHttp)
//const requester = chai.request(app).keepOpen(); // non-login user

describe('hexMap', async () => {
    it('create hexMap', async () => {
        const map = await new hexMap(0, 0, 30, 0.9, 0.8)
        const outerHex = map.createOuterHex(1, 1)
        const innerHex = map.createInnerHex(1, 1)
        assert.strictEqual(outerHex, innerHex, 'outerHex and innerHex is not cocentric') 
    })
})
