﻿; (function (win) {
    var initializing=!1,fnTest=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/,__class=function(){};__class.extend=function(n){__class.export=n;function i(){!initializing&&this.ctor&&this.ctor.apply(this,arguments)}var f=this.prototype,u,r,t;initializing=!0,u=new this,initializing=!1;for(t in n)t!="statics"&&(u[t]=typeof n[t]=="function"&&typeof f[t]=="function"&&fnTest.test(n[t])?function(n,t){return function(){var r=this._super,i;return this._super=f[n],i=t.apply(this,arguments),this._super=r,i}}(t,n[t]):n[t]);for(r in this)this.hasOwnProperty(r)&&r!="extend"&&(i[r]=this[r]);if(i.prototype=u,n.statics)for(t in n.statics)n.statics.hasOwnProperty(t)&&(i[t]=n.statics[t],t=="ctor"&&i[t]());return i.prototype.constructor=i,i.extend=arguments.callee,i.implement=function(n){for(var t in n)u[t]=n[t]},i};

    var Observable = __class.extend({
        "statics": {
            "ctor": function () {
                this.methods = ["concat", "every", "filter", "forEach", "indexOf", "join", "lastIndexOf", "map", "pop", "push", "reduce", "reduceRight", "reverse", "shift", "slice", "some", "sort", "splice", "unshift", "valueOf"],
                this.triggerStr = ["concat", "pop", "push", "reverse", "shift", "sort", "splice", "unshift"].join(",");
            },
            "type": function (obj) {
                var typeStr = Object.prototype.toString.call(obj).split(" ")[1];
                return typeStr.substr(0, typeStr.length - 1).toLowerCase();
            },
            "isArray": function (obj) {
                return this.type(obj) == "array";
            },
            "isFunction": function (obj) {
                return this.type(obj) == "function";
            }
        },
        "ctor": function () {
            this.observe();
        },
        "observe": function () {
            for (var prop in this) {
                if (this.hasOwnProperty(prop) && prop != "_super") {
                    this.watch(this, prop);
                }
            }
        },
        "change": function (fn) {
            this.propertyChangedHandler = fn;
        },
        "onPropertyChanged": function (prop, value) {
            this.propertyChangedHandler && this.propertyChangedHandler(prop, value);
        },
        "watch": function (target, prop) {
            if (prop.substr(0, 2) == "__") return;
            var self = this;
            if (Observable.isArray(target) && Observable.isFunction(target[prop])) return;
            var currentValue = target["__" + prop] = target[prop];
            Object.defineProperty(target, prop, {
                get: function () {
                    return this["__" + prop];
                },
                set: function (value) {
                    this["__" + prop] = value;
                    self.onPropertyChanged(prop, value);
                }
            });
            if (typeof currentValue == "object") {
                if (Observable.isArray(currentValue)) {
                    Observable.methods.forEach(function (item) {
                        currentValue[item] = function () {
                            var result = Array.prototype[item].apply(this, Array.prototype.slice.call(arguments));
                            for (var cprop in this) {
                                if (this.hasOwnProperty(cprop) && cprop != "_super" && !Observable.isFunction(this[cprop])) {
                                    self.watch(this, cprop);
                                }
                            }
                            if (new RegExp("\\b" + item + "\\b").test(Observable.triggerStr)) {
                                self.onPropertyChanged("array", item);
                            }
                            return result;
                        };
                    });
                }
                for (var cprop in currentValue) {
                    if (currentValue.hasOwnProperty(cprop) && cprop != "_super") {
                        this.watch(currentValue, cprop);
                    }
                }
            }
        }
    });

    if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = Observable }
    else if (typeof define === 'function' && define.amd) { define(Observable) }
    //export to kmd project，以后大家写模块的时候多加下面这几行代码，当耐特在这里谢谢大家了
    else if (typeof define === 'function' && define.kmd) {
        define("Observable", __class.export);
        //you can also add any namespace to Observable such as blow code:
        //define("Util.Observable", __class.export);
    }
    else { win.Observable = Observable };

})(Function('return this')());