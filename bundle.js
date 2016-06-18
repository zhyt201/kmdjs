var util={};
var app={};
var main={};

util.bom = (function(){
    var Bom={};

    Bom.getViewport=function() {
        var d = document.documentElement, b = document.body, w = window, div = document.createElement("div");
        div.innerHTML = "  <div></div>";
        var lt = !(div.firstChild.nodeType === 3) ?
        { left: b.scrollLeft || d.scrollLeft, top: b.scrollTop || d.scrollTop } :
        { left: w.pageXOffset, top: w.pageYOffset };
        var wh = w.innerWidth ?
        { width: w.innerWidth, height: w.innerHeight } :
            (d && d.clientWidth && d.clientWidth != 0 ?
            { width: d.clientWidth, height: d.clientHeight } :
            { width: b.clientWidth, height: b.clientHeight });

        return [lt.left, lt.top, wh.width, wh.height]
    };

    Bom.sub = function(a,b){
        return a-b;
    };
    return Bom;
})();

app.Ball = (function(){
    var Ball = function (x, y, r, vx, vy, text) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.d = 2 * r;
        this.vx = vx;
        this.vy = vy;
        this.element = document.createElement("div");
        this.element.innerHTML = text;

        this.element.style.cssText = "text-align:center;position:absolute; -moz-border-radius:" + this.d + "px; border-radius: " + this.d + "px; width: " + this.d + "px; height: " + this.d + "px;background-color:green;line-height:" + this.d + "px;color:white;";
        document.body.appendChild(this.element);

    };

    Ball.prototype.tick= function () {
        this.x += this.vx;
        this.y += this.vy;
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
    };

    return Ball;
})();

main = (function() {

    var ball = new app.Ball(0, 0, 28, 1, -2, "kmdjs");
    var vp = util.bom.getViewport();

    setInterval(function () {
        ball.tick();
        (ball.x + ball.r * 2 > vp[2] || ball.x < 0) && (ball.vx *= -1);
        (ball.y + ball.r * 2 > vp[3] || ball.y < 0) && (ball.vy *= -1);
    }, 15);

})();

