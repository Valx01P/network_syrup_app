/**
 * Generates a random code of specified length
 * @param {number} length - Length of the code to generate
 * @returns {string} - A random alphanumeric code
 */
const generateRandomCode = (length = 6) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

export default generateRandomCode