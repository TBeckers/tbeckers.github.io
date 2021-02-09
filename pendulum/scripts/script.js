const Ts=0.03;
const BALL_RADIUS=15;
const PI2=2*Math.PI;

const g_value = document.getElementById('g_value'),
	n_value = document.getElementById('n_value'),
	button_record = document.getElementById('button_record'),
	button_run = document.getElementById('button_run'),
	div_datapoints = document.getElementById('datapoints'),
	div_ball_pen = document.getElementById('div_ball_pen'),
    div_line = document.getElementById('div_line'),
	div_canvas = document.getElementById('div_canvas');
	
var canvas = {width: 0, height: 0}
	
var	ddp = 0,
    dp = 0,       // some vector
    p = 0.5*Math.PI,   // some position
    g = {x: 0, y: 10, alpha:0, alpha_s:0, mag: 0},     	// some gravity
    fric = 0.2;         // friction/absorption

var max_length;
var variances=[];

var dataset={x: [], y: []};
var ext_ctrl=false;
var state=0;
var helper=0;
var helper2=0;
var gp = new gpr();

window.onmousedown = myDown;
window.onmouseup = myUp;
window.onmousemove = myMove;
window.addEventListener('resize', resizeCanvas, false);
window.addEventListener('scroll', resizeCanvas, false);
window.addEventListener('orientationchange', resizeCanvas, false);
window.addEventListener('devicemotion', deviceMotion, true);

resizeCanvas();
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

function deviceMotion(dme) {
	if (!ext_ctrl) {
	g.x=dme.accelerationIncludingGravity.x;
	g.y=dme.accelerationIncludingGravity.y;
	g.mag=Math.sqrt(g.x*g.x+g.y*g.y);
	g.alpha=(Math.atan2(-g.x,g.y)+PI2)%PI2;;
	g_value.value="x:"+parseFloat(g.x).toFixed(2)+", y:"+parseFloat(g.y).toFixed(2);
		var error=(g.alpha-helper2);
	  if (error>Math.PI){
		error=error-PI2;  
	  } else if (error<-Math.PI){
		error=error+PI2;  
	  }
    g.alpha_s=(error)/10+helper2;
	g.alpha_s=(g.alpha_s+PI2)%PI2;
		div_datapoints.style.webkitTransform = 'rotate(-'+g.alpha_s+'rad)'; 
		helper2=g.alpha_s;
	}
}


function resizeCanvas() {
		var actual_width;
	if (window.innerWidth<screen.width) {
		actual_width=window.innerWidth;
	} else{
		actual_width=screen.width;
	}
	
	canvas.width=actual_width;
	canvas.height=window.innerHeight-150;
	
	var temp=canvas.height/2;
	var temp1=canvas.width/2;
	div_line.style.top=temp+'px';
	div_datapoints.style.top=temp+'px';
	div_line.style.left=temp1+'px';
	div_canvas.style.height=canvas.height+'px';
	
	max_length=Math.min(canvas.height,canvas.width)/2-BALL_RADIUS;
	div_line.style.height=max_length+"px";
}

// main calculation of the animation using a particle and a vector
function calc(ugp) {
	ddp=-g.mag*Math.sin(p-g.alpha)-fric*dp+ugp;
	dp+=ddp*Ts;
	p+=dp*Ts;
	p=p%PI2;
	if (p<0){
		p+=PI2;
	}
}

// animate
(function loop() {
  const Kd=1,Kp=1;
  // ugp=-Kd*dp-Kp*(p-PI);
  if (state==3) {
	  var gp_pred=gp.pred([p-g.alpha]);

	  var des=(g.alpha+Math.PI)%PI2;
	  var error=(p-des);
	  if (error>Math.PI){
		error=p-des-PI2;  
	  } else if (error<-Math.PI){
		error=p-des+PI2;  
	  }
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
	var pos_ball={x: max_length*Math.sin(p)+canvas.width/2-BALL_RADIUS, y: max_length*Math.cos(p)+canvas.height/2-BALL_RADIUS};
	div_ball_pen.style.webkitTransform = "translate("+pos_ball.x+"px,"+pos_ball.y+"px)";
	div_line.style.webkitTransform = 'rotate(-'+p+'rad)';
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
	g.alpha=(Math.atan2(mx,my)+PI2)%PI2;
	g.mag=10;
	g.x=g.mag*Math.sin(-g.alpha);
	g.y=g.mag*Math.cos(g.alpha);
	g_value.value="x:"+parseFloat(g.x).toFixed(2)+", y:"+parseFloat(g.y).toFixed(2);
	div_datapoints.style.webkitTransform = 'rotate(-'+g.alpha+'rad)'; 
	
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
	if (state==0) {
		button_run.value="Stop";
		state=3;
	} else if (state==3) {
		button_run.value="Run controller";
		state=0;
	}
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