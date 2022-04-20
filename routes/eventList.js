const express = require('express');
const router = express.Router();
const data = require('../data');

router.post('/' ,async (req,res) => {
    res.render('eventList', {title: "Event List Page"});
    try{
        if(eventList){
            res.status(200).json({status: "success"});
        } else{
            res.status(404).json({status: "failure"});
        }
    } catch(e){
        res.status(500).render('eventList', {error_flag: true, error: e})
    }
});

module.exports = router;