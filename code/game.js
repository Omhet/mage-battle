const scene = new Phaser.Scene();
const config = {
  type: Phaser.AUTO,
  width: 768,
  height: 512,
  parent: 'game',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0
      }
    }
  },
  scene
};

const game = new Phaser.Game(config);
let controls;

scene.preload = function() {
  // World
  this.load.image('tiles', 'maps/world-1/world.png');
  this.load.tilemapTiledJSON('map', 'maps/world-1/world.json');

  // Hero
  this.load.atlas('atlas', 'heroes/misa/atlas.png', 'heroes/misa/atlas.json');
};

scene.create = function() {
  const map = this.make.tilemap({ key: 'map' });

  const tileset = map.addTilesetImage('world', 'tiles');

  const groundLayer = map.createStaticLayer('ground', tileset, 0, 0);
  const worldLayer = map.createStaticLayer('world', tileset, 0, 0);

  worldLayer.setDepth(10);
  worldLayer.setCollisionByProperty({ collides: true });

  player = this.physics.add
    .sprite(64, 64, 'atlas', 'misa-front')
    .setSize(30, 40)
  .setOffset(0, 24);
  this.physics.add.collider(player, worldLayer);

  const anims = this.anims;
  anims.create({
    key: 'misa-left-walk',
    frames: anims.generateFrameNames('atlas', {
      prefix: 'misa-left-walk.',
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: 'misa-right-walk',
    frames: anims.generateFrameNames('atlas', {
      prefix: 'misa-right-walk.',
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: 'misa-front-walk',
    frames: anims.generateFrameNames('atlas', {
      prefix: 'misa-front-walk.',
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: 'misa-back-walk',
    frames: anims.generateFrameNames('atlas', {
      prefix: 'misa-back-walk.',
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  const camera = this.cameras.main;

  cursors = this.input.keyboard.createCursorKeys();
  // const { left, right, up, down } = cursors;
  // controls = new Phaser.Cameras.Controls.FixedKeyControl({
  //   camera,
  //   left,
  //   right,
  //   up,
  //   down,
  //   speed: 0.5
  // });

  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
};

const speed = 175;
scene.update = function(time, delta) {
  // controls.update(delta);

  const prevVelocity = player.body.velocity.clone();

  // Stop any previous movement from the last frame
  player.body.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);

  
  // Update the animation last and give left/right animations precedence over up/down animations
  if (cursors.left.isDown) {
    player.anims.play("misa-left-walk", true);
  } else if (cursors.right.isDown) {
    player.anims.play("misa-right-walk", true);
  } else if (cursors.up.isDown) {
    player.anims.play("misa-back-walk", true);
  } else if (cursors.down.isDown) {
    player.anims.play("misa-front-walk", true);
  } else {
    player.anims.stop();
  }

  // If we were moving, pick and idle frame to use
  // if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
  // else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
  // else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
  // else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");

};
