var express = require('express');
var router = express.Router();
var path = require('path');
var Excel = require('exceljs');


router.get('/', function(req, res) {
    var workbook = new Excel.Workbook();
    console.log(__dirname);
    workbook.xlsx.readFile(__dirname+"/../public/开发进度表.xlsx")
        .then(function(data) {
            console.log(data);
            data.eachSheet(function(worksheet, sheetId) {
                console.log(worksheet);
            })
        });
    res.render('excel_test', {
        "key":"12345"
    });
});

module.exports = router;
