const express = require('express');
const router = express.Router();
const data = require('../data');

// Router configuration

router.get('/' ,async (req,res) => {
    res.render('posts/landingPage', {title: "Hey! Welcome"});
});

module.exports = router;