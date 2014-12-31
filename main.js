/**
 *     _    ____ _  ____        ___    _   _ ______   ___   _ __  __
 *    / \  / ___| |/ /\ \      / / \  | | | |  _ \ \ / / | | |  \/  |
 *   / _ \| |   | ' /  \ \ /\ / / _ \ | |_| | |_) \ V /| | | | |\/| |
 *  / ___ \ |___| . \   \ V  V / ___ \|  _  |  _ < | | | |_| | |  | |
 * /_/   \_\____|_|\_\   \_/\_/_/   \_\_| |_|_| \_\|_|  \___/|_|  |_|
 *
 */

var nc = require('ncurses'),
    win = new nc.Window(),
    fs = require('fs');
var keypress = require('keypress');


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
    winWidth = win.width,
    winHeight = win.height,
    size = winWidth * winHeight,
    fishNum = winWidth / 15;

var Aquarium = {
    // blubb
    age: 0,
    bubbles: [],
    blubbPos: [],
    corals: [],
    current: 0,
    fishes: [],


    init: function (Aquarium) {

        if ('blubb' !== 'blubb') throw ('error: sumtimwong (fishy)');

        win.leaveok(true);
        win.scrollok(false);
        nc.showCursor = false;
        win.attrset(nc.colorPair(1));

        win.on('inputChar', function () {
            nc.cleanup();
            process.exit(0);
        });

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
        for (i = 0; i < size / 100; i += 1) {
            char = choice("oO.");
            speed = 1 + rnd(2);
            this.bubbles.push({
                age: rndint(1000),
                x: rnd(winWidth),
                y: -1,
                char: char,
                speed: speed
            });
        }

        // init corals
        for (i = 0; i < winWidth / 3; i++) {
            this.corals.push({
                age: rndint(1000),
                x: rndint(winWidth), // position
                len: 2 + Math.pow(rnd(2), 2.2), //length (height)
                w: rnd(3), //width
                char: choice("%:&.")

            });
        }

        setInterval(this.frameHandler, 100);

    },

    frameHandler: function () {
        var x, y;
        var sharkAttack = false;

        Aquarium.age += 1;
        win.erase();
        // win.frame();

        // fishieeeeessss
        if (Aquarium.fishes.length < fishNum && rndint(4) === 0) {
            var type = rndint(fishTypes.length - 1);
            if (rndint(8) === 0 && (Aquarium.age % 200) > 100) type = 4;
            Aquarium.fishes.push({
                x: rndint(2) ? -35 : winWidth + 5,
                y: rnd(winHeight - 9),
                type: type,
                str: fishTypes[type],
                vx: rndint(2) ? 0.5 + rnd(2) : -0.5 - rnd(2),
            });
        }

        var fish;
        for (i = Aquarium.fishes.length - 1; i > 0; i--) {
            fish = Aquarium.fishes[i];
            if (fish.type === 4) {
                if (fish.x > -20 || fish.x < winWidth - 20) {
                    sharkAttack = true;
                }
            }
        }

        for (i = Aquarium.fishes.length - 1; i > 0; i--) {
            fish = Aquarium.fishes[i];
            if (sharkAttack && fish.type !== 4) {
                fish.vx = (fish.x < winWidth / 2 ? -4 : 4) * 1 + rnd(0.3);
            }
            fish.x += fish.vx;
            if (fish.x > winWidth + 10 || fish.x < -40) {
                Aquarium.fishes.splice(i, 1);
            } else {
                if (rndint(100) === 0 && fish.type != 4) fish.vx *= -1;

                for (var k = 0; k < fish.str[0].length; k++) {
                    var str = fish.str[fish.vx > 0 ? 0 : 1][k];
                    var width = str.length;
                    for (var j = 0; j < width; j++) {
                        x = fish.x + j;
                        put(x, k + fish.y, str[j]);
                    }
                }
            }
        }


        for (var i = 0; i < Aquarium.corals.length; i++) {
            var coral = Aquarium.corals[i];
            var coralX = coral.x;
            var coralY = winHeight;
            coral.age += [-2, -1, -0.5, 0.5, 1, 2][i % 6] * 0.5;

            coral.len += 1 * (Math.random() - 0.5);
            coral.w += 1 * (Math.random() - 0.5);

            coral.w = Math.min(Math.max(1, coral.w), 3);
            coral.len = Math.min(Math.max(0, coral.len), 11);
            for (var l = 0; l < coral.len; l++) {

                y = coralY - l;
                x = coralX + Math.cos(coral.age / 2 + l) / 2 * Math.min(l, 4);
                // restore(x, y);
                var w = (coral.len - l) / 10 * coral.w;
                for (var xpos = x - w; xpos <= x + w; xpos++) {
                    put(xpos, y, coral.char);
                }

            }
        }

        for (i = 0; i < Aquarium.bubbles.length; i++) {
            var bub = Aquarium.bubbles[i];
            bub.y -= bub.speed / 3;
            bub.age++;
            bub.x += Math.cos(bub.age / 1) * speed / 3;
            if (bub.y < 0) {
                bub.y = winHeight + rndint(200);
                if (rndint(5) === 0) {
                    bub.x = rndint(winWidth);
                } else {
                    bub.x = choice(Aquarium.blubbPos);
                }
            }
            put(bub.x, bub.y, bub.char);
        }

        if (sharkAttack) {
            if ((Aquarium.age % 2) === 0) {
                nc.colorPair(1, rndint(6) + 1, 0);
            }
        } else {
            nc.colorPair(1, nc.colors.BLUE, 0);
        }
        win.refresh();
    }

};


var changed = [];
var chars = [];

function put(x, y, str, color) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x > 0 && y > 0 && x < winWidth && y < winHeight && str !== ' ') {
        win.addstr(Math.floor(y), Math.floor(x), str);
    }
}

function restore(x, y, str) {
    win.addstr(~~y, ~~x, ' ');
}

Aquarium.init();
