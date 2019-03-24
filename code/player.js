export function createPlayer(game, worldLayer) {
    const player = game.physics.add
    .sprite(512, 704, 'atlas', 'misa-front')
    .setSize(32, 40)
    .setOffset(0, 24);
    game.physics.add.collider(player, worldLayer);

  const anims = game.anims;
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


  return player;

}