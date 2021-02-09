const Ts=0.02;
const BALL_RADIUS=15;
const PI2=2*Math.PI;
const MAP_RES=100;

const COLORMAP=["rgb(0,0,131)", "rgb(0,0,135)", "rgb(0,0,139)", "rgb(0,0,143)", "rgb(0,0,147)", "rgb(0,0,151)", "rgb(0,0,155)", "rgb(0,0,159)", "rgb(0,0,163)", "rgb(0,0,167)", "rgb(0,0,171)", "rgb(0,0,175)", "rgb(0,0,179)", "rgb(0,0,183)", "rgb(0,0,187)", "rgb(0,0,191)", "rgb(0,0,195)", "rgb(0,0,199)", "rgb(0,0,203)", "rgb(0,0,207)", "rgb(0,0,211)", "rgb(0,0,215)", "rgb(0,0,219)", "rgb(0,0,223)", "rgb(0,0,227)", "rgb(0,0,231)", "rgb(0,0,235)", "rgb(0,0,239)", "rgb(0,0,243)", "rgb(0,0,247)", "rgb(0,0,251)", "rgb(0,0,255)", "rgb(0,4,255)", "rgb(0,8,255)", "rgb(0,12,255)", "rgb(0,16,255)", "rgb(0,20,255)", "rgb(0,24,255)", "rgb(0,28,255)", "rgb(0,32,255)", "rgb(0,36,255)", "rgb(0,40,255)", "rgb(0,44,255)", "rgb(0,48,255)", "rgb(0,52,255)", "rgb(0,56,255)", "rgb(0,60,255)", "rgb(0,64,255)", "rgb(0,68,255)", "rgb(0,72,255)", "rgb(0,76,255)", "rgb(0,80,255)", "rgb(0,84,255)", "rgb(0,88,255)", "rgb(0,92,255)", "rgb(0,96,255)", "rgb(0,100,255)", "rgb(0,104,255)", "rgb(0,108,255)", "rgb(0,112,255)", "rgb(0,116,255)", "rgb(0,120,255)", "rgb(0,124,255)", "rgb(0,128,255)", "rgb(0,131,255)", "rgb(0,135,255)", "rgb(0,139,255)", "rgb(0,143,255)", "rgb(0,147,255)", "rgb(0,151,255)", "rgb(0,155,255)", "rgb(0,159,255)", "rgb(0,163,255)", "rgb(0,167,255)", "rgb(0,171,255)", "rgb(0,175,255)", "rgb(0,179,255)", "rgb(0,183,255)", "rgb(0,187,255)", "rgb(0,191,255)", "rgb(0,195,255)", "rgb(0,199,255)", "rgb(0,203,255)", "rgb(0,207,255)", "rgb(0,211,255)", "rgb(0,215,255)", "rgb(0,219,255)", "rgb(0,223,255)", "rgb(0,227,255)", "rgb(0,231,255)", "rgb(0,235,255)", "rgb(0,239,255)", "rgb(0,243,255)", "rgb(0,247,255)", "rgb(0,251,255)", "rgb(0,255,255)", "rgb(4,255,251)", "rgb(8,255,247)", "rgb(12,255,243)", "rgb(16,255,239)", "rgb(20,255,235)", "rgb(24,255,231)", "rgb(28,255,227)", "rgb(32,255,223)", "rgb(36,255,219)", "rgb(40,255,215)", "rgb(44,255,211)", "rgb(48,255,207)", "rgb(52,255,203)", "rgb(56,255,199)", "rgb(60,255,195)", "rgb(64,255,191)", "rgb(68,255,187)", "rgb(72,255,183)", "rgb(76,255,179)", "rgb(80,255,175)", "rgb(84,255,171)", "rgb(88,255,167)", "rgb(92,255,163)", "rgb(96,255,159)", "rgb(100,255,155)", "rgb(104,255,151)", "rgb(108,255,147)", "rgb(112,255,143)", "rgb(116,255,139)", "rgb(120,255,135)", "rgb(124,255,131)", "rgb(128,255,128)", "rgb(131,255,124)", "rgb(135,255,120)", "rgb(139,255,116)", "rgb(143,255,112)", "rgb(147,255,108)", "rgb(151,255,104)", "rgb(155,255,100)", "rgb(159,255,96)", "rgb(163,255,92)", "rgb(167,255,88)", "rgb(171,255,84)", "rgb(175,255,80)", "rgb(179,255,76)", "rgb(183,255,72)", "rgb(187,255,68)", "rgb(191,255,64)", "rgb(195,255,60)", "rgb(199,255,56)", "rgb(203,255,52)", "rgb(207,255,48)", "rgb(211,255,44)", "rgb(215,255,40)", "rgb(219,255,36)", "rgb(223,255,32)", "rgb(227,255,28)", "rgb(231,255,24)", "rgb(235,255,20)", "rgb(239,255,16)", "rgb(243,255,12)", "rgb(247,255,8)", "rgb(251,255,4)", "rgb(255,255,0)", "rgb(255,251,0)", "rgb(255,247,0)", "rgb(255,243,0)", "rgb(255,239,0)", "rgb(255,235,0)", "rgb(255,231,0)", "rgb(255,227,0)", "rgb(255,223,0)", "rgb(255,219,0)", "rgb(255,215,0)", "rgb(255,211,0)", "rgb(255,207,0)", "rgb(255,203,0)", "rgb(255,199,0)", "rgb(255,195,0)", "rgb(255,191,0)", "rgb(255,187,0)", "rgb(255,183,0)", "rgb(255,179,0)", "rgb(255,175,0)", "rgb(255,171,0)", "rgb(255,167,0)", "rgb(255,163,0)", "rgb(255,159,0)", "rgb(255,155,0)", "rgb(255,151,0)", "rgb(255,147,0)", "rgb(255,143,0)", "rgb(255,139,0)", "rgb(255,135,0)", "rgb(255,131,0)", "rgb(255,128,0)", "rgb(255,124,0)", "rgb(255,120,0)", "rgb(255,116,0)", "rgb(255,112,0)", "rgb(255,108,0)", "rgb(255,104,0)", "rgb(255,100,0)", "rgb(255,96,0)", "rgb(255,92,0)", "rgb(255,88,0)", "rgb(255,84,0)", "rgb(255,80,0)", "rgb(255,76,0)", "rgb(255,72,0)", "rgb(255,68,0)", "rgb(255,64,0)", "rgb(255,60,0)", "rgb(255,56,0)", "rgb(255,52,0)", "rgb(255,48,0)", "rgb(255,44,0)", "rgb(255,40,0)", "rgb(255,36,0)", "rgb(255,32,0)", "rgb(255,28,0)", "rgb(255,24,0)", "rgb(255,20,0)", "rgb(255,16,0)", "rgb(255,12,0)", "rgb(255,8,0)", "rgb(255,4,0)", "rgb(255,0,0)", "rgb(251,0,0)", "rgb(247,0,0)", "rgb(243,0,0)", "rgb(239,0,0)", "rgb(235,0,0)", "rgb(231,0,0)", "rgb(227,0,0)", "rgb(223,0,0)", "rgb(219,0,0)", "rgb(215,0,0)", "rgb(211,0,0)", "rgb(207,0,0)", "rgb(203,0,0)", "rgb(199,0,0)", "rgb(195,0,0)", "rgb(191,0,0)", "rgb(187,0,0)", "rgb(183,0,0)", "rgb(179,0,0)", "rgb(175,0,0)", "rgb(171,0,0)", "rgb(167,0,0)", "rgb(163,0,0)", "rgb(159,0,0)", "rgb(155,0,0)", "rgb(151,0,0)", "rgb(147,0,0)", "rgb(143,0,0)", "rgb(139,0,0)", "rgb(135,0,0)", "rgb(131,0,0)"];

