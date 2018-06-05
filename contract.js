"use strict";

var SayContent = function(text, timestamp){
    this.timestamp = timestamp;
    if(text){
        this.content = text;
    }else{
        this.content = "";
    }
};

var SayContentArray = function(text){
    if(text){
        var o = JSON.parse(text);
        this.contents = o.contents;
    }else{
        this.contents = [];
    }
};

SayContentArray.prototype = {
    toString: function(){
        return JSON.stringify(this);
    },
    push: function(content){
        this.contents.push(content);
        return this;
    }
};

var SaySomethingContract = function(){
        LocalContractStorage.defineMapProperty(this, "saying", {
            parse: function (text) {
                console.log('maybe get');
                return new SayContentArray(text);
            },
            stringify: function (o) {
                return o.toString();
            },
        })
};

SaySomethingContract.prototype = {
    init: function(){
    },
    publish: function(text){
        console.log('text: ' +text);
        var from = Blockchain.transaction.from;
        var timestamp = Blockchain.transaction.timestamp;
        console.log('timestamp: ' + timestamp);
        var content = new SayContent(text, timestamp);
        console.log("calling get");
        var contents = this.saying.get(from);
        console.log("get contents " + contents);
        if(!contents){
            contents = new SayContentArray();
        }
        console.log("contents " + contents.toString());
        contents.push(content);
        console.log("after push contents " + contents.toString());
        this.saying.set(from, contents);
    },
    read: function(){
        var from = Blockchain.transaction.from;
        var contents = this.saying.get(from);
        return contents;
    },
};

module.exports = SaySomethingContract;
