let canvas = document.querySelector('canvas');
let canvasContext = canvas.getContext('2d');

// Definindo background como preto
canvas.style.background = 'black';

let dirX = true;
let dirY = true;

// Definição das raquetes
let pad1YPos, pad2YPos;

let RequestFrame = false;
let ballAnimation = 0;

// Definindo controles iniciais
let WKeyState = false;
let SKeyState = false;
let OKeyState = false;
let LKeyState = false;

// Iniciando pontuações
let Score1 = 0;
let Score2 = 0;

// Variável para a velocidade da bola
let ballSpeed = 8; // Valor padrão para Normal

// Verificando se jogo está ativo
let isGameActive = false;

// Definição da cor do projeto
let chosenColor = '#30a25f';

// Elementos do menu
const difficultySelect = document.getElementById('difficultySelect');
const startButton = document.getElementById('startButton');
const menu = document.getElementById('Menu');

// Mapeamento para evitar key ghosting
document.addEventListener('keydown', (e) => {
  if (e.key == 'w') WKeyState = true;
  if (e.key == 's') SKeyState = true;
  if (e.key == 'ArrowUp') OKeyState = true;
  if (e.key == 'ArrowDown') LKeyState = true;

  // Iniciar jogo ao pressionar Enter
  if (e.key === 'Enter') {
    startGame();
  }
});

// Mapeamento para evitar key ghosting
document.addEventListener('keyup', (e) => {
  if (e.key == 'w') WKeyState = false;
  if (e.key == 's') SKeyState = false;
  if (e.key == 'ArrowUp') OKeyState = false;
  if (e.key == 'ArrowDown') LKeyState = false;
});

// Função para iniciar o jogo
function startGame() {
  // Ajusta a velocidade com base na dificuldade selecionada
  ballSpeed = parseInt(difficultySelect.value);

  // Esconder o menu
  menu.style.display = 'none';

  let ball = new Obj(DocWidth / 2, DocHeight / 2, 10);
  ball.drawBall();
  RequestFrame = true;
  ballLoopMovement(ball);
}

class Obj {
  // Construtor Base
  constructor(x, y, radius, height) {
    this.color = `${chosenColor}`;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.height = height;
    this.speed = ballSpeed;
  }

  // Método desenha Bola
  drawBall() {
    canvasContext.beginPath();
    canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    canvasContext.fillStyle = this.color;
    canvasContext.fill();
    canvasContext.closePath();
  }

  // Método desenha raquete (pad)
  drawPad() {
    canvasContext.fillRect(this.x, this.y, this.radius, this.height);
    canvasContext.fillStyle = this.color;
  }

  // Método mover bola
  moveBall() {
    if (dirY) this.y += this.speed;
    if (dirX) this.x += this.speed;
    if (!dirY) this.y -= this.speed;
    if (!dirX) this.x -= this.speed;
    if (this.y > DocHeight) dirY = false;
    if (this.x > DocWidth) {
      dirX = genRandomDirection();
      dirY = genRandomDirection();

      this.y = DocHeight / 2;
      this.x = DocWidth / 2;

      Score1++;
      RequestFrame = false;
      canvasContext.clearRect(0, 0, DocWidth + 100, DocHeight);
      drawPads(pad1YPos, pad2YPos);
      canvasContext.fillRect(DocWidth / 2 - 5, 0, 10, DocHeight);
      canvasContext.fillStyle = `${chosenColor}`;
      canvasContext.fill();
      this.drawBall();
    }

    if (this.y < 0) dirY = true;

    if (this.x < 0) {
      dirX = genRandomDirection();
      dirY = genRandomDirection();

      this.y = DocHeight / 2;
      this.x = DocWidth / 2;

      Score2++;
      RequestFrame = false;
      canvasContext.clearRect(0, 0, DocWidth + 100, DocHeight);
      drawPads(pad1YPos, pad2YPos);
      canvasContext.fillRect(DocWidth / 2 - 5, 0, 10, DocHeight);
      canvasContext.fillStyle = `${chosenColor}`;
      canvasContext.fill();
      this.drawBall();
    }

    canvasContext.clearRect(0, 0, DocWidth + 100, DocHeight);
    drawPads(pad1YPos, pad2YPos);
    canvasContext.fillRect(DocWidth / 2 - 5, 0, 10, DocHeight);
    canvasContext.fillStyle = `${chosenColor}`;
    canvasContext.fill();
    this.drawBall();
    checkCollision(this.y, this.x);
    document.querySelector('#Player1').innerHTML = `${Score1}/10`;
    document.querySelector('#Player2').innerHTML = `${Score2}/10`;
  }
}

canvasSetup();
window.onresize = canvasSetup;

function canvasSetup() {
  DocHeight = window.innerHeight;
  DocWidth = window.innerWidth;
  pad2YPos = DocHeight / 2;
  pad1YPos = DocHeight / 2;
  canvas.height = DocHeight;
  canvas.width = DocWidth;
  dirX = genRandomDirection();
  dirY = genRandomDirection();
  drawPads(pad1YPos, pad2YPos);
  let ball = new Obj(DocWidth / 2, DocHeight / 2, 10);
  ball.drawBall();
  canvasContext.fillRect(DocWidth / 2 - 5, 0, 10, DocHeight);
  canvasContext.fillStyle = `${chosenColor}`;
  canvasContext.fill();
}

function drawPads(pad1YPos, pad2YPos) {
  let Pad1 = new Obj(50, pad1YPos, 25, 100);
  let Pad2 = new Obj(DocWidth - 50, pad2YPos, 25, 100);

  Pad1.drawPad();
  Pad2.drawPad();
}

canvas.onclick = () => {
  if (!RequestFrame) {
    let ball = new Obj(DocWidth / 2, DocHeight / 2, 10);
    ball.drawBall();
    RequestFrame = true;
    ballLoopMovement(ball);
  }
};

function ballLoopMovement(ball) {
  if (WKeyState && pad1YPos > 0) pad1YPos -= 10;
  if (SKeyState && pad1YPos < window.innerHeight - 100) pad1YPos += 10;
  if (OKeyState && pad2YPos > 0) pad2YPos -= 10;
  if (LKeyState && pad2YPos < window.innerHeight - 100) pad2YPos += 10;
  ball.moveBall();
  if (RequestFrame)
    requestAnimationFrame(() => {
      ballLoopMovement(ball);
    });
}

function checkCollision(ballY, ballX) {
  ballX = ballX - 5;
  let LoclPad1XPos = 50 + 12.5;
  distance1 = Math.abs(ballX - LoclPad1XPos);

  if (distance1 < 5 && ballY > pad1YPos - 50 && pad1YPos + 100 > ballY)
    dirX = true;

  ballX = ballX + 10;

  let LoclPad2XPos = DocWidth - 50;
  distance2 = Math.abs(ballX - LoclPad2XPos);

  if (distance2 < 5 && ballY > pad2YPos - 50 && pad2YPos + 100 > ballY)
    dirX = false;

  if (Score1 > 9) {
    RequestFrame = false;
    canvas.onclick = () => {};
    document.querySelector('#WinMsg').style.display = 'block';

    document.querySelector('#WinPlayerId').innerHTML = 1;
  }

  if (Score2 > 9) {
    RequestFrame = false;
    canvas.onclick = () => {};
    document.querySelector('#WinMsg').style.display = 'block';
    document.querySelector('#WinPlayerId').innerHTML = 2;
  }
}

function genRandomDirection() {
  return Boolean(Math.floor(Math.random() * 2));
}
