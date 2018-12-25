var express = require('express');
var router = express.Router();

var EE = require("events").EventEmitter;

function MyObject() {
    EE.call(this);

    var myProperty = "";

    Object.defineProperty(this, "myproperty", {
        get: function() {
            return myProperty;
        },
        set: function(newValue) {
            myProperty = newValue;
            this.emit("change:myproperty", myProperty);
            return myProperty;
        }.bind(this)
    });
}

// setup prototype
MyObject.prototype = EE.prototype;
MyObject.prototype.constructor = MyObject;
var obj = new MyObject();

/* GET users listing. */
router.get('/', function(req, res, next) {

    var isEnd = false;
    res.write(obj.myproperty);
// listen for changes
    const evt = obj.on("change:myproperty", function(myproperty) {
        if (!isEnd) {
            res.write("|"+myproperty);
        }
    });

    setTimeout(() => {
        delete evt;
        isEnd = true;
        res.end();
    }, 50000);

// change the property
//     let i = 0;
//     const interval = setInterval(() => {
//         res.write(i + "|");
//         i++;
//         if (i === 10) {
//             clearInterval(interval);
//             res.end();
//         }
//     }, 1000);
});

router.post('/', async(req, res, next) => {
    const {text} = req.body;
    obj.myproperty = text || "";

    res.json([]);
});

module.exports = router;
