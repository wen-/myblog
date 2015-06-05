var html2jade = require('html2jade');
var html = '<div class="input-group">      <input type="text" class="form-control" placeholder="Search for...">      <span class="input-group-btn">        <button class="btn btn-default" type="button">Go!</button>      </span>    </div>';
html2jade.convertHtml(html, {'tabs':true}, function (err, jade) {
    console.log(jade);
});
