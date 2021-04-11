require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express');
const app = express()
app.set('json spaces', 1);
app.use('/public', express.static('public'))
app.use(bodyParser.json());

app.get('/arc-sw.js', function (req, res) {
	res.sendFile('/arc-sw.js', {root: './routes'})
});

app.listen(3000)
console.log('Server is now ready on port: 3000')