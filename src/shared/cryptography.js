import { USER_TOKEN_SECRET } from '../config'
import CryptoJS from 'crypto-js'

class Cryptography {
  static encrypt(value) {
    switch (typeof value) {
      case 'object':
        return CryptoJS.AES.encrypt(
          JSON.stringify(value),
          USER_TOKEN_SECRET
        ).toString()

      default:
        return CryptoJS.AES.encrypt(value, USER_TOKEN_SECRET).toString()
    }
  }

  static decrypt(value) {
    const textValue = CryptoJS.AES.decrypt(value, USER_TOKEN_SECRET).toString(
      CryptoJS.enc.Utf8
    )
    if (textValue.startsWith('[') || textValue.startsWith('{')) {
      return JSON.parse(textValue)
    }
    return textValue
  }

  static randomPassword(
    length = 14,
    characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  ) {
    return Array.from(window.crypto.getRandomValues(new Uint32Array(length)))
      .map((x) => characters[x % characters.length])
      .join('')
  }
}

export default Cryptography

export { Cryptography }
