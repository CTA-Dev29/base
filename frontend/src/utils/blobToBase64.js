// Konversi buffer (Uint8Array) ke base64 string image
const bufferToBase64 = (buffer) => {
  const binary = new Uint8Array(buffer).reduce(
    (acc, byte) => acc + String.fromCharCode(byte),
    ''
  )
  return `data:image/png;base64,${btoa(binary)}`
}

export default bufferToBase64
