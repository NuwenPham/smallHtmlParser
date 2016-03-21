/**
 * Created by pham on 15.06.15.
 */
var ClassHelper = function () {
};

ClassHelper.inherit = function (proto) {
    var that = this;
    var lBase = function () {
    };
    var lMember, lFn, lSubclass;

    lSubclass = proto && proto.init || proto.constructor ? proto.init || proto.constructor : function () {
        that.apply(this, arguments);
    };

    lBase.prototype = that.prototype;
    lFn = lSubclass.fn = lSubclass.prototype = new lBase();

    for (lMember in proto) {
        if (typeof proto[lMember] === "object" && !(proto[lMember] instanceof Array) && proto[lMember] !== undefined) {
            // Merge object members
            lFn[lMember] = Object.extend(true, {}, lBase.prototype[lMember], proto[lMember]);
        } else {
            lFn[lMember] = proto[lMember];
        }
    }

    for (var method in that) {
        if (that.hasOwnProperty(method) && that[method] instanceof Function) {
            lSubclass[method] = that[method]
        }
    }

    lFn.constructor = lSubclass;
    lSubclass.inherit = that.inherit;

    return lSubclass;
};

var CClass = ClassHelper.inherit({
    "constructor": function () {
        var that = this;

        if (!(that instanceof CClass)) {
            throw new SyntaxError("Didn't call \"new\" operator");
        }

        ClassHelper.call(that);
        that.uncyclic = [];
    },
    "destructor": function () {
        var that = this;
        var lIndex, lKey;

        for (lIndex = 0; lIndex < that.uncyclic.length; ++lIndex) {
            that.uncyclic[lIndex].call();
        }

        for (lKey in that) {
            if (that.hasOwnProperty(lKey)) {
                that[lKey] = undefined;
                delete that[lKey];
            }
        }
    }
});