const g_value = document.getElementById('g_value'),
	n_value = document.getElementById('n_value'),
	button_record = document.getElementById('button_record'),
	button_run = document.getElementById('button_run'),
	div_datapoints = document.getElementById('datapoints'),
	div_ball_pen = document.getElementById('div_ball_pen'),
	div_control = document.getElementById('controlcontainer'),
	div_canvas = document.getElementById('div_canvas');
	
var canvas = {width: 0, height: 0}
	
var	ball = {x: 0.5, dx: 0, ddx: 0, y: 0.5, dy: 0, ddy: 0},
    g = {x: 0, y: 0, alpha:0, mag: 0},     
    fric = 0.2;        

var map = {x: math.zeros([MAP_RES,MAP_RES]), y: math.zeros([MAP_RES,MAP_RES]), abs: math.zeros([MAP_RES,MAP_RES]), min:9999, max:-9999};
var dataset={x: [], y: []};
var ext_ctrl=false;
var state=0;
var gp = new gpr();

window.onmousedown = myDown;
window.onmouseup = myUp;
window.onmousemove = myMove;
window.addEventListener('resize', resizeCanvas, false);
window.addEventListener('scroll', resizeCanvas, false);
window.addEventListener('orientationchange', resizeCanvas, false);
window.addEventListener('devicemotion', deviceMotion, true);

