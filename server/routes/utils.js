var express = require('express')
var router = express.Router()
var moment = require('moment')


router.get('/fecha', helpers.isFirmado, getFecha)

function getFecha (req, res) {
  res.json({fecha: moment().format('YYYY-MM-DD')})
})

module.exports = router
