String.prototype.replaceAll  = function(s1,s2){
    return this.replace(new RegExp(s1,"gm"),s2);   //这里的gm是固定的，g可能表示global，m可能表示multiple。
};

var checkobj = {
    checkInput: function(obj) {
        var result = obj;
        //判断并避免alert
        if (result.indexOf("alert") > -1) {
            objRe = "alert";
            result = result.replaceAll(objRe, "");
        }

        //判断并避免cfm
        if (result.indexOf("cfm") > -1) {
            objRe = "cfm";
            result = result.replaceAll(objRe, "");
        }

        //判断并避免xss
        if (result.indexOf("xss") > -1) {
            objRe = "xss";
            result = result.replaceAll(objRe, "");
        }

        //判断并避免declare
        if (result.indexOf("declare") > -1) {
            objRe = "declare";
            result = result.replaceAll(objRe, "");
        }

        //判断并避免char
        if (result.indexOf("char") > -1) {
            objRe = "char";
            result = result.replaceAll(objRe, "");
        }

        //判断并避免truncate
        if (result.indexOf("truncate") > -1) {
            objRe = "truncate";
            result = result.replaceAll(objRe, "");
        }

        //判断并避免master
        if (result.indexOf("master") > -1) {
            objRe = "master";
            result = result.replaceAll(objRe, "");
        }

        //判断并避免chr
        if (result.indexOf("chr") > -1) {
            objRe = "chr";
            result = result.replaceAll(objRe, "");
        }

        //判断并避免count
        if (result.indexOf("count") > -1) {
            objRe = "count";
            result = result.replaceAll(objRe, "");
        }


        //判断并避免update
        if (result.indexOf("update") > -1) {
            objRe = "update";
            result = result.replaceAll(objRe, "");
        }

        //判断并避免delete
        if (result.indexOf("delete") > -1) {
            objRe = "delete";
            result = result.replaceAll(objRe, "");
        }
        //判断并避免select
        if (result.indexOf("select") > -1) {
            objRe = "select";
            result = result.replaceAll(objRe, "");
        }

        //判断并避免insert
        if (result.indexOf("insert") > -1) {
            objRe = "insert";
            result = result.replaceAll(objRe, "");
        }

        //判断并避免exec
        if (result.indexOf("exec") > -1) {
            objRe = "exec";
            result = result.replaceAll(objRe, "");
        }

        //判断并避免,
        if (result.indexOf(",") > -1) {
            objRe = ",";
            result = result.replaceAll(objRe, "");
        }
        //判断并避免&
        if (result.indexOf("&") > -1) {
            objRe = "&";
            result = result.replaceAll(objRe, "");
        }
        //判断并避免^
        if (result.indexOf("^") > -1) {
            objRe = "^";
            result = result.replaceAll('^', "");
        }
        //判断并避免+
        if (result.indexOf("+") > -1) {
            objRe = "+";
            result = result.replaceAll("+", "");
        }
        //判断并避免#
        if (result.indexOf("#") > -1) {
            objRe = "#";
            result = result.replaceAll(objRe, "");
        }
        //判断并避免$
        if (result.indexOf("$") > -1) {
            result = result.replace("$", "");
        }
        //判断并避免-
        if (result.indexOf("-") > -1) {
            objRe = /-/g;
            result = result.replaceAll(objRe, "");
        }
        //判断并避免%
        if (result.indexOf("%") > -1) {
            objRe = "%";
            result = result.replaceAll(objRe, "");
        }
        //判断并避免!
        if (result.indexOf("!") > -1) {
            objRe = "!";
            result = result.replaceAll(objRe, "");
        }
        //判断并避免?
        if (result.indexOf("?") > -1) {
            result = result.replace("?", "");
        }
        //判断并避免*
        if (result.indexOf("*") > -1) {
            result = result.replace("*", "");
        }
        //判断并避免(
        if (result.indexOf("(") > -1) {
            result = result.replace("(", "");
        }
        //判断并避免)
        if (result.indexOf(")") > -1) {
            result = result.replace(")", "");
        }
        //判断并避免|
        if (result.indexOf("|") > -1) {
            result = result.replace("|", "");
        }

        //判断并避免\
        if (result.indexOf("\\") > -1) {
            result = result.replace("\\", "");
        }
        return result;
    }
};
module.exports = checkobj;