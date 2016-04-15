var express = require('express');
var router = express.Router();
var path = require('path');
var Excel = require('exceljs');//只支持xlsx
var XLSX = require('xlsx');//只支持xlsx及xls


router.get('/read', function(req, res) {
    if(req.query.xlsx){
        var xlsxVal = [];
        var workbook = XLSX.readFile(__dirname+"/../public/开发进度表.xlsx");
        //console.log(workbook.Sheets);
        var sheet_name_list = workbook.SheetNames;
        sheet_name_list.forEach(function(y) { /* 遍历表 */
            var worksheet = workbook.Sheets[y];
            var tempA = [];
            for (z in worksheet) {
                /* 忽略以！开头的值 */
                if(z[0] === '!') continue;
                console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
                tempA.push(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
            }
            xlsxVal.push(tempA.join("<br />"));
        });
        res.render('excel_read', {
            "key":"读xls测试",
            "xlsxVal":xlsxVal.join("<br />")
        });

    }else{
        var workbook = new Excel.Workbook();
        var xlsxVal = [];
        console.log(__dirname);
        workbook.xlsx.readFile(__dirname+"/../public/开发进度表.xlsx").then(function(data) {
            //console.log(data);
            data.eachSheet(function(worksheet, sheetId) {
                worksheet.eachRow(function(row, rowNumber){
                    var tempA = [];
                    row.eachCell(function(cell, colNumber) {
                        //console.log(cell.address + ' = ' + cell.value);
                        tempA.push(cell.value);
                    });
                    xlsxVal.push(tempA);
                });
            });
            res.render('excel_read', {
                "key":"读xls测试",
                "xlsxVal":xlsxVal.join("<br />")
            });
        });
    }
});

router.get('/write', function(req, res) {
    var rows = [
        ["a","b","c"],
        [11,22,33],
        [44,55,66]
    ];
    res.render('excel_write', {
        "key":"写xls测试",
        "xlsxVal":rows.join("<br />")
    });
});

router.get('/write/get', function(req, res) {
    if(req.query.xlsx){
        function writeToXLSX(data) {
            var ws_name = "test",wb,ws,wbout;
            wb = new Workbook(), ws = sheet_from_array_of_json(data);
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = ws;

            //XLSX.writeFile(wb, __dirname+"/../public/xlsx_test.xlsx",{bookType:'xlsx', bookSST:true, type: 'binary'});
            wbout = XLSX.write(wb, {
                type: 'base64'
            });

            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");//application/vnd.ms-excel
            res.setHeader("Content-disposition", "attachment;filename=test.xlsx");
            res.send(new Buffer(wbout, 'base64'));
        }

        function Workbook() {
            if(!(this instanceof Workbook)) return new Workbook();
            this.SheetNames = [];
            this.Sheets = {};
        }
        //没用
        function stringToArrayBuffer(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        function sheet_from_array_of_json(data) {
            var ws = {};
            var range = {s: {c:0, r:0}, e: {c:0, r:0 }};
            for(var R = 0; R != data.length; ++R) {
                if(range.e.r < R) range.e.r = R;
                for(var C = 0; C != data[R].length; ++C) {
                    if(range.e.c < C) range.e.c = C;

                    /* create cell object: .v is the actual data */
                    var cell = { v: data[R][C] };
                    if(cell.v == null) continue;

                    /* create the correct cell reference */
                    var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

                    /* determine the cell type */
                    if(typeof cell.v === 'number') cell.t = 'n';
                    else if(typeof cell.v === 'boolean') cell.t = 'b';
                    else cell.t = 's';

                    /* add to structure */
                    ws[cell_ref] = cell;
                }
            }
            ws['!ref'] = XLSX.utils.encode_range(range);
            return ws;
        }
        var rows = [
            ["a","b","c"],
            [11,22,33],
            [44,55,66]
        ];
        writeToXLSX(rows);

    }else{
        var workbook = new Excel.Workbook();
        var sheet = workbook.addWorksheet('My Sheet');
        var stream = new Buffer('');
        var rows = [
            ["a","b","c"],
            [11,22,33],
            [44,55,66]
        ];
        sheet.addRows(rows);
        /*
         workbook.xlsx.writeFile(__dirname+"/../public/开发进度表1.xlsx").then(function(data) {
         console.log(data);
         });
         */
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");//application/vnd.ms-excel
        res.setHeader("Content-disposition", "attachment;filename=report.xlsx");
        workbook.xlsx.write(res).then(function(data){
            res.end();
        });
    }

});

module.exports = router;
