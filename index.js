var bird = {
    skyposition: 0,
    skyspeed: 2,
    birdtop: 220,
    nowclass: 'start-blue',
    flag: true,
    birdspeed: 0,
    pipearr: [],
    lastpipe: 6,
    scores: 0,
    key:false,
    init: function () {
        this.datainit();
        this.animate();
        this.gameclick();
    },
    datainit: function () {
        this.game = document.getElementsByClassName('game')[0];
        this.bird = document.getElementsByClassName('bird')[0];
        this.start = document.getElementsByClassName('start')[0];
        this.score = document.getElementsByClassName('score')[0];
        this.end = document.getElementsByClassName('end')[0];
        this.mask = document.getElementsByClassName('mask')[0];
        this.finallScore = this.end.getElementsByClassName('finall-score')[0];
        this.restart = this.end.getElementsByClassName('restart')[0];
    },
    animate: function () {
        var This = this;
        var count = 0
        This.time = setInterval(function () {
            This.skymove();
            if (!This.flag) {
                This.birddrop()
                This.pipemove()
            }
            if (count++ % 10 == 0) {
                This.birdfly(count % 3);
                if (This.flag) {
                    This.birdjump();
                    This.startchange();
                }
            }
        }, 30)
    },
    skymove: function () {
        this.skyposition -= this.skyspeed;
        this.game.style.backgroundPositionX = this.skyposition + 'px';
    },
    birdjump: function () {
        var pretop = this.birdtop;
        this.birdtop = pretop === 220 ? 260 : 220;
        this.bird.style.top = this.birdtop + 'px';
    },
    birdfly: function (count) {
        this.bird.style.backgroundPositionX = -(count * 30) + 'px';
    },
    startchange: function () {
        var preclass = this.nowclass;
        this.nowclass = preclass === 'start-white' ? 'start-blue' : 'start-white';
        this.start.classList.add(this.nowclass);
        this.start.classList.remove(preclass);
    },
    birddrop: function () {
        this.birdtop += ++this.birdspeed;
        this.bird.style.top = this.birdtop + 'px';
        this.checck();
    },
    gameclick: function () {
        var This = this;
        This.game.onclick = function (e) {
            var target = e.target;
            if (target.classList.contains('start')) {
                This.flag = false;
                This.start.style.display = 'none';
                This.score.style.display = 'block';
                This.bird.style.left = '80px';
                This.bird.style.right = '0px';
                This.bird.style.transition = 'none';
                This.skyspeed = 5;
                for(var i = 0; i < 7; i++){
                    This.createpipe(300 * (i+1))
                }
            } else {
                This.birdspeed = -10;
            }
        }
    },
    checck: function () {
        this.updowncheck();
        this.pipecheck()
    },
    updowncheck: function () {
        if (this.birdtop >= 570 || this.birdtop <= 0) {
            this.gameover()
        }
    },
    pipecheck: function () {
        var index = this.scores % this.pipearr.length;
        var upheight = this.pipearr[index].upheight;
        var downheight = 570 - this.pipearr[index].downheight;
        var up = this.pipearr[index].up;
        if(up.offsetLeft >= 13 && up.offsetLeft <= 95){
            if(this.birdtop <= upheight || this.birdtop >= downheight){
                this.gameover()
            }
        }
        if(up.offsetLeft < 13){
            this.scores++;
            this.score.innerHTML = this.scores;
        }
        // if ((up.offsetLeft >= 13 && up.offsetLeft <= 95) && (this.birdtop <= upheight || this.birdtop >= downheight)) {
        //     this.gameover()
        // }
        // if (up.offsetLeft < 13) {
        //     this.scores++;
        //     this.score.innerHTML = this.scores;
        // }
    },
    gameover: function () {
        clearInterval(this.time)
        this.score.style.display = 'none';
        this.end.style.display = 'block';
        this.mask.style.display = 'block';
        this.finallScore.innerHTML = this.scores;
        this.gamerestart();
    },
    gamerestart: function () {
        var This = this;
        This.restart.onclick = function () {
            This.key = true;
            window.location.reload();
            
        }
    },
    createpipe: function (left) {
        var upheight = Math.floor(Math.random() * 350 + 50);
        var downheight = 450 - upheight;
        var uppipe = this.createdom('div', ['pipe', 'pipe-up'], {
            height: upheight,
            left: left
        });
        var downpipe = this.createdom('div', ['pipe', 'pipe-down'], {
            height: downheight,
            left: left
        })
        this.game.appendChild(uppipe);
        this.game.appendChild(downpipe);
        this.pipearr.push({
            up: uppipe,
            down: downpipe,
            upheight: upheight,
            downheight: downheight
        })

    },
    pipemove: function () {
        for (var i = 0; i < this.pipearr.length; i++) {
            var up = this.pipearr[i].up;
            var down = this.pipearr[i].down;
            var x = up.offsetLeft - this.skyspeed;
            if (x < -52) {
                var lastx = this.pipearr[this.lastpipe].up.offsetLeft
                up.style.left = lastx + 300 + 'px';
                down.style.left = lastx + 300 + 'px';
                var upheight = Math.floor(Math.random() * 350 + 50);
                var downheight = 450 - upheight;
                this.pipearr[i].upheight = upheight;
                this.pipearr[i].downheight = downheight;
                up.style.height = upheight + 'px';
                down.style.height = downheight + 'px';
                this.lastpipe++;
                this.lastpipe = this.lastpipe % this.pipearr.length;
                continue
            }
            up.style.left = x + 'px';
            down.style.left = x + 'px';
        }
    },
    createdom: function (elname, stylearr, dataobj) {
        var el = document.createElement(elname);
        for (var i = 0; i < stylearr.length; i++) {
            el.classList.add(stylearr[i])
        }
        for (var key in dataobj) {
            el.style[key] = dataobj[key] + 'px'
        }
        return el;
    },
}
document.documentElement.onselectstart = function() {
    return false
}