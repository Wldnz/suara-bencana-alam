const {createHmac} = require('crypto');

class Hash{

    constructor(data){
        this.data = data;
    }

    static sha256(string){
        const hash = createHmac('sha256',process.env.SECRET_HASH_ACCOUNT)
        .update(string)
        .digest('hex')
        return hash
    }
}

module.exports = Hash;