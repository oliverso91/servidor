import { Index } from '../Controller/Index';
const express = require('express');
const router = express.Router({ mergeParams: true });

router.route('/').get(Index);
module.exports = router;