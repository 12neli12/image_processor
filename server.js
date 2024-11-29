const express = require('express')
const { processImg } = require('./worker-management')
const rateLimit = require('express-rate-limit')

const app = express()
app.use(express.json())

// Allows no more than 100 calls per 15 min
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, 
});

app.use(limiter);
let progress = { total: 0, completed: 0, errors: 0}

// Progress over time
app.get('/progress', (req, res) => {
  res.json(progress)
})

// Image processing
app.post('/process-images', async (req, res) => {
  const { imgUrls } = req.body

  if(!Array.isArray(imgUrls)) {
    return res.status(400).json({ error: 'imgUrls is not an array'})
  }

  try {
    progress = { total: imgUrls.length, completed: 0, errors: 0}

    const results = await processImg(imgUrls, progress)
    res.json({
      success: true,
      message: 'Image processing started ...',
      results
    })
  } catch(error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process images.'
  })
  }
})

app.listen(4000, ()=> {
  console.log('Server running: http://localhost:4000')
})