resizeCanvas();
createmap();
drawmap();

//Service worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/pendulum/service-worker.js')
  .then(function(registration) {
    console.log('Registration successful, scope is:', registration.scope);
  })
  .catch(function(error) {
    console.log('Service worker registration failed, error:', error);
  });
}

function createmap() {
	const A=0.05;
	for (var i=0; i<MAP_RES; i++){
				for (var j=0; j<MAP_RES; j++){
					var temp=-math.exp(-((i/MAP_RES-0.5)*(i/MAP_RES-0.5)+(j/MAP_RES-0.5)*(j/MAP_RES-0.5))/A)*1;
					map.min=Math.min(map.min,temp);
					map.max=Math.max(map.max,temp);
					map.abs[i][j]=temp;
					map.x[i][j]=2/A*(i/MAP_RES-0.5)*temp;
					map.y[i][j]=2/A*(j/MAP_RES-0.5)*temp;
				}
	}
	
}

function drawmap() {
	var ctx = div_canvas.getContext("2d");
	for (var i=0; i<MAP_RES; i++){
				for (var j=0; j<MAP_RES; j++){
					ctx.beginPath();
					var temp=(map.abs[i][j]-map.min)/(map.max-map.min);
					ctx.fillStyle = COLORMAP[Math.floor(temp*255)];
					ctx.fillRect(i/(MAP_RES)*canvas.width, j/(MAP_RES)*canvas.height, canvas.width/MAP_RES+1, canvas.height/MAP_RES+1);
					ctx.stroke();
				}
	}
}
function deviceMotion(dme) {
	if (!ext_ctrl) {
	g.x=-dme.accelerationIncludingGravity.x;
	g.y=dme.accelerationIncludingGravity.y;
	g.mag=Math.sqrt(g.x*g.x+g.y*g.y);
	g.alpha=(Math.atan2(-g.x,g.y)+PI2)%PI2;;
	g_value.value="x:"+parseFloat(g.x).toFixed(2)+", y:"+parseFloat(g.y).toFixed(2);
	}
}


function resizeCanvas() {
	var ctx = div_canvas.getContext("2d");
		var actual_width;
	if (window.innerWidth<screen.width) {
		actual_width=window.innerWidth;
	} else{
		actual_width=screen.width;
	}
	
	canvas.width=actual_width;
	canvas.height=window.innerHeight-150;
	div_control.style.top=canvas.height+'px';
	
	var temp=canvas.height/2;
	var temp1=canvas.width/2;
	div_canvas.style.height=canvas.height+'px';
	div_canvas.style.webkitFilter = "blur(7px)";
	ctx.canvas.width = canvas.width;
	ctx.canvas.height = canvas.height;
	drawmap();

}

// main calculation of the animation using a particle and a vector
function calc(ugp) {
	var mapxidx=Math.max(0,Math.min(MAP_RES-1,Math.round(ball.x*(MAP_RES-1))));
	var mapyidx=Math.max(0,Math.min(MAP_RES-1,Math.round(ball.y*(MAP_RES-1))));
	if (ball.x<0)
	{
		ball.x=0;
		ball.dx=0;
		ball.ddx=0;
	}
	else if (ball.x>1)
	{
		ball.x=1;
		ball.dx=0;
		ball.ddx=0;
	}
	else
	{
		ball.ddx=g.x-fric*ball.dx+ugp+map.x[mapxidx][mapyidx];
		ball.dx+=ball.ddx*Ts;
		ball.x+=ball.dx*Ts;
	}
	
	if (ball.y<0)
	{
		ball.y=0;
		ball.dy=0;
		ball.ddy=0;
	}
	else if (ball.y>1)
	{
		ball.y=1;
		ball.dy=0;
		ball.ddy=0;
	}
	else
	{
		ball.ddy=g.y-fric*ball.dy+ugp+map.y[mapxidx][mapyidx];
		ball.dy+=ball.ddy*Ts;
		ball.y+=ball.dy*Ts;
	}
}

// animate
(function loop() {
  const Kd=1,Kp=1;
  // ugp=-Kd*dp-Kp*(p-PI);
  if (state==3) {
	  var gp_pred=gp.pred([p-g.alpha]);
	  ugp=g.mag*gp_pred-Kd*dp-Kp*error;
	  
  } else {
		ugp=0;
  }
  if (state==1)
  {
		  helper++;
		  if ((helper>20) && (dataset.x.length<=50)){
			  var length = dataset.x.push(p-g.alpha);
			  dataset.y.push(Math.sin(p-g.alpha));
			  draw_point(p-g.alpha);
			  n_value.value=length;
			  helper=0;
		  }
  }
	  
  
  calc(ugp);
  draw();
 
  requestAnimationFrame(loop)
  
})();

