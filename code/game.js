const g = ga(512, 512, setup, [
  '../images/fantasy.png',
  '../images/walkcycle.png',
  '../maps/fantasy.json'
]);
g.start();

g.fps = 60;

let world,
  elf,
  elfTextures,
  camera,
  itemsLayer,
  itemsMapArray,
  items,
  message,
  bullets;

function setup() {
  world = g.makeTiledWorld('../maps/fantasy.json', '../images/fantasy.png');

  elf = g.sprite(g.filmstrip('../images/walkcycle.png', 64, 64));

  elf.x = world.getObject('elf').x;
  elf.y = world.getObject('elf').y;

  const objectsLayer = world.getObject('objects');
  objectsLayer.addChild(elf);

  itemsLayer = world.getObject('items');
  items = itemsLayer.children.slice(0);
  itemsMapArray = world.getObject('items').data;

  camera = g.worldCamera(world, g.canvas);
  camera.centerOver(elf);

  elf.collisionArea = { x: 22, y: 44, width: 20, height: 20 };

  elf.states = {
    up: 0,
    left: 9,
    down: 18,
    right: 27,
    walkUp: [1, 8],
    walkLeft: [10, 17],
    walkDown: [19, 26],
    walkRight: [28, 35]
  };

  elf.show(elf.states.right);
  elf.fps = 18;

  setKeyboard();

  ex = elf.gx + elf.halfWidth;
  ey = elf.gy;

  rect = g.rectangle(10, 10, 'none', 'none', 0, ex, ey);
  // rect = g.rectangle(10, 10, 'none', 'black', 1, elf.centerX - camera.leftInnerBoundary, camera.centerY - elf.height);

  message = g.text('No items found', '12px Verdana', 'black');
  message.setPosition(10, 10);
  message.visible = false;

  bullets = [];

  g.stage.interactive = true;
  g.stage.press = function() {
    g.shoot(
      rect, //The shooter
      rect.rotation, //The angle at which to shoot
      0, //The bullet's offset from the center
      7, //The bullet's speed (pixels per frame)
      bullets, //The array used to store the bullets
      //A function that returns the sprite that should
      //be used to make each bullet
      function() {
        return g.circle(8, 'red');
      }
    );
  };

  g.state = play;
}

function play() {
  elf.x = Math.max(-18, Math.min(elf.x + elf.vx, world.width - elf.width + 18));
  elf.y = Math.max(-10, Math.min(elf.y + elf.vy, world.height - elf.height));
  //   g.move(elf);
  //   if (elf.x > world.width) elf.x = 0;
  //   if (elf.x < 0) elf.x = world.width;
  camera.follow(elf);
  elfVsGround();
  elfVsItems();

  rect.x = elf.gx + elf.halfWidth - 2;
  rect.y = elf.gy + elf.halfHeight;
  rect.rotation = g.angle(rect, g.pointer)


  bullets = bullets.filter(function(bullet) {
    g.move(bullet);
    var collision = g.outsideBounds(bullet, g.stage.localBounds);
    if (collision) {
      g.remove(bullet);
      return false;
    }
    return true;
  });
}

function elfVsGround() {
  const obstaclesMapArray = world.getObject('obstacles').data;
  const elfVsGround = g.hitTestTile(elf, obstaclesMapArray, 0, world, 'every');
  if (!elfVsGround.hit) {
    elf.x -= elf.vx;
    elf.y -= elf.vy;
    elf.vx = 0;
    elf.vy = 0;
  }
}

function elfVsItems() {
  const elfVsItems = g.hitTestTile(elf, itemsMapArray, 0, world, 'some');
  if (!elfVsItems.hit) {
    items = items.filter(function(item) {
      if (item.index === elfVsItems.index) {
        message.visible = true;
        message.content = 'You found a ' + item.name;
        g.wait(3000, function() {
          message.visible = false;
        });
        itemsMapArray[item.index] = 0;
        g.remove(item);
        return false;
      } else {
        return true;
      }
    });
  }
}

function setKeyboard() {
  leftArrow = g.keyboard(37);
  upArrow = g.keyboard(38);
  rightArrow = g.keyboard(39);
  downArrow = g.keyboard(40);

  leftArrow.press = function() {
    // rect.rotation = 3,14159;
    elf.playSequence(elf.states.walkLeft);
    elf.vx = -2;
    elf.vy = 0;
  };
  leftArrow.release = function() {
    if (!rightArrow.isDown && elf.vy === 0) {
      elf.vx = 0;
      elf.show(elf.states.left);
    }
  };
  upArrow.press = function() {
    elf.playSequence(elf.states.walkUp);
    elf.vy = -2;
    elf.vx = 0;
  };
  upArrow.release = function() {
    if (!downArrow.isDown && elf.vx === 0) {
      elf.vy = 0;
      elf.show(elf.states.up);
    }
  };
  rightArrow.press = function() {
    // rect.rotation = 0;
    elf.playSequence(elf.states.walkRight);
    elf.vx = 2;
    elf.vy = 0;
  };
  rightArrow.release = function() {
    if (!leftArrow.isDown && elf.vy === 0) {
      elf.vx = 0;
      elf.show(elf.states.right);
    }
  };
  downArrow.press = function() {
    elf.playSequence(elf.states.walkDown);
    elf.vy = 2;
    elf.vx = 0;
  };
  downArrow.release = function() {
    if (!upArrow.isDown && elf.vx === 0) {
      elf.vy = 0;
      elf.show(elf.states.down);
    }
  };
}
