const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin');
const winnerName = document.getElementById('winnerName');
const winnerPhoto = document.getElementById('winnerPhoto');
const spinSound = document.getElementById('spinSound');
const winSound = document.getElementById('winSound');

let angle = 0;
let spinning = false;

// Carrega os alunos da variável global
let alunosDisponiveis = [...alunos];

// Verifica se já existe um sorteado salvo
const alunoSalvo = localStorage.getItem('alunoSorteado');
if (alunoSalvo) {
  const sorteado = JSON.parse(alunoSalvo);
  winnerName.textContent = sorteado.nome;
  winnerPhoto.src = sorteado.arquivo;
  spinning = true; // Impede novo sorteio até reset
}

function drawWheel() {
  const anglePerSector = 2 * Math.PI / alunosDisponiveis.length;
  for (let i = 0; i < alunosDisponiveis.length; i++) {
    const angleStart = i * anglePerSector;
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 250, angleStart, angleStart + anglePerSector);
    ctx.fillStyle = i % 2 === 0 ? "#ff9999" : "#99ccff";
    ctx.fill();
    ctx.save();

    ctx.translate(250, 250);
    ctx.rotate(angleStart + anglePerSector / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "16px Comic Sans MS";
    ctx.fillText(alunosDisponiveis[i].nome, 230, 10);
    ctx.restore();
  }
}

function spinWheel() {
  if (spinning || alunosDisponiveis.length === 0) return;
  spinning = true;
  spinSound.play();

  const rotation = 360 * 5 + Math.floor(Math.random() * 360);
  const duration = 4000;
  const start = performance.now();

  function animate(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    angle = eased * rotation;
    drawRotation();
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      showWinner();
      spinning = false;
    }
  }
  requestAnimationFrame(animate);
}

function drawRotation() {
  ctx.clearRect(0, 0, 500, 500);
  ctx.save();
  ctx.translate(250, 250);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.translate(-250, -250);
  drawWheel();
  ctx.restore();
}

function showWinner() {
  const index = Math.floor(((360 - (angle % 360)) / 360) * alunosDisponiveis.length) % alunosDisponiveis.length;
  const sorteado = alunosDisponiveis.splice(index, 1)[0];
  winnerName.textContent = sorteado.nome;
  winnerPhoto.src = sorteado.arquivo;
  winSound.play();
  drawRotation();

  // Salva o sorteado no localStorage
  localStorage.setItem('alunoSorteado', JSON.stringify(sorteado));
}

// Permite resetar o sorteio (opcional)
function resetarSorteio() {
  localStorage.removeItem('alunoSorteado');
  location.reload();
}

spinBtn.addEventListener("click", spinWheel);
drawRotation();
