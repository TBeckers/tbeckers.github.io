// by Thomas Beckers, 2020
// t.beckers@tum.de

class gpr {
	constructor(ELEMENTS,N_ANIMATION_STEPS,x_test) {
    this.kernel = this.kernel_sq;
	this.X = [];
	this.Y = [];
	this.ELEMENTS=ELEMENTS;
	this.GaussRandom = this.getGaussSphere_wrapper(1,3);
	this.x_test=x_test;
	this.min_noise = 1/1000000;
	this.n_samples=0;
	this.N_ANIMATION_STEPS = N_ANIMATION_STEPS;

	this.getGaussSphere(10);
  }
	
	set kernel_fcn(kernel_name) {
		console.log(kernel_name);
		if (kernel_name=='kernel_sq'){
			this.kernel=this.kernel_sq;
		} else if (kernel_name=='kernel_quad'){
			this.kernel=this.kernel_quad;
		} else if (kernel_name=='kernel_lin'){
			this.kernel=this.kernel_lin;
		} else if (kernel_name=='kernel_mat'){
			this.kernel=this.kernel_mat;
		} else if (kernel_name=='kernel_per'){
			this.kernel=this.kernel_per;
		} else {
			this.kernel=this.kernel_sq;
		}
	}
	
	set X_data(X) {
		this.X=X;
	}
	
	set Y_data(Y) {
		this.Y=Y;
	}

	new_random_number(){
		if (this.n_samples>0){
		this.GaussRandom = this.getGaussSphere_wrapper(this.n_samples,this.N_ANIMATION_STEPS);
		}
	}
  
	choleskyDecomposition(matrix) {
		// Argument "matrix" can be either math.matrix or standard 2D array
		const A = math.matrix(matrix);
		// Matrix A must be symmetric
		//console.assert(math.deepEqual(A, math.transpose(A)));
	  
		const n = A.size()[0];
		// Prepare 2D array with 0
		const L = new Array(n).fill(0).map(_ => new Array(n).fill(0));
	  
		d3.range(n).forEach(i => {
		  d3.range(i+1).forEach(k => {
			const s = d3.sum(d3.range(k).map(j => L[i][j]*L[k][j]));
			L[i][k] = i === k ? math.sqrt(A.get([k, k]) - s) : 1/L[k][k] * (A.get([i, k]) - s);
		  })
		});
		return L;
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
		var d=a-b;
		return sf*sf*math.exp(-d*d/l/l);
	}
	
	
	kernel_per(a,b,sf,l){
		var d=math.sin(math.pi*math.abs(a-b)/0.4)
		return sf*sf*math.exp(-2/l/l*d*d);
	}
	
	kernel_mat(a,b,sf,l){
		return sf*sf*math.exp(-math.abs(a-b)/l);
	}
	
	kernel_lin(a,b,sf,l){
		return sf*sf*a*b+l;
	}
	
	kernel_quad(a,b,sf,l){
		var d=a*b+l;
		return sf*sf*d*d;
	}
	
	pred (x,sn,sf,l,with_samples){
		var lX=this.X.length;
		
		var K=this.kernel_wrapper(this.X,this.X,sf,l,sn,1)
		var Kinv= math.inv(K);
		var kvec= this.kernel_wrapper(x,this.X,sf,l,sn,0);
		var kmut = math.multiply(kvec,Kinv);
		var mean_int = math.multiply(kmut,math.transpose(this.Y));
		
		var ll_int = this.loglik2(sn,sf,l,K,Kinv);

		//
		var sample_int = [];
		if (with_samples==1){
			var sigma_mat = math.subtract(this.kernel_wrapper(x,x,sf,l,sn,0),math.multiply(kmut,math.transpose(kvec)));
			var sigma_int = math.sqrt(math.diag(sigma_mat));
			var chol = this.choleskyDecomposition(math.add(sigma_mat,math.multiply(math.identity(this.ELEMENTS+1),0.0000000001)));
			var chol_ran = math.multiply(chol,this.GaussRandom);
			for (let j = 0; j < this.n_samples*this.N_ANIMATION_STEPS; j += 1) {
			sample_int[j] = math.add(mean_int,math.squeeze(math.column(chol_ran,j)));
			}
		} else {
			var sigma_int = math.sqrt(math.subtract(math.diag(this.kernel_wrapper(x,x,sf,l,sn,2)),math.diag(math.multiply(kmut,math.transpose(kvec)))));
		}
		return {
			mean: mean_int,
			sigma: sigma_int,
			ll: ll_int,
			sample: sample_int,
		};
	}
	
