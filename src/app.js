// const express = require('express');
// const app = express();
// app.get('/', (req, res) => res.send('Hello World!'));
// app.listen(3000, () => console.log('Server running on port 3000'));
// module.exports = app;
// // Added Commented

const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

// Only start server if run directly (not imported)
if (require.main === module) {
  const server = app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}

module.exports = app; // Export app for testing