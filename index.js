var nc = require('ncurses'),
    win = new nc.Window();

// helpers 
function rnd(max) {
    return Math.random() * max;
}

function rndint(max) {
    return~~ (Math.random() * max);
}

function choice(a) {
    return a[rndint(a.length)];
}




var Aquarium = {
    bubbles: [
    ],
    blubbPos:[],
    init: function () {


        for (var i = 0; i < 6; i += 1) {
            this.blubbPos.push(rndint(80));
        }

        for (i = 0; i < 20; i += 1) {
            char = choice("oO.");
            speed = 1+rnd(3);
            this.bubbles.push({
                age:rndint(1000),
                x: rnd(80),
                y: rnd(24),
                char: char,
                speed: speed
            });
        }

        setInterval(this.frameHandler, 100);
    },
    frameHandler: function () {
        put(0,0,'');
        win.refresh();
        for (var i = 0; i < Aquarium.bubbles.length; i++) {
            var bub = Aquarium.bubbles[i];
            restore(bub.x, bub.y);
            bub.y -= bub.speed/3;
            bub.age++;
            bub.x+=Math.cos(bub.age/1)*speed/3;
            if (bub.y < 0) {
                bub.y = 30;
                bub.x=choice(Aquarium.blubbPos);
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