	loglik (x,X,Y){
		var sn=x[0];
		var sf=x[1];
		var l=x[2];
		var lY=Y.length;
		var K=this.kernel_wrapper(X,X,sf,l,sn,1);
		var Kinv= math.inv(K);
		
		return 0.5 * (math.multiply(math.multiply(math.transpose(Y),Kinv),Y) + math.log(math.det(K)) + lY*0.79817986); //log(2*pi)
	}
	
	loglik2(sn,sf,l,K,Kinv){
	
		var lY=this.Y.length;
		
		return 0.5*(math.multiply(math.multiply(math.transpose(this.Y),Kinv),this.Y)+math.log(math.det(K))+lY*0.79817986)
	}

	
	getNormallyDistributedRandomNumber() {
		const u1 = Math.random();
		const u2 = Math.random();
		
		return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
	}
	
	getGaussRandom(ELEMENTS,n) {
		const generatedNumbers = [];
		for (let i = 0; i < ELEMENTS+1; i += 1) {
			generatedNumbers[i]=[];
			for (let j = 0; j < n; j += 1) {
			generatedNumbers[i][j]=this.getNormallyDistributedRandomNumber();
			}	
		}
		
		return generatedNumbers;
	}

	getGaussSphere_wrapper(n_samples,n){
		var ret = this.getGaussSphere(n); 
		for (let i = 1; i < n_samples; i += 1) {
			ret=math.concat(ret,this.getGaussSphere(n))
			}	
		return ret;
	}

	//Based on:
	//Philipp Hennig
	//Animating Samples from Gaussian Distributions.
	//Technical Report No. 8 of the Max Planck Institute for Intelligent Systems.
	//September 2013

	getGaussSphere(n) {
		var x = this.getGaussRandom(this.ELEMENTS,1);
		var r = math.sqrt(math.sum(math.square(x)));
		x = math.divide(x,r);
		var t = this.getGaussRandom(this.ELEMENTS,1);
		t = math.subtract(t,math.multiply(math.squeeze(math.multiply(math.transpose(t),x)),x));
		t = math.divide(t,math.sqrt(math.sum(math.square(t))));

		var s = math.range(0,2*Math.PI,2*Math.PI/n);

		const t_new = []; 
		for (let i = 0; i < this.ELEMENTS+1; i += 1) {
			t_new[i]=math.multiply(s,math.squeeze(math.row(t,i)));
		}	
		var ret = math.multiply(r,this.exp_map(x,t_new,n));
		ret=ret._data;
		return ret
	}

	exp_map(mu,E,n){
		var theta = math.sqrt(math.sum(math.square(E)));
		var tmp = math.dotDivide(math.sin(theta),theta);

		const repmat = []; 
		const mu_theta = []; 

		for (let i = 0; i < this.ELEMENTS+1; i += 1) {
			repmat[i]=tmp;
			mu_theta[i]=math.multiply(math.squeeze(math.row(mu,i)),math.cos(theta));
			}	
		
		var M = math.matrix(math.add(mu_theta,math.dotMultiply(E,repmat)));

		for (let i = 0; i < n; i += 1) {
			if (theta.subset(math.index(i))<1e-7){
				M.subset(math.index(math.range(0,this.ELEMENTS+1),i),mu);
			}
		}	
		return M;
	}
	
	
}