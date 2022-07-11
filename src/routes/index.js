const getDataController = require('../controllers/getDataController')
const express = require('express');
const router = express.Router();
router.get('/', getDataController.getListData);
router.get('/:character', getDataController.getItem);
function route(app){
    app.use('/api/v1', router)
}
module.exports = route;