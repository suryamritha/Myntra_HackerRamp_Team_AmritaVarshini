const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeImage } = require('./imageAnalyzer');

const app = express();
const port = 3000;

// Serve static files (index.html, etc.)
app.use(express.static(path.join(__dirname)));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Endpoint to handle image uploads and return analysis results
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imageBuffer = fs.readFileSync(req.file.path);
    const { dominantColors, suggestedColors } = await analyzeImage(imageBuffer);
    const imageURL = `/uploads/${req.file.filename}`;
    const clothes = getSuggestedClothes(suggestedColors);
    res.json({ dominantColors, suggestedColors, clothes, imageURL });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image');
  }
});

// Example function to get suggested clothes (to be customized)
function getSuggestedClothes(colors) {
  return [
    { name: 'Trendy Shirt', image: 'https://via.placeholder.com/150' },
    { name: 'Stylish Dress', image: 'https://via.placeholder.com/150' },
    { name: 'Cool Jacket', image: 'https://via.placeholder.com/150' }
  ];
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
