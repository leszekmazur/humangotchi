appka.factory('TimeFactory', function() {
	var Ti = function(){
		this.min = 0;
		this.hou = 0;
		this.day = 0;
		this.wee = 0;
		this.mon = 0;
		this.yea = 0;
		this.mem = {da:0,we:0,mo:0,ye:0};
	}
	Ti.prototype.tick = function(pauze){
		if(pauze){
			return;
		}
		this.min++;
		if(this.min==60){
			this.min = 0;
			this.hou++;
			if(this.hou==24){
				this.hou = 0;
				this.day++;
				this.mem.da++;
				if(this.day==7){
					this.day = 0;
					this.wee++;
					this.mem.we++;
					if(this.wee==4){
						this.wee = 0;
						this.mon++;
						this.mem.mo++;
						if(this.mon==12){
							this.mon = 0;
							this.yea++;
							this.mem.ye++;
						}
					}
				}
			}
		}
	}
	return Ti;
});