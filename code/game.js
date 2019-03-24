import { createPlayer } from './player.js';
import Bullet from './bullet.js';

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
      },
      debug: false
    }
  },
  scene
};

const game = new Phaser.Game(config);
let player,
  playerBullets,
  bulletSpawner,
  cursors,
  mouse,
  collideGroup,
  worldLayer;

scene.preload = function() {
  // World
  this.load.image('tiles', 'assets/maps/world-1/world.png');
  this.load.tilemapTiledJSON('map', 'assets/maps/world-1/world.json');

  // Hero
  this.load.atlas(
    'atlas',
    'assets/heroes/misa/atlas.png',
    'assets/heroes/misa/atlas.json'
  );

  // Other
  this.load.image('bullet', 'assets/bullets/fire-ball-1.png');
  this.load.image('rect', 'assets/other/rect.png');
};

scene.create = function() {
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('worldset', 'tiles');

  const groundLayer = map.createStaticLayer('ground', tileset, 0, 0);
  worldLayer = map
    .createStaticLayer('world', tileset, 0, 0)
    .setCollisionByExclusion([-1]);

  worldLayer.setDepth(10);

  player = createPlayer(this, worldLayer);
  playerBullets = this.physics.add.group({
    classType: Bullet,
    runChildUpdate: true
  });

  bulletSpawner = this.add.rectangle(player.x, player.y, 16, 16, 0x6666ff);
  bulletSpawner.alpha = 0;

  collideGroup = this.physics.add.group({
    classType: Phaser.GameObjects.Sprite,
    runChildUpdate: true
  });

  console.log('tt')

  worldLayer.forEachTile(t => {
    if (t.collides) {
      collideGroup.create(t.pixelX + 16, t.pixelY + 16, 'rect', 0, true, true);
    }
  });
  this.physics.add.collider(
    playerBullets,
    collideGroup,
    bulletVsWorld,
    null,
    this
  );

  const camera = this.cameras.main;
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  cursors = this.input.keyboard.createCursorKeys();
  mouse = this.input.activePointer;

  this.input.on(
    'pointerdown',
    function(pointer, time, lastFired) {
      if (player.active === false) return;

      const bullet = playerBullets
        .get()
        .setActive(true)
        .setVisible(true);

      if (bullet) {
        bullet.fire(bulletSpawner, pointer);
        this.physics.add.collider(bullet, worldLayer, bulletVsWorld);
      }
    },
    this
  );
};

function bulletVsWorld(bulletHit, worldHit) {
  if (bulletHit.active === true && worldHit.active === true) {
    bulletHit.setActive(false);
    bulletHit.setVisible(false);
  }
}

const speed = 160;
scene.update = function(time, delta) {
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

  player.body.velocity.normalize().scale(speed);

  if (cursors.left.isDown) {
    player.anims.play('misa-left-walk', true);
  } else if (cursors.right.isDown) {
    player.anims.play('misa-right-walk', true);
  } else if (cursors.up.isDown) {
    player.anims.play('misa-back-walk', true);
  } else if (cursors.down.isDown) {
    player.anims.play('misa-front-walk', true);
  } else {
    player.anims.stop();
  }

  bulletSpawner.x = player.x;
  bulletSpawner.y = player.y + 12;
  bulletSpawner.rotation = Phaser.Math.Angle.Between(
    bulletSpawner.x,
    bulletSpawner.y,
    mouse.worldX,
    mouse.worldY
  );
};
