import { Traducir } from '../Controller/traduccion';
const express = require('express');
const router = express.Router({ mergeParams: true });

router.route('/').post(Traducir);
module.exports = router;