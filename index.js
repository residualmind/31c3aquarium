var nc = require('ncurses'),
    win = new nc.Window();

// helpers 
function rnd(max) {
    return Math.random() * max;
}

function rndint(max) {
    return (~~(Math.random() * max));
}

function choice(a) {
    return a[rndint(a.length)];
}



var Aquarium = {
    bubbles: [],
    blubbPos: [],
    corals: [],
    current: 0,
    init: function () {

        for (var i = 0; i < 6; i += 1) {
            this.blubbPos.push(rndint(80));
        }

        for (i = 0; i < 40; i += 1) {
            char = choice("oO.");
            speed = 1 + rnd(3);
            this.bubbles.push({
                age: rndint(1000),
                x: rnd(80),
                y: rnd(24),
                char: char,
                speed: speed
            });
        }

        for (i = 0; i < 6; i++) {
            this.corals.push({
                age: 0,
                x: rndint(80)
            });

        }

        setInterval(this.frameHandler, 100);
    },
    frameHandler: function () {
        put(0, 0, '');
        win.refresh();
        for (var i = 0; i < Aquarium.corals.length; i++) {
            var coralX = Aquarium.corals[i].x;
            var coralY = 24;
            for (var l = 0; l < 8; l++) {
                var x = coralX + Math.cos(l / 10) * 10;
                var y = coralY - l;
                put(x, y, '%');
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




function put(x, y, str) {
    if (x >= 0 && y >= 0 && x <= 80 && y <= 24)
        win.addstr(~~y, ~~x, str);
}

function restore(x, y, str) {
    win.addstr(~~y, ~~x, ' ');
}

Aquarium.init();
