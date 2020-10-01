
let scoreBox= document.querySelector(".scoreBox")	;
let messageBox= document.querySelector(".messageBox");
let playArea= document.querySelector(".playArea");
let road= playArea.getBoundingClientRect();
let colors=["#82589F","#227093","#BDC581","#F97F51","#1B9CFC","#fff200","#ff3838"];

let key={
	ArrowUp:false,
	ArrowRight:false,
	ArrowDown:false,
	ArrowLeft:false,
}

let player={movement:7, plays:false,increaseSpeed:0,score:0}

document.addEventListener('keydown', function(e){
e.preventDefault();
key[e.key]=true;
});

document.addEventListener('keyup', function(e){
e.preventDefault();
key[e.key]=false;
});


//CHECK FOR COLLISION
function isCollide(player,enemy){
return !((player.bottom < enemy.top) || (player.top > enemy.bottom) || (player.right < enemy.left) || (player.left > enemy.right))
}

function endGame(){
	player.plays=false;
	
	messageBox.innerText=`Game Over \n Your final ${player.score} \n Click to play again`;
	messageBox.classList.remove("hide");
}


//MOVE ROAD STRIPES
function moveStripes()
{
	let roadStripes = document.querySelectorAll(".roadStripes");
	let road= playArea.getBoundingClientRect();
	roadStripes.forEach( function(item) {
		
		if(item.y >= road.height )
		{
			item.y -= (road.height+175) ;
		}
		item.y+= player.movement+ player.increaseSpeed;
		item.style.top = item.y + "px";
	});
}


//MOVE ENEMY CARS
function moveEnemyCars(car){
	let enemyCar = document.querySelectorAll(".enemyCar");
	let road= playArea.getBoundingClientRect();
	
	enemyCar.forEach( function(item) {

		let carDimension= car.getBoundingClientRect();
		let itemDimension= item.getBoundingClientRect();
		
			if(isCollide(carDimension,itemDimension))
				{
					console.log('CAR HIT');
					endGame();
			
				}

		if(item.y >= road.height )
		{
			item.y -= (road.height+500) ;
			item.style.left=Math.random()*(road.width-50)+ "px";
			let index= Math.floor(Math.random()*colors.length);
			item.style.background= colors[index];
		}

		item.y+= player.movement+ player.increaseSpeed;
		item.style.top = item.y + "px";
		});	
}



//IF MESSAGEBOX CLICKED
messageBox.addEventListener("click",function(){	
	player.plays=true;
	player.score=0;
	player.movement=6;

	//	HIDE BOX AND SHOW GAME AREA
	messageBox.classList.add('hide');
	playArea.innerHTML="";

	//CREATE PLAYER CAR
	let car=document.createElement("div");
	car.setAttribute('class','car');
	playArea.append(car);

	//CREATE ROAD STRIPES
	for(let i=0;i<10; i++)
	{
		let roadStripes=document.createElement("div");
		roadStripes.setAttribute('class','roadStripes');

		roadStripes.y= i*175;
		roadStripes.style.top=roadStripes.y + "px";

		playArea.append(roadStripes);
	}

	//GET ROAD DIMENSIONS
	let road= playArea.getBoundingClientRect();
	//CREATE ENEMY CARS	
	for(let i=0;i<5; i++)
		{
			let index= Math.floor(Math.random()*colors.length);
			let enemyCar=document.createElement("div");
			enemyCar.setAttribute('class','enemyCar');
			enemyCar.style.background= colors[index];

			enemyCar.y= ((i+1)*250)*-1;
			enemyCar.style.top=enemyCar.y + "px";
			enemyCar.style.left=Math.random()*(road.width-50)+ "px";

			playArea.append(enemyCar);
		}

	window.requestAnimationFrame(startGamePlay);

});



function startGamePlay(){
	 
	let road= playArea.getBoundingClientRect();
	
	if(player.plays)
	{
		let car=document.querySelector(".car");
		moveStripes();
		moveEnemyCars(car);
		

		if(key.ArrowRight && car.offsetLeft<(road.width-50)){
		car.style.left=car.offsetLeft+ player.movement+"px" ;
		}
		if(key.ArrowLeft && car.offsetLeft>(0) ){
		car.style.left=car.offsetLeft- player.movement+"px" ;
		}
		if(key.ArrowUp && car.offsetTop>(70)){
		car.style.top=car.offsetTop- player.movement+"px" ;

		}
		if(key.ArrowDown && car.offsetTop<(road.height-80)){
			car.style.top=car.offsetTop + player.movement+"px" ;
		}
		
	if(player.plays)
		player.score++;
	scoreBox.innerText=`Score: ${player.score}`;
	if(player.score%200==0)
		player.movement+=0.5;
	 window.requestAnimationFrame(startGamePlay);
	}
}
