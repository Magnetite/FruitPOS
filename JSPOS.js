
//rg is short for register

var rg = {
    
    total: 0,
    subtotal: 0,
    tax: 0.07,
	taxSub: 0,
    paid: 0,
    change: 0,
	dict: {},
	lineNum: 0,
	dup: 1,
	receiptStr: "",
	menuOb: {},

    
	
	
	
    ring_up: function(a){                          //<= updates total and subtotal, parameter 'a' is an Object
        
		
		
		
			//Modify this loop?  1/14 
			while(rg.dup > 0){
			
			rg.subtotal = rg.money_format(rg.subtotal + a.price, 'r');  //<= Update subtotal every iteration
		
						if ( rg.dict.hasOwnProperty(a.id) )
						{
						
							 if (rg.dict[a.id].stock === 0 ){
								alert("Out of stock!");
								return;
							 } else if (rg.dict[a.id].stock - rg.dup < 0){
								
								//1/14
								alert("Not Enough Stock!");
								return;
							 
							 } else {
								rg.dict[a.id].stock -= 1;
								}
								
						} else {
							
							a.stock--;
							rg.dict[a.id] = a;
							//rg.dict[a.id].stock -= 1;  //Check for non zero stock!  1/14
						}
						
						
		
						rg.lineNum++;
						rg.prints(a, "list");
						rg.total_amt();  //1/14
						
						rg.dup -= 1;
						
				}	
				
				

					rg.dup = 1;
        
        
		
		
        return rg;
    },
	
	duplicate: function(){
	
		rg.dup = prompt("Enter how many:", "");
		return rg;
	
	},
	
	
	exact_change: function(a){
	
		var v = 0;
	
		if (arguments.length === 0){
			v = prompt("Enter exact change:", "");
			if (v = ""){return rg;}
		} else {
			v = a;
		}
		
		if ( v > 0 ){
			rg.paid = rg.money_format(rg.paid + parseFloat(v));
			rg.total_amt();
			
			rg.prints("Cash:   $" + rg.paid, "list", 'a');
		}
		return rg;
	
	},
	
	nearest_amount: function(nearest){
	 //nearest parameter represents cents.
	
		var am =  Math.round(rg.total * 100);
		var res =  am + nearest - (am % nearest);
		
		rg.exact_change( res/100 );
		
		return rg;
		
	
	},
	
	cash_button: function(cash){
	
		if ( cash >= (rg.total - rg.paid) ){
			rg.exact_change(cash);
		} else {
			alert("Not enough to cover payment");
		}
	
	},
	
	
	total_amt: function(){                        //<= Calculates and prints totals 
    
		
		if ( rg.subtotal >= 0){
		rg.taxSub = rg.money_format(rg.subtotal * rg.tax, 'r'); 
		}
		rg.total = rg.money_format(rg.subtotal + rg.taxSub, 'r');
		
		rg.printTotals("total","subtotal","tax","paid","due","change");
		
		
		return rg;
	},
	
	printTotals: function(id1,id2,id3,id4,id5,id6){
	
		rg.prints("Total: " + rg.total, id1);
		rg.prints("Subtotal: " + rg.subtotal, id2);
		rg.prints("Tax:  " + rg.money_format(rg.taxSub, 'r'), id3); 
		rg.prints("Paid:  " + rg.paid, id4);
		
		if ((rg.total - rg.paid) >= 0){
		rg.prints("Due:  " + rg.money_format(rg.total - rg.paid, 'r'), id5);
		rg.prints("Change:  " + rg.money_format(0, 'r'), id6);
		
		} else {
		rg.prints("Change:  " + rg.money_format(Math.abs(rg.total - rg.paid), 'r'), id6);
		rg.prints("Due:  " + rg.money_format(0, 'r'), id5);
		}
	
	},
	
	amount_over: function(over){
	
	rg.exact_change(rg.total + over);
	
	},
	
	
	
	change_price: function(a){
		
		r = prompt("Enter a override price:","");
		
		
		rg.test(r);
		//rg.test(a === null);  //<= Added 3-1-2017
		if (a == null){ return rg;}
		
		a.price = r;
		
		rg.subtotal = rg.money_format( rg.subtotal - rg.money_format(parseFloat(a.price), 'c' ) , 'c');   //<= todo Need to fix rounding error
		rg.total_amt(); 
		return rg;
	},
	
	adjust_price: function(){
	
		var r = 0;
		
		r = parseFloat(prompt("Enter Price Adjustment:","Value to subtract") );
		
		
		rg.test(r);
		if ( isNaN(r) ){ return;}
		
		rg.subtotal = rg.money_format( rg.subtotal + rg.money_format(r * -1, 'c' ) , 'c');   //<= todo Need to fix rounding error
		
		rg.lineNum++;
		rg.prints({name:"Adjustment", price: r * -1, id:0}, "list");
		rg.total_amt(); 
		return rg;
	},
	
	
	
	


	
	
	
	tableMake: function(Arr){
	
		var heading = "";
		var bodyLine = "";
		var body = "";
		
		$("#output").show();
		
		Object.keys(Arr[0]).map(function(a){
		
			heading += "<th>" + a + "</th>";
		});
		
		
		Arr.forEach(function(a){
			
			
			Object.values(a).map(function(b){ 

				//rg.test(typeof b === typeof {});
			
				bodyLine += "<td>" + b + "</td>";
			});
			
			body += "<tr>" + bodyLine + "</tr>";  //bug fixed, 
			bodyLine = "";
		});
		
		
		
		rg.docWrite("<tr>" + heading + "</tr>" + body, "output", 1);
		return rg;
	
	
	},
	
	RowPrint: function(msg){
	
		if (typeof (document.getElementById('outputLine').value !== 'undefined') && typeof (document.getElementById('outputLine').value !== null) ){
		
			document.getElementById('outputLine').innerHTML = "<br>" + msg;
			
		
		} else {
		
			console.log(msg);
		}
	
	
	},
	
	test: function(a){
	
	if (a === null && typeof a === "object" || a === undefined || a === "" || a === true){
	
		return rg;
	}
	
	},
    
    
	
	
	
    sale_complete: function(){	
	
		var str = rg.object_str();
	
		if (rg.paid >= rg.total){
	
				rg.ajax("u=" + str,() => console.log("Request Successful") );
				
		} else { 
		
		alert("Not enough funds!");
		return;
		
		}
		
		Object.values(rg.dict).forEach(function(cur){  
		
		rg.buttonBadge(cur);
		
		});
		
		rg.reset();
	
        return rg;
    },
	
	reset: function(){
	
		rg.total = 0;
        rg.subtotal = 0;
        rg.tax_elgible = 0;
		rg.taxSub = 0;
        rg.paid = 0;
        rg.change = 0;
		
		rg.dict = {};
		rg.lineNum = 0;
		
		
		rg.clear("list","");
		rg.clear("subtotal", "Subtotal: 0");     
		rg.clear("total", "Total: 0");
		rg.clear("paid", "Paid:  0");
		rg.clear("due", "Due:  0");
		rg.clear("tax", "Tax:  0");
		rg.clear("change", "Change:  0");
		
		return rg;
		
	
	
	},
	
	buttonBadge: function(b){

				if (b.stock < 20){
				
					$("#" + b.id).removeClass("btn-primary");
					$("#" + b.id).addClass("btn-danger");
					
				} else {
				
					$("#" + b.id).removeClass("btn-danger");
					$("#" + b.id).addClass("btn-primary");
				}
				
				
				$("#" + b.id).children().text(b.stock);
				
				
		return rg;
	
	},
	
	receipt: function(){
	
		rg.toggleView();
		
		var receiptArr = [];
		var recOb = {};
		var sub = 0;
		var len = 0;
	
		Object.values(rg.dict).forEach(function(cur, ind, ar){ 
		
		recOb.Name = ar[ind].name;
		recOb["Unit Cost"] = ar[ind].price;
		recOb.Amount = ar[ind].max - ar[ind].stock;
		recOb["Amount Cost"] = rg.money_format(ar[ind].price * recOb.Amount, "r"); 
		sub += recOb["Amount Cost"]; 
		sub = rg.money_format(sub,"r");
		recOb.Subtotals = sub;
		
		receiptArr[ind] = recOb;
		
		recOb = {};
		len++;
		
			
		});
		var due = 0;
		var change = 0;
		var tst = rg.money_format(rg.total - rg.paid); 
		
		if ( tst > 0){
		
			due = tst;
		} else {
		
			change = Math.abs(tst);
		}
		
		var d = Date().split(" ");
		
		receiptArr[len] = {"name": "--", "s1":"--","s2":"--","s3":"--", "num":"--"};
		receiptArr[len + 1] = {"name": "<b>Tax:</b>","s1":"--","s2":"--","s3":"--","num":rg.taxSub};
		receiptArr[len + 2] = {"name": "<b>Total:</b>", "s1":"--","s2":"--","s3":"--", "num":rg.total};
		receiptArr[len + 3] = {"name": "<b>Paid:</b>","s1":"--","s2":"--","s3":"--", "num":rg.paid};
		receiptArr[len + 4] = {"name": "<b>Due:</b>", "s1":"--","s2":"--","s3":"--", "num":due};
		receiptArr[len + 5] = {"name": "<b>Change:</b>","s1":"--","s2":"--","s3":"--", "num":change};
		receiptArr[len + 6] = {"name": "<b>Date & Time:</b>","s1":d[1],"s2":d[2],"s3":d[3], "num":d[4]};
	
	
		
		rg.tableMake(receiptArr);
		
	
		return rg;
	
	},
	
	toggleView: function(){
	
		$('.container').toggle();
		$('#nav').toggle();
		$('#printer').toggle();
		$('#NextOrder').toggle();
		$('#rgtotals').toggle();
		$('#output').toggle().html("");
	},
	
	docWrite: function(out, id, mode){
	
		var doc = document;
		
		if (mode){
		
			doc.getElementById(id).innerHTML += out;
			//rg.test_str += out;
		} else {
		
			doc.getElementById(id).innerHTML = out;
		}
		
		return rg;
		
	
	},
	
	
	
	
	
	
	money_format: function(a, mode){                   //<= Rounds fractional cent
	
		if (mode === 'r'){
			return (Math.round(a * 100))/100;
		} 
		else if ( mode === 'c'){
			return (Math.ceil(a * 100))/100;
		} 
		
		return (Math.floor(a * 100))/100;
		
	},
	
	
	prints: function(out, id, mode){  //<= Outputs to HTML
	
		if (mode == 'a'){
			rg.docWrite("<div><button>" + out + "</button></div>", id, 1);
		} else if (typeof(out) === "object" && !(typeof(out) == "string")){
		
		var outStr = "<div id = '" +  rg.lineNum + "a'>";  //<= Start div
		
		outStr += "<button onclick='rg.delTag(\"" + rg.lineNum  + "a\",\"" + out.price + "\", " + out.id + ")'>"; //<= Button with old onclick function
		
		outStr += out.name + "</button>"; //<= end of button
		
		outStr += "<button onclick='rg.change_price(" +  ")'>$" + out.price + "</button></div>" //<= todo: fix this, so it updates checkout price
		
			rg.docWrite( outStr , id, 1); 
			
		} else {
			rg.docWrite(out, id);
		}
		
		return rg;
		
	},
	
	clear: function(id, txt){
	
		document.getElementById(id).innerHTML = txt;
		
		return rg;
	},
	
	onklick: function(id, action){   
	
		if (!document.getElementById(id)){
			
			return rg;
		
		}
	
		document.getElementById(id).onclick = action;
		
		return rg;
	},
	
	delTag: function(id, price, index){
		
		//todo: MAKE A WAY OF KEEPONG TRACK OF DISCOUNTS!
		if (index !== 0){
		
		rg.dict[index].stock += 1; 
		
		if (rg.dict[index].stock === rg.dict[index].max){ delete rg.dict[index]};
		}
	
		var del = document.getElementById(id);
		del.parentNode.removeChild(del);
		
		if (price){                    //<= update price after taking off item
		rg.subtotal = rg.money_format( rg.subtotal - parseFloat(price) , 'r');  //<= Need to fix rounding error, so it subtracts like it should
		
		rg.total_amt();
		}  
		
		
		
		return rg;
	},
	
	object_str: function(mode)
	{
	
		var len = Object.keys(rg.dict).length;
		var OutStr = "";
		
		for (var i = 0; i < len; i++){
		
			if (i > 0){ 
				OutStr += "-";
			}
			
			if (!mode){
			OutStr += Object.keys(rg.dict)[i] + "-" + rg.dict[Object.keys(rg.dict)[i]].stock; 
			} else {
			
			//Functionality for the receipt function, Need to add how much of each product bought
			OutStr += rg.dict[Object.keys(rg.dict)[i]].name + "-" + rg.dict[Object.keys(rg.dict)[i]].price; 
			}
		}
		
		//returns OutStr instead of rg
		return OutStr;
	
	},
	
	ajax: function(a, callback){
	
	//TODO: Add new functionality using Fetch
	
	},
	
	prompt: function(){
	
		//TODO: Modal replacement for the browser prompt
		
		return rg;
		
	},
	
	alert: function(){
		
		//TODO: Modal replacement for the browser alert box
		
		return rg;
	}
	
	
	   
   
    
};



