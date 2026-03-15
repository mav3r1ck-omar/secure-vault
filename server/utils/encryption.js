const crypto=require('crypto');
const { buffer } = require('stream/consumers');

const algorithm='aes-256-cbc';
const key = process.env.ENCRYPTION_KEY ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex') : crypto.randomBytes(32);

exports.encrypt=(text)=>{
    const iv=crypto.randomBytes(16);
    let cipher=crypto.createCipheriv(algorithm,key,iv);
    let encrypted=cipher.update(text);

    encrypted=Buffer.concat([encrypted,cipher.final()]);

    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex')
    }
};

exports.decrypt=(text)=>{
    let iv=Buffer.from(text.iv,'hex');
    let encryptedtext=Buffer.from(text.encryptedData,'hex');

    let decipher=crypto.createDecipheriv(algorithm.key,iv);
    let decrypted=decipher.update(encryptedtext);

    decrypted=buffer.concat([decrypted,decipher.final()]);
    return decipher.toString();
};

exports.getkey=()=>key.toString('hex');