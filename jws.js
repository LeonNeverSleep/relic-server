const jsonwebtoken = require('jsonwebtoken');
const secret = 'liangxiangjie_key';

module.exports = {
    generate: function (value, expires = '7 days') {
        try {
            return jsonwebtoken.sign({ name: value }, secret, { expiresIn: expires });
        } catch (error) {
            console.log(error);
            return '';
        }
    },
    verify: function (token) {
        try {
            return jsonwebtoken.verify(token, secret);
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}