function draw() {
	var pos_ball={x: ball.x*(canvas.width-2*BALL_RADIUS), y: ball.y*(canvas.height-2*BALL_RADIUS)};
	div_ball_pen.style.webkitTransform = "translate("+pos_ball.x+"px,"+pos_ball.y+"px)";
	}

function draw_point(p_loc) {
  var pos_ball={x: max_length*Math.sin(p_loc)-5, y: max_length*Math.cos(p_loc)-5};
  var log = document.createElement('div');
  log.setAttribute("id", "div_ball");
  log.style.left=pos_ball.x+'px';
  log.style.top=pos_ball.y+'px';
  div_datapoints.appendChild(log);
}

function forceField(mx,my) {
	g.x=mx/canvas.width*20;
	g.y=my/canvas.height*20;
	g.mag=Math.sqrt(g.x*g.x+g.y*g.y);
	g.alpha=(Math.atan2(-g.x,g.y)+PI2)%PI2;
	
	//g_value.value="x:"+parseFloat(map.x[parseInt(g.x*MAP_RES)][parseInt(g.y*MAP_RES)]).toFixed(2)+", y:"+parseFloat(map.y[parseInt(g.x*MAP_RES)][parseInt(g.y*MAP_RES)]).toFixed(2);
	g_value.value="x:"+parseFloat(g.x).toFixed(2)+", y:"+parseFloat(g.y).toFixed(2);
	
}
	
function buttonTrain() {
	if ((state==0) && (dataset.x.length>0)){
	gp.X=dataset.x;
	gp.Y=dataset.y;
	// var dims = [
    // optimjs.Real(0, 5),
    // optimjs.Real(0,5),
	// optimjs.Real(0,5),
// ]
	// var solution = optimjs.dummy_minimize(helper, dims, 1000);
	// console.log(solution);
	// gp.sn=solution.best_x[0];
	// gp.sf=solution.best_x[1];
	// gp.l=solution.best_x[2];
	div_datapoints.textContent  = '';
	gp.train();
	for (var i=0; i<=PI2; i+=Math.PI/32){
		var pos_ball={x: max_length*Math.sin(i)-5, y: max_length*Math.cos(i)-5};
		var red=255/gp.sf/gp.sf*gp.variance([i]);
		var green=255-red;
		var log = document.createElement('div');
		log.setAttribute("id", "div_variance");
		log.style.left=pos_ball.x+'px';
		log.style.top=pos_ball.y+'px';
		log.style.background='rgb(' + red +',' + green + ',0)';
		div_datapoints.appendChild(log);
	}
	}
	//console.log(gp.pred([0,0]));
}

// function helper (x) {
	// return gp.loglik(x,gp.X,gp.Y);
// }

function buttonRun() {
	console.log(map.x)
	// if (state==0) {
		// button_run.value="Stop";
		// state=3;
	// } else if (state==3) {
		// button_run.value="Run controller";
		// state=0;
	// }
}

function buttonRecord() {

	if (state==0) {
		button_record.value="Stop";
		dataset={x: [], y: []};
		div_datapoints.textContent  = '';
		state=1;
	}  else if (state==1) {
		button_record.value="Record data";
		state=0;
	}
}

function myDown(e) {

	ext_ctrl=true;
    // tell the browser we're handling this mouse event
    //e.preventDefault();
    //e.stopPropagation();
		
    // get the current mouse position
    var mx = parseInt(e.clientX)-canvas.width/2;
    var my = parseInt(e.clientY)-canvas.height/2;
	
	if ((Math.abs(mx)<canvas.width/2) && (Math.abs(my)<canvas.height/2)){
	forceField(mx,my);
	}
    
}


// handle mouseup events
function myUp(e) {  

	ext_ctrl=false;
    // tell the browser we're handling this mouse event
    // e.preventDefault();
    // e.stopPropagation();
	forceField(0,0);

}


// handle mouse moves
function myMove(e) {
	if (ext_ctrl){
		e.preventDefault();
		e.stopPropagation();
			
		// get the current mouse position
    var mx = parseInt(e.clientX)-canvas.width/2;
    var my = parseInt(e.clientY)-canvas.height/2;
		
		forceField(mx,my);
	}
}