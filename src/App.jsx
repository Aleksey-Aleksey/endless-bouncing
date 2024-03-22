import React, { useEffect } from 'react';
import './App.scss';

const COLOR = {
  yellow: '#4E418C',
  violet: '#F9Ab2D',
};

const MOVING_TILE_SIZE = 38;

const MOVING_TILE_COLOR = {
  viloet: COLOR.violet,
  yellow: COLOR.yellow,
};

const MOVING_TILE_SPEED = {
  min: 10,
  max: 20,
};

const FIELD_COLOR = {
  yellow: COLOR.yellow,
  violet: COLOR.violet,
};

export const App = () => {
  useEffect(() => {
    const canvas = document.querySelector('.fieldCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.querySelector('.score');

    const numSquaresX = canvas.width / MOVING_TILE_SIZE;
    const numSquaresY = canvas.height / MOVING_TILE_SIZE;

    let violetScore = 0;
    let yellowScore = 0;

    const squares = [];

    // Populate the fields, one half yellow, one half violet
    for (let i = 0; i < numSquaresX; i++) {
      squares[i] = [];
      for (let j = 0; j < numSquaresY; j++) {
        squares[i][j] =
          i < numSquaresX / 2 ? FIELD_COLOR.yellow : FIELD_COLOR.violet;
      }
    }

    const tiles = [
      {
        x: canvas.width / 4,
        y: canvas.height / 2,
        dx: 8,
        dy: -8,
        reverseColor: FIELD_COLOR.yellow,
        ballColor: MOVING_TILE_COLOR.violet,
      },
      {
        x: (canvas.width / 4) * 3,
        y: canvas.height / 2,
        dx: -8,
        dy: 8,
        reverseColor: FIELD_COLOR.violet,
        ballColor: MOVING_TILE_COLOR.yellow,
      },
    ];

    function drawMovingTile(square) {
      ctx.fillStyle = square.ballColor;
      ctx.fillRect(
        square.x - MOVING_TILE_SIZE / 2,
        square.y - MOVING_TILE_SIZE / 2,
        MOVING_TILE_SIZE,
        MOVING_TILE_SIZE
      );
    };

    function drawSquares() {
      violetScore = 0;
      yellowScore = 0;

      for (let i = 0; i < numSquaresX; i++) {
        for (let j = 0; j < numSquaresY; j++) {
          ctx.fillStyle = squares[i][j];
          ctx.fillRect(
            i * MOVING_TILE_SIZE,
            j * MOVING_TILE_SIZE,
            MOVING_TILE_SIZE,
            MOVING_TILE_SIZE
          );

          // Update scores
          if (squares[i][j] === FIELD_COLOR.yellow) violetScore++;
          if (squares[i][j] === FIELD_COLOR.violet) yellowScore++;
        }
      }
    };

    function checkSquareCollision(movingTile) {
      // Check multiple points around the movingTile's
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        const checkX = movingTile.x + Math.cos(angle) * (MOVING_TILE_SIZE / 2);
        const checkY = movingTile.y + Math.sin(angle) * (MOVING_TILE_SIZE / 2);

        const i = Math.floor(checkX / MOVING_TILE_SIZE);
        const j = Math.floor(checkY / MOVING_TILE_SIZE);

        if (i >= 0 && i < numSquaresX && j >= 0 && j < numSquaresY) {
          if (squares[i][j] !== movingTile.reverseColor) {
            // Square hit! Update square color
            squares[i][j] = movingTile.reverseColor;

            // Determine bounce direction based on the angle
            if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
              movingTile.dx = -movingTile.dx;
            } else {
              movingTile.dy = -movingTile.dy;
            }
          }
        }
      }
    };

    function checkBoundaryCollision(movingTile) {
      if (
        movingTile.x + movingTile.dx > canvas.width - MOVING_TILE_SIZE / 2 ||
        movingTile.x + movingTile.dx < MOVING_TILE_SIZE / 2
      ) {
        movingTile.dx = -movingTile.dx;
      }
      if (
        movingTile.y + movingTile.dy > canvas.height - MOVING_TILE_SIZE / 2 ||
        movingTile.y + movingTile.dy < MOVING_TILE_SIZE / 2
      ) {
        movingTile.dy = -movingTile.dy;
      }
    };

    function addRandomness(movingTile) {
      movingTile.dx += Math.random() * 0.01 - 0.005;
      movingTile.dy += Math.random() * 0.01 - 0.005;

      // Limit the MOVING_TILE_SPEED
      movingTile.dx = Math.min(
        Math.max(movingTile.dx, -MOVING_TILE_SPEED.max),
        MOVING_TILE_SPEED.max
      );
      movingTile.dy = Math.min(
        Math.max(movingTile.dy, -MOVING_TILE_SPEED.max),
        MOVING_TILE_SPEED.max
      );

      // Make sure the movingTile always maintains a minimum MOVING_TILE_SPEED
      if (Math.abs(movingTile.dx) < MOVING_TILE_SPEED.min)
        movingTile.dx =
          movingTile.dx > 0 ? MOVING_TILE_SPEED.min : -MOVING_TILE_SPEED.min;
      if (Math.abs(movingTile.dy) < MOVING_TILE_SPEED.min)
        movingTile.dy =
          movingTile.dy > 0 ? MOVING_TILE_SPEED.min : -MOVING_TILE_SPEED.min;
    };

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSquares();

      scoreElement.innerHTML = `<span style="color: ${COLOR.yellow}">${violetScore}</span>\n
        x <span style="color: ${COLOR.violet}">${yellowScore}</span>`;

      tiles.forEach((movingTile) => {
        drawMovingTile(movingTile);
        checkSquareCollision(movingTile);
        checkBoundaryCollision(movingTile);
        movingTile.x += movingTile.dx;
        movingTile.y += movingTile.dy;

        addRandomness(movingTile);
      });

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }, []);

  return (
    <div className="container">
      <canvas className="fieldCanvas" width="600" height="600"></canvas>
      <div className="score"></div>
    </div>
  );
};
