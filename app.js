const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let multiverse = false;

function init(n = 120){
  particles = [];

  for(let i=0;i<n;i++){
    particles.push({
      x:(Math.random()-0.5)*2,
      y:(Math.random()-0.5)*2,
      vx:(Math.random()-0.5)*0.02,
      vy:(Math.random()-0.5)*0.02,
      mass:Math.random()*2+0.5,
      type:"gas"
    });
  }
}

function resetUniverse(){
  init();
}

function toggleMultiverse(){
  multiverse = !multiverse;
  alert(multiverse ? "Multiverse ON" : "Multiverse OFF");
}

// Physics
function update(){

  let G = 0.03;
  let expansion = 0.005;
  let darkEnergy = 0.002;
  let soft = 0.1;

  for(let p of particles){

    // expansion
    p.vx += expansion * p.x;
    p.vy += expansion * p.y;

    // dark energy
    p.vx += darkEnergy * p.x;
    p.vy += darkEnergy * p.y;

  }

  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){

      let a = particles[i];
      let b = particles[j];

      let dx = b.x - a.x;
      let dy = b.y - a.y;

      let dist = Math.sqrt(dx*dx+dy*dy)+soft;

      let force = (G * a.mass * b.mass) / (dist*dist);

      let fx = force * dx/dist;
      let fy = force * dy/dist;

      a.vx += fx/a.mass;
      a.vy += fy/a.mass;

      b.vx -= fx/b.mass;
      b.vy -= fy/b.mass;

      // STAR FORMATION
      if(dist < 0.05 && a.mass > 3){
        a.type = "star";
      }

      // SUPERNOVA
      if(a.type === "star" && a.mass < 1){
        explode(a);
      }
    }
  }

  for(let p of particles){
    p.x += p.vx;
    p.y += p.vy;
  }
}

function explode(p){
  for(let i=0;i<10;i++){
    particles.push({
      x:p.x,
      y:p.y,
      vx:(Math.random()-0.5)*0.1,
      vy:(Math.random()-0.5)*0.1,
      mass:0.2,
      type:"dust"
    });
  }
  p.mass = 0;
}

function draw(){
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let p of particles){

    let x = canvas.width/2 + p.x*200;
    let y = canvas.height/2 + p.y*200;

    ctx.beginPath();
    ctx.arc(x,y,p.mass*2,0,Math.PI*2);

    if(p.type==="star") ctx.fillStyle="yellow";
    else if(p.type==="dust") ctx.fillStyle="gray";
    else ctx.fillStyle="white";

    ctx.fill();
  }
}

async function askAI(){

  let q = document.getElementById("question").value;

  alert("AI Tutor (offline demo): " +
    "This system simulates emergent gravity + expansion. Try changing parameters.");
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

init();
loop();