Object.extend = function () {
    var lTarget = arguments[0] || {};
    var lIndex = 1;
    var lLength = arguments.length;
    var lDeep = false;
    var lOptions, lName, lSrc, lCopy, lCopyIsArray, lClone;

    // Handle a deep copy situation
    if (typeof lTarget === "boolean") {
        lDeep = lTarget;
        lTarget = arguments[1] || {};
        // skip the boolean and the target
        lIndex = 2;
    }

    // Handle case when target is a string or something (possible in deep
    // copy)
    if (typeof lTarget !== "object" && typeof lTarget != "function") {
        lTarget = {};
    }

    if (lLength === lIndex) {
        lTarget = this;
        --lIndex;
    }

    for (; lIndex < lLength; lIndex++) {
        // Only deal with non-null/undefined values
        if ((lOptions = arguments[lIndex]) != undefined) {
            // Extend the base object
            for (lName in lOptions) {
                lSrc = lTarget[lName];
                lCopy = lOptions[lName];

                // Prevent never-ending loop
                if (lTarget === lCopy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (lDeep && lCopy && (Object.isObject(lCopy) || (lCopyIsArray = Array.isArray(lCopy)))) {
                    if (lCopyIsArray) {
                        lCopyIsArray = false;
                        lClone = lSrc && Array.isArray(lSrc) ? lSrc : [];

                    } else {
                        lClone = lSrc && Object.isObject(lSrc) ? lSrc : {};
                    }

                    // Never move original objects, clone them
                    lTarget[lName] = Object.extend(lDeep, lClone, lCopy);

                    // Don't bring in undefined values
                } else {
                    if (lCopy !== undefined) {
                        lTarget[lName] = lCopy;
                    }
                }
            }
        }
    }

    // Return the modified object
    return lTarget;
};

Array.prototype.merge = function(_mergedArr) {
    var a = 0;
    if ( _mergedArr == undefined ) return this;
    while ( a < _mergedArr.length ) {
        this.push(_mergedArr[a]);
        a++;
    }
};

var print_r = function(_object, _options) {
    var lKey, lSpaces = "   ", lSpacesLevel = "", lSpacesPreLevel = "";
    var lDeepnes = "", lType = "", lView = "";

    if ( _options == undefined ) {
        _options = {
            level : 1,
            isStop : false,
            maxLevel : 2,
            isShowDeepnes : false,
            isShowType : true
        }
    } else {
        _options.level++;
    }

    if ( _options.level == _options.maxLevel )
        _options.isStop = true;

    var a = 0;
    while ( a++ < _options.level )
        lSpacesLevel += lSpaces;

    a = 0;
    while ( a++ < _options.level - 1 )
        lSpacesPreLevel += lSpaces;

    if ( _object == undefined ) {
        console.log(lSpacesPreLevel + "{");
        console.log(lSpacesLevel);
        console.log(lSpacesPreLevel + "}");
        _options.isStop = false;
        _options.level--;
        return;
    }

    console.log(lSpacesPreLevel + "{");
    for ( lKey in _object ) {
        if ( typeof _object[lKey] == "object" ) {

            if ( _options.isShowDeepnes )
                lDeepnes = "(deepnes: " + _options.level + ") ";

            if ( _options.isShowType )
                lType = "[" + typeof _object[lKey] + "] ";

            lView = "\"" + lKey + "\" : ";

            if ( _object[lKey] == undefined ) {
                lView += "undefined,";
                console.log(lSpacesLevel + lDeepnes + lType + lView);
            } else {
                console.log(lSpacesLevel + lDeepnes + lType + lView + (_options.isStop ? "{ ... }" : ""));
                if ( !_options.isStop ) {
                    print_r(_object[lKey], _options)
                }

            }
        } else {
            if ( typeof _object[lKey] == "function" ) {
                lType = "";

                if ( _options.isShowType )
                    lType = "[" + typeof _object[lKey] + "] ";

                console.log(lSpacesLevel + lType + lKey + " : function(){ ... }");
            } else {
                lType = "";
                lView = "";

                if ( _options.isShowType )
                    lType = "[" + typeof _object[lKey] + "] ";

                lView = "\"" + lKey + "\" : " + (_object[lKey] ? _object[lKey] : "undefined") + ",";

                console.log(lSpacesLevel + lType + lView);
            }
        }
    }
    console.log(lSpacesPreLevel + "},");
    _options.isStop = false;
    _options.level--;
};


Object.print_s = function(_object, _depthLimit, _params) {
    _depthLimit = _depthLimit === undefined ? 6 : _depthLimit;
    var result = "", padding = "", tab = "   ", val, isArr = Array.isArray(_object), a = 0, params = {
        depth : 0
    }, key;
    Object.extend(params, _params);
    while ( a++ < params.depth ) padding += tab;
    if ( _depthLimit == params.depth ) return !isArr ? "{ ... }" : "[ ... ]";
    result += !isArr ? "{\n" : "[\n";
    params.depth++;
    if ( _object instanceof Object ) {
        for ( key in _object ) {
            if ( _object.hasOwnProperty(key) ) {
                if ( _object[key] instanceof Object ) {
                    if ( Array.isArray(_object) ) {
                        result += padding + tab + Object.print_s(_object[key], _depthLimit, params) + ",\n";
                    } else {
                        result += padding + tab + "\"" + key + "\"" + ": " + Object.print_s(_object[key], _depthLimit, params) + ",\n";
                    }
                } else {
                    var quotes = typeof _object[key] != "number" ? "\"" : "";
                    val = quotes + (_object[key] == undefined ? "" : _object[key]) + quotes;
                    if ( Array.isArray(_object) ) {
                        result += padding + tab + val + ",\n";
                    } else {
                        result += padding + tab + "\"" + key + "\"" + ": " + val + ",\n";
                    }
                }
            }
        }
    }
    if ( result[result.length - 2] == "," ) {
        result = result.substring(0, result.length - 2) + "\n";
    } else {
        result = result.substring(0, result.length - 1);
    }
    result += padding + (!isArr ? "}" : "]");
    return result;
};