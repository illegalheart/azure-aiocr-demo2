const axios = require('axios');

module.exports = async function (context, req) {
  const imageBuffer = req.body;
  const subscriptionKey = process.env['VISION_KEY'];
  const endpoint = process.env['VISION_ENDPOINT'];

  try {
    const response = await axios.post(
      `${endpoint}/vision/v3.2/ocr?language=ja&detectOrientation=true`,
      imageBuffer,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Content-Type': req.headers['content-type']
        }
      }
    );

    const lines = response.data.regions.flatMap(r => r.lines.map(line =>
      line.words.map(w => w.text).join(' ')
    ));

    context.res = {
      status: 200,
      body: { text: lines.join('\n') }
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: { error: err.message }
    };
  }
};