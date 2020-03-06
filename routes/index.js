const express = require('express');
const app = express();

var router = express.Router();


router.use(require('./login'))

router.use(require('./usuario'))

router.use(require('./upload'))

app.use('/', router)

module.exports = app