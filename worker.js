const { parentPort } = require('worker_threads')
const sharp = require('sharp')
const axios = require('axios')
const path  = require('path')

parentPort.on('message', async ({ url, outDir}) => {
  console.log(`Worker started for URL: ${url}`)
  try {
    // Downloads images
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imgBuffer = Buffer.from(response.data)

    // Transforms images using sharp
    const transformedImgPath = path.join(outDir, `${(Math.random().toString(36).split('.')[1])}.png`)
    await sharp(imgBuffer)
      .grayscale()
      .resize(500)
      .toFile(transformedImgPath)

    parentPort.postMessage({ success: true})
  } catch(error) {
    parentPort.postMessage({ success: false, error: error.message})
  }
})