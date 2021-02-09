// by Thomas Beckers, 2020
// t.beckers@tum.de

class gpr {
	constructor() {
    this.kernel = this.kernel_sq;
	this.X = [];
	this.Y = [];
	this.sf = 1;
	this.sn = 0.0001;
	this.l =1;
	this.min_noise = 1/1000000;
  }
	
  
	test () {
		return this.X;
	}
	
	kernel_wrapper(a,b,sf,l,sn,modus){
		var la=a.length;
		var lb=b.length;
		var out=math.zeros([la,lb]);
		
		if (modus==1){	
			for (var i=0; i<la; i++){
				for (var j=i; j<lb; j++){
					if (i==j){
						out[i][j]=this.kernel(a[i],b[j],sf,l)+sn*sn+this.min_noise;
					} else{
						out[i][j]=this.kernel(a[i],b[j],sf,l);
					}
					out[j][i]=out[i][j];
				}
			}
		} else if (modus==2){
			for (var i=0; i<la; i++){
					out[i][i]=this.kernel(a[i],b[i],sf,l);
			}
		} else {
			for (var i=0; i<la; i++){
				for (var j=0; j<lb; j++){
					out[i][j]=this.kernel(a[i],b[j],sf,l);
				}
			}
		}
		return out;
	}
	
	kernel_sq(a,b,sf,l){
		//var d1=Math.sin(Math.abs(a[0]-b[0])/2);
		var d=(a-b);
		return sf*sf*math.exp(-d*d/l/l);
	}
	
	
	train (){
		
		var K=this.kernel_wrapper(this.X,this.X,this.sf,this.l,this.sn,1);
		this.Kinv= math.inv(K);
		
		this.weights = math.multiply(this.Kinv,math.transpose(this.Y));
		
	}
	
	
	pred (x){
		var kvec= this.kernel_wrapper(x,this.X,this.sf,this.l,this.sn,0);
		return math.multiply(kvec,this.weights);
	}
	
	variance (x){
		var kvec= this.kernel_wrapper(x,this.X,this.sf,this.l,this.sn,0);
		return this.sf*this.sf-math.multiply(math.multiply(kvec,this.Kinv),math.transpose(kvec));
	}
	
	loglik (x,X,Y){
		var sn=x[0];
		var sf=x[1];
		var l=x[2];
		var K=this.kernel_wrapper(X,X,sf,l,sn,1);
		var Kinv= math.inv(K);
		
		return math.multiply(math.multiply(math.transpose(Y),Kinv),Y) + math.log(math.det(K)); //log(2*pi)
	}
	

	
	
}