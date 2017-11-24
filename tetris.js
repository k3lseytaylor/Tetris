const canvas =  document.getElementById('tetris');
const context = canvas.getContext('2d');
let flag = null ;
context.scale(20,20)




function start(){
	document.getElementById('start-modal').style.display='none'
	document.getElementById('tetris').style.border='10px solid grey'
	playerReset();
	update();	
}

//**************************  Collide/Sweep  **************************
function arenaSweep(){
	let rowCount = 1;
	outer: for(let y = arena.length- 1; y > 0; --y){
		for(let x = 0; x < arena[y].length; ++x ){
			if(arena[y][x] ===0 ){
				continue outer;
			}
		}
		player.score +=rowCount*10;
		const row = arena.splice(y , 1)[0].fill(0);
		arena.unshift(row);
		const x = document.getElementById('tetris');
		const k = document.getElementById('score');
    		x.classList.toggle("tetris-scored");
    		k.classList.toggle('score-animation');
    	setTimeout(function(){ x.classList.remove("tetris-scored"),
    		k.classList.remove("score-animation") }, 500);
		++y;

		

		
    	

		rowCount *= 2;
	}
}


function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}


//************************** Game Pieces **************************
function createPiece(type){
	if(type === 'T'){
		return [
				[0,0,0],
				[1,1,1],
				[0,1,0],
			];
	}else if(type === 'O'){
				return [
				[2,2],
				[2,2],
			];
	}else if(type === 'L'){
				return [
				[0,3,0],
				[0,3,0],
				[0,3,3],
			];
	}else if(type === 'J'){
				return [
				[0,4,0],
				[0,4,0],
				[4,4,0],
			];
	}else if(type === 'I'){
				return [
				[0,5,0,0],
				[0,5,0,0],
				[0,5,0,0],
				[0,5,0,0],
			];
	}else if(type === 'S'){
				return [
				[0,6,6],
				[6,6,0],
				[0,0,0],
			];
	}else if(type === 'Z'){
				return [
				[7,7,0],
				[0,7,7],
				[0,0,0],
			];
	}
}

//************************** Game Main Controllers **************************

function draw(){
	if(flag === null){
		context.fillStyle='#000';
		context.fillRect(0,0,canvas.width,canvas.height);
		drawMatrix(arena,{x:0 ,y:0});
		drawMatrix(player.matrix, player.pos);
	}

}

function createMatrix(w,h){
	const matrix= [];
	while(h--){
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}

function drawMatrix(matrix,offset){
		matrix.forEach((row,y)=>{
		row.forEach((value,x)=>{
			if(value!==0){
				context.fillStyle=colors[value];

				context.fillRect(x+ offset.x,
								y+offset.y
								,1,1);
			}
		});
	});
}
function merge(arena,player){
	player.matrix.forEach((row,y)=>{
		row.forEach((value, x)=>{
			if(value !== 0){
				arena[y+player.pos.y][x+player.pos.x]=value
			}
		})
	})
}
function playerDrop(){
	player.pos.y++;
	if(collide(arena,player)){
		player.pos.y--;
		merge(arena,player);
		playerReset();
		arenaSweep();
		updateScore();
	}
	dropCounter = 0;
}


function playerReset() {
    const pieces = 'TOLJISZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);
    //Clear when game over
   	if(collide(arena,player)){
   		context.clearRect(0, 0, canvas.width, canvas.height);
   		//arena.forEach(row => row.fill(0));
   		// player.score = 0;
   		// updateScore();
   		document.getElementById('tetris').style.visibility='hidden'
   		document.getElementById('lose-modal').style.display='block'
   		document.getElementById('end-modal-score').innerText=player.score;
   		console.log(player.score);
   		flag = true;
   	}
}

function restart(){
	arena.forEach(row => row.fill(0));
   	player.score = 0;
   	updateScore();
   	document.getElementById('tetris').style.visibility='visible'
   	document.getElementById('lose-modal').style.display='none'
   	flag = null;
}

function playerMove(dir){
	player.pos.x += dir;
	if(collide(arena,player)){
		player.pos.x-=dir;
	}
}
function playerRotate(dir){
	const pos = player.pos.x;
	let offset=1;
	rotate(player.matrix,dir);
	while(collide(arena,player)){
		player.pos.x += offset;
		offset = -(offset+(offset > 0 ? 1: -1));
		if(offset>player.matrix[0].length){
			rotate(player.matrix, -dir);
			player.pos.x = pos;
			return;
		}
	}
}

function rotate(matrix, dir){
	for(let y = 0 ; y< matrix.length;++y){
		for(let x= 0; x<y;++x){
			[
				matrix[x][y],
				matrix[y][x],
				]=[
				matrix[y][x],
				matrix[x][y],
			];
		}
	}
	if(dir > 0){
		matrix.forEach(row => row.reverse());
	} else {
		matrix.reverse();
	}
}


let dropCounter= 0 ;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0){
	const deltaTime=time - lastTime;
	lastTime = time;

	dropCounter += deltaTime;
	if(dropCounter>dropInterval){
		playerDrop();
	}

	
	draw();
	requestAnimationFrame(update);
}


//************************** Score Update **************************


function updateScore(){
	document.getElementById('score').innerText=player.score;

}
//************************** Game Pieces Color **************************
const colors = [
				null,
				'#1A4F63',
				'#FFFFD9',
				'#7062c4',
				'#FCB03C',
				'#FC5B3F',
				'#6FB07F',
				'#c462b8',
]
const arena= createMatrix(12,20);
const player ={
	pos:{x:0,y:0},
	matrix:null,
	score: 0,
}

//************************** Key Config **************************
//Left Key code: 65
//Right Key code: 68
//Down Key code: 83
//Rotate Left Key code: 81
//Rotate Right Key code :69

document.addEventListener('keydown', event =>{
	if(event.keyCode === 65){
		playerMove(-1);
	}else if(event.keyCode === 68){
		playerMove(+1);
	}else if(event.keyCode === 83){
		playerDrop();
	}else if(event.keyCode === 81){
		playerRotate(-1);
	}else if(event.keyCode === 69){
		playerRotate(1);
	}
})



