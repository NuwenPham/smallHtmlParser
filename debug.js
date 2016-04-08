window.onload = function() {

    var rx = /(  +|\n)/;
    var rx2 = /(")/;

    window.single_tags = ["meta","br", "img", "options", "input", "!DOCTYPE"];

    var tests = [];
    tests[0] = "<!DOCTYPE html><div class=\"lol\"     id='gg'   ><!--asda<div>\n</div>sd--><br>sdfsdf<div class=\"sdfsf lol\">AAAAAAAAAA</div></div>";
    tests[1] = "<!DOCTYPE html><html><head lang=\"en\"><meta charset=\"UTF-8\"><title></title><script src=\"Base.js\"></script><script src=\"test.js\"></script><script src=\"debug.js\"></script></head><body style=\"background: #555; color:#fff\"></body></html>";
    tests[2] = "<!DOCTYPE html><html><head lang=\"en\"><meta charset=\"UTF-8\"><title></title><script src=\"Base.js\"></script><script src=\"graph/graph.js\"></script><script class='LOL'>function(){var lol = '<div></div>'}</script><script src=\"debug.js\"></script></head><body style=\"background: #555; color:#fff\"><div id=\"fps_output\">fps: 0</div><canvas id=\"container\"></canvas><br><input type=\"button\" value=\"quadrants\" onclick=\"showQuad()\"><input type=\"button\" value=\"COMS\" onclick=\"showCOMS()\"><input type=\"button\" value=\"Vectors\" onclick=\"showVectors()\"></body></html>" ;
    //tests[3] = "<div> asdasd </div>";
    tests[3] = "<script>var a = \"<div></div></div></div>\";var b =          '</script>';        var ddd = /sd/;  var ddsd = /sds12d/;</script><div> </div>";
    tests[4] = "<div>211111 </a>asdfasdf</div>";

    var testHtml = tests[2];


    var dtree = window.dtree = new DTree();
    dtree.build(testHtml);
};


var DTree = CClass.inherit({
    "constructor" : function ( _params ) {
        this.options = {};
        CClass.fn.constructor.call(this);
        this.rootNode = new DNode();
        this.nodeCollection = [];

    },
    "destructor" : function () {
        CClass.fn.destructor.call(this);
    },
    "analyseScript":function(_string, _posStart) {
        var parser = new DParser(), result;
        var rx = /(\/|'|"|<)/;
        var pos = _posStart;
        var indexes = _posStart;
        var string = _string.substring(_posStart, _string.length);
        while ( true ) {
            var match = string.match(rx);
            indexes += match.index;
            if ( match[1] !== "<" ) {
                result = parser.searchBracket(string, match[1], match.index);
                console.log(result.match);
                pos = result.end + 1;
                indexes += (result.end - result.start + 1);

            } else {
                break;
            }
            string = string.substring(pos, string.length);
        }
        return {
            start : _posStart,
            end : indexes
        }
    },
    "build":function(_string){
        var parser = new DParser();
        var result, pos = 0, prevNodeStartPos = 0, prevNodeLength = 0, blockValueNode, prevNodeEnd;
        var path = [this.rootNode];
        while(result = parser.searchBody(_string, "<", ">", pos)){
            if(result.success) {
                pos = result.end;
                var tagContent = parser.parseHTMLTag(result.body);
                if ( tagContent.status == "open" || tagContent.status == "single" ) { // Статус открыт или единственный
                    var node = new DNode({
                        tag : tagContent.name, // имя нода
                        attrs : tagContent.attrs // аттрибуты нода
                    });
                    if ( result.start != (prevNodeStartPos + prevNodeLength) ) { //
                        blockValueNode = new DNode({
                            tag : "block.value",
                            content : _string.substring(result.start, (prevNodeStartPos + prevNodeLength))
                        });
                        path[path.length - 1].addChild(blockValueNode);
                        this.nodeCollection.push(blockValueNode);
                    }
                    this.nodeCollection.push(node);
                    path[path.length - 1].addChild(node);
                    path.push(node);
                } else if ( tagContent.status == "close" ) {

                    if(path[path.length - 1].tag !== tagContent.name.substring(1, tagContent.name.length) && path[path.length - 1].tag !== "root"){
                        throw new Error("Позвольте, ошибочка вышла. Так делать-то, ай как мерзко!");
                    }

                    // проверочку надо сделать
                    if ( result.start != prevNodeEnd ) {
                        blockValueNode = new DNode({
                            tag : "block.value",
                            content : _string.substring(prevNodeEnd, result.start)
                        });
                        path[path.length - 1].addChild(blockValueNode);
                        this.nodeCollection.push(blockValueNode);
                    }
                    path.pop();
                } else if ( tagContent.status == "comment" ) {
                    var comment = new DNode({
                        tag : tagContent.name,
                        content : tagContent.value
                    });
                    this.nodeCollection.push(comment);
                    path[path.length - 1].addChild(comment);
                }

                if ( tagContent.status == "single" ) {
                    path.pop();
                }

                if ( tagContent.name == "script" ) { //  тег есть скрипт
                    var res = this.analyseScript(_string, result.end);
                    prevNodeStartPos = res.start;
                    prevNodeLength = res.end - res.start;
                    prevNodeEnd = result.end;
                    pos = res.end;
                    console.log(tagContent);
                    continue;
                }

                prevNodeStartPos = result.start;
                prevNodeLength = result.end - result.start;
                prevNodeEnd = result.end;
                pos = result.end;

                console.log(tagContent);
            }
        }
    },
    "select": function(_query) {
        // Пустой результат
        if ( _query == "" || !_query ) return [];

        var recursive = function ( _node, _hops, _hopOffset ) {
            var hop = _hops[_hopOffset];
            var hopType = "node";
            switch(hop[0]) {
                case "#":
                    hopType = "id";
                    break;
                case ".":
                    hopType = "class";
                    break;
            }

            if ( _node.childs > 0 ) {
                var a = 0;
                while ( a < _node.childs ) {

                    a++;
                }
            }
        };

        var hops = _query.split(" ");
        var res = recursive(this.rootNode, hops, 0);
    },

    "getElement": function(_selector) {
        var result = [],b = 0;
        var selectorType = "node";
        var value = _selector;
        switch (_selector[0]) {
            case "#":
                selectorType = "id";
                value = _selector.substring(1, _selector.length);
                break;
            case ".":
                selectorType = "class";
                value = _selector.substring(1, _selector.length);
                break;
        }

        var a = 0;
        while(a < this.nodeCollection.length){
            var node = this.nodeCollection[a];

            switch (selectorType) {
                case "node":
                    if(node.tag == value){
                        result.push(this.nodeCollection[a]);
                        break;
                    }
                    break;
                case "id":
                    var id = node.getAttr("class");
                    if( id ){
                        var ids = id.split(" ");
                        if(ids[0] == value){
                            result.push(this.nodeCollection[a]);
                            break;
                        }
                    }
                    break;
                case "class":
                    var cls = node.getAttr("class");
                    if( cls ){
                        var clss = cls.split(" ");
                        b = 0;
                        while(b < clss.length ){
                            if(clss[b] == value){
                                result.push(this.nodeCollection[a]);
                                break;
                            }
                            b++;
                        }
                    }
                    break;
            }
            a++;
        }
        return result;
    }

});

var DNode = CClass.inherit({
    "constructor" : function ( _params ) {
        var base = {
            tag : "root",
            content : null,
            attrs : ""
        };
        CClass.fn.constructor.call(this);
        Object.extend(base, _params);
        this.childs = [];
        this.content = base.content;
        this.tag = base.tag;
        this.attrs = base.attrs;
    },
    "destructor" : function () {
        CClass.fn.destructor.call(this);
    },
    "addChild" : function ( _node ) {
        this.childs.push(_node);
    },
    "getAttr":function(_attr){
        var a = 0;
        while(a < this.attrs.length) {
            if ( this.attrs[a].name == _attr ) {
                return this.attrs[a].body
            }
            a++;
        }
    }
});

var DParser = CClass.inherit({
    "constructor" : function () {
        CClass.fn.constructor.call(this);
        this.notClosedSingleTagList = single_tags;
    },
    "destructor" : function () {

    },
    "parseHTMLTag":function(_tag) {
        var match, tag = _tag, attrs = [];
        // пример цели поиска: lol="" -> lol
        var tagName = _tag.match(/(?:| +?)([^ .]+) */i);

        var tagStatus = "open";
        if ( _tag[0] == "/" ) {
            _tag = _tag.substring(1, _tag.length);
            tagStatus = "close";
        } else if ( _tag[_tag.length - 1] == "/" ) {
            _tag = _tag.substring(0, _tag.length-1);
            tagStatus = "single";
        } else {
            var a = 0;
            while ( a < this.notClosedSingleTagList.length ) {
                if ( tagName[1] == this.notClosedSingleTagList[a] ) {
                    tagStatus = "single";
                    break;
                }
                a++;
            }
        }

        if(_tag.substring(0, 3) == "!--" && _tag.substring(_tag.length - 2, _tag.length) == "--") {
            return {
                name : "comment",
                attrs : attrs,
                status : "comment",
                value : _tag.substring(3, _tag.length - 2)
            }
        }

        // пример цели поиска: lol="sdfdf" -> lol="
        var old_rx = /( +?|)([^ .]+?)\1=\1("|')|\1/;
        var rx = / *?([^ ^=.]+) *?(?:= *?("|')|)/i;

        while ( match = tag.match(rx) ) {
            // Получаем место откуда надо начинать поиск
            var lastPos = match.index + match[0].length - 1;
            var attrName = match[1];
            var bracketType = match[2];

            if ( bracketType != undefined ) {
                // У аттрибута есть тело
                var attrContent = this.searchBracket(tag, bracketType, lastPos);
                tag = tag.substring(attrContent.end+1, tag.length);
            } else {
                // У аттрибута нет тела
                var res = tag.match(attrName, "i"); // находим где начинается вхождение в аттрибут
                tag = tag.substring(res.index + attrName.length, tag.length);
            }
            attrs.push({
                name : attrName,
                body : (attrContent && attrContent.body) || ""
            });
        }
        // Отрезаем первый аттрибут т.к. это название тега
        if( attrs.length > 0 ){
            attrs.shift();
        }
        return {
            name : tagName[1],
            attrs : attrs,
            status: tagStatus
        }
    },
    /**
     * Искать все что находится между двумя символами указанными при запуске функции
     * @returns {*}
     */
    "searchBody" : function ( _text, _startSymbol, _finishSymbol, startPos ) {
        var entryLevel = 0, a = 0|| startPos, start = 0, end, foundedStartBrackett = false, result = "";
        while ( a < _text.length ) {
            var symbol = _text[a];
            if ( symbol == _startSymbol && !foundedStartBrackett ) {
                foundedStartBrackett = true;
                start = a;
            }
            if ( symbol == _startSymbol && foundedStartBrackett ) {
                entryLevel++;
            } else if ( symbol == _finishSymbol && foundedStartBrackett ) {
                entryLevel--;
            }
            if(foundedStartBrackett){
                result += _text[a];
            }
            a++;
            if ( entryLevel == 0 && foundedStartBrackett ) {
                break;
            }
        }
        if(!foundedStartBrackett) {
            return;
        }
        if ( entryLevel > 0 ) {
            return {
                success : false,
                error : "not found end bracket"
            }
        }
        end = a;
        return {
            success : true,
            start : start,
            end : end,
            match : result,
            body : result.substring(1, result.length - 1)
        }
    },
    /**
     * Искать все что находится между двумя символами указанными при запуске функции
     * @returns {*}
     */
    "searchBracket" : function ( _text, _bracketSymbol, startPos ) {
        var a = 0|| startPos, start = 0, end, foundedStartBrackett = false, result = "";
        while ( a < _text.length ) {
            var symbol = _text[a];
            if ( symbol == _bracketSymbol && foundedStartBrackett ) {
                result += _text[a];
                break
            }
            if ( symbol == _bracketSymbol && !foundedStartBrackett ) {
                foundedStartBrackett = true;
                start = a;
            }
            if(foundedStartBrackett){
                result += _text[a];
            }
            a++;
        }
        if(!foundedStartBrackett) {
            return;
        }
        end = a;
        return {
            success : true,
            start : start,
            end : end,
            match : result,
            body : result.substring(1, result.length - 1)
        }
    }
});