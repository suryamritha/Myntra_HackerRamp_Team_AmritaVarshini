const getColors = require('get-image-colors');
const colorTheory = require('./colorTheory');

async function analyzeImage(imageBuffer) {
  try {
    const colors = await getColors(imageBuffer, 'image/jpeg');
    const colorPalette = colors.map(color => color.hex());

    // Use color theory algorithm to suggest more colors
    const suggestedColors = colorTheory.suggestColors(colorPalette);

    return {
      dominantColors: colorPalette,
      suggestedColors: suggestedColors
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Error analyzing image');
  }
}

module.exports = { analyzeImage };
