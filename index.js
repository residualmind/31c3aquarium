/*jshint multistr: true */
var nc = require('ncurses'),
    win = new nc.Window();

// helpers 
function rnd(max) {
    return Math.random() * max;
}

function rndint(max) {
    return (Math.floor(Math.random() * max));
}

function choice(a) {
    return a[rndint(a.length)];
}

var fishes = [
    '><>',
    ')()'
];


var Aquarium = {
    bubbles: [],
    blubbPos: [],
    corals: [],
    current: 0,

    init: function () {


        // init bubble starting positions 
        for (var i = 0; i < 6; i += 1) {
            this.blubbPos.push(rndint(80));
        }

        // init bubbles
        for (i = 0; i < 90; i += 1) {
            char = choice("oO.");
            speed = 1 + rnd(2);
            this.bubbles.push({
                age: rndint(1000),
                x: rnd(80),
                y: rnd(24),
                char: char,
                speed: speed
            });
        }

        // init corals
        for (i = 0; i < 20; i++) {
            this.corals.push({
                age: rndint(1000),
                x: rndint(80), // position
                len: 2 + Math.pow(rnd(2), 2.2), //length (height)
                w: rnd(3), //width
                char: choice("%:&.")

            });
        }

        setInterval(this.frameHandler, 100);
    },

    frameHandler: function () {
        put(0, 0, ''); // move cursor somewhere 
        win.refresh();

        var x, y;

        // refresh everything
        for (x = 0; x <= 80; x++)
            for (y = 13; y <= 24; y++)
                restore(x, y);


        for (var i = 0; i < Aquarium.corals.length; i++) {
            var coral = Aquarium.corals[i];
            var coralX = coral.x;
            var coralY = 24;
            coral.age++;


            for (var l = 0; l < coral.len; l++) {
                y = coralY - l;
                x = coralX + Math.cos(coral.age / 2 + l) / 2 * Math.min(l, 4);
                restore(x, y);
                var w = (coral.len - l) / 10 * coral.w;
                for (var xpos = x - w; xpos <= x + w; xpos++) {
                    put(xpos, y, coral.char);
                }
            }
        }

        for (i = 0; i < Aquarium.bubbles.length; i++) {
            var bub = Aquarium.bubbles[i];
            restore(bub.x, bub.y);
            bub.y -= bub.speed / 3;
            bub.age++;
            bub.x += Math.cos(bub.age / 1) * speed / 3;
            if (bub.y < 0) {
                bub.y = 30 + rndint(200);
                if (rndint(5) === 0) {
                    bub.x = rndint(80);
                } else {
                    bub.x = choice(Aquarium.blubbPos);
                }
            }
            put(bub.x, bub.y, bub.char);
        }
    }

};




function put(x, y, str, color) {
    if (x >= 0 && y >= 0 && x <= 80 && y <= 24) {
        win.addstr(~~y, ~~x, str);
    }
}

function restore(x, y, str) {
    win.addstr(~~y, ~~x, ' ');
}

Aquarium.init();
