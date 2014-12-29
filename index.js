/*jshint multistr: true */
var nc = require('ncurses'),
    win = new nc.Window(),
    fs = require('fs');

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
var fishTypes = [],
    winWidth = 90,
    winHeight = 30;

var Aquarium = {

    bubbles: [],
    blubbPos: [],
    corals: [],
    current: 0,
    fishes: [],


    init: function () {

        fs.readFile('fishes', 'utf8', function (err, data) {
            var lines = data.split('\n');
            var tmp = [];
            var fishIndex = 0;
            var frame = 0;
            var left = [];
            var right = [];
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (line[0] !== '#') {
                    tmp.push(line);
                    if (line.length === 0) {
                        if (frame === 0) {
                            left = tmp.concat();
                            frame++;
                            console.log(tmp);
                            console.log(left);
                            tmp = [];
                        } else {
                            right = tmp.concat();
                            frame = 0;
                            fishTypes.push([left, right]);
                            tmp = [];
                        }
                    }
                }
            }
        });



        // init bubble starting positions 
        for (var i = 0; i < 6; i += 1) {
            this.blubbPos.push(rndint(winWidth));
        }

        // init bubbles
        for (i = 0; i < winWidth + 10; i += 1) {
            char = choice("oO.");
            speed = 1 + rnd(2);
            this.bubbles.push({
                age: rndint(1000),
                x: rnd(winWidth),
                y: rnd(winHeight),
                char: char,
                speed: speed
            });
        }

        // init corals
        for (i = 0; i < 20; i++) {
            this.corals.push({
                age: rndint(1000),
                x: rndint(winWidth), // position
                len: 2 + Math.pow(rnd(2), 2.2), //length (height)
                w: rnd(3), //width
                char: choice("%:&.")

            });
        }

        setInterval(this.frameHandler, 200);
    },

    frameHandler: function () {
        put(0, 0, ''); // move cursor somewhere 
        win.refresh();

        var x, y;

        // refresh everything
        for (x = 0; x <= winWidth; x++)
            for (y = 0; y <= winHeight; y++)
                restore(x, y);

        // fishieeeeessss
        if (Aquarium.fishes.length < 6) {
            Aquarium.fishes.push({
                x: rndint(2)?-10:winWidth+5,
                y: rnd(winHeight),
                str: choice(fishTypes),
                vx: rnd(2) - 1
            });
        }
        for (i = Aquarium.fishes.length - 1; i >= 0; i--) {
            var fish = Aquarium.fishes[i];
            fish.x += fish.vx;
            if (fish.x > winWidth + 10 || fish.x < -20) {
                Aquarium.fishes.splice(i, 1);
                break;
            }
            if (rndint(50) === 0) fish.vx *= -1;
            for (var k = 0; k < fish.str[0].length; k++) {
                var str = fish.str[fish.vx > 0 ? 0 : 1][k];
                var width = str.length;
                for (var j = 0; j < width; j++) {
                    x = fish.x + j;
                    put(x, k + fish.y, str[j]);
                }
            }
        }


        for (var i = 0; i < Aquarium.corals.length; i++) {
            var coral = Aquarium.corals[i];
            var coralX = coral.x;
            var coralY = winHeight;
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
                    bub.x = rndint(winWidth);
                } else {
                    bub.x = choice(Aquarium.blubbPos);
                }
            }
            put(bub.x, bub.y, bub.char);
        }


    }

};




function put(x, y, str, color) {
    if (x >= 0 && y >= 0 && x <= winWidth && y <= winHeight) {
        // win.chgat(y, x, 1, win.attrs.NORMAL);
        win.addstr(~~y, ~~x, str);
    }
}

function restore(x, y, str) {
    win.addstr(~~y, ~~x, ' ');
}

Aquarium.init();
