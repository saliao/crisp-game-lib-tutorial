title = "SPOODERMAN";

description = `
[Hold]
 Web Swing
`;

characters = [
	`
	 lll
	l l l
	llllll 
	llllll
	llllll
	l 	 l
	  `,];

options = {
  //theme: 'crt',
  theme: 'pixel',
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 100,
  //100,27,1,101,199
};

let buildings;
let piles;
let p, v;
let anchor;
let nearest;
let scr;
let minDist;
let dist;
let nextAnchorDist;
let nextBuildingTicks;

function update() {

  if (!ticks) {
    piles = [];
	buildings = [];
    p = vec(99, (nextAnchorDist = 9));
    v = vec();
    anchor = nearest = null;
	nextBuildingTicks = 0;
  }
  nextBuildingTicks--;
  if (nextBuildingTicks <= 0) {
    buildings.push({
      pos: vec(100, 100),
      size: vec(rndi(20, 30), -rndi(30, 80)),
    });
    nextBuildingTicks = rndi(5, 50) * 10;
  }
  remove(buildings, (b) => {
    b.pos.x -= 0.1;
    color("cyan");
    rect(b.pos, b.size);
    color("white");
    rect(b.pos.x + 1, b.pos.y, b.size.x - 2, b.size.y + 1);
    return b.pos.x + b.size.x < 0;
  });
  score += scr = (p.x > 30 ? (p.x - 30) * 0.1 : 0) + difficulty * 0.1;
  p.x -= scr;
  if ((v.y += 0.02) < 0 && p.y < 0) {
    v.y *= -1;
  }
  if (p.y > 99 || p.y < 1) {
    play("explosion");
    end();
  }
  p.add(v.mul(.99));
  color("red");
  //box(p, 7, 7);
  char("a", p);
  minDist = 99;
  piles.map((m) => {
    dist = abs(m.y - p.y);
    if (m.x > p.x && dist < minDist) {
      minDist = dist;
      nearest = m;
    }
  });
  color("black");
  if (nearest) {
    box(nearest, 9, 9);
    if (input.isJustPressed) {
      play("jump");
      anchor = nearest;
	  nextBuildingTicks-=100;
    }
  }
  if (input.isPressed && anchor) {
    v.add(vec(anchor).sub(p).div(199));
	color("black");
    line(p, anchor,3);
    if (anchor.x < 0) {
      anchor = null;
    }
  }
  if (input.isJustReleased) {
    anchor = null;
  }
  if ((nextAnchorDist -= scr) < 0) {
    nextAnchorDist += rnd(50, 66);
    piles.push(vec(99, rnd(66)));
  }
  color("light_black");
  piles = piles.filter((m) => {
    m.x -= scr;
    box(m, 5, 5);
    return m.x > 0;
  });
}

