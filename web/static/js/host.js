var root_url = "http://immense-taiga-8599.herokuapp.com/"

function isNumeric(n){
	return !isNaN(parseFloat(n)) && isFinite(n)
}

function decode(choice){
	if (choice == "w") {return "waiting"} 
	else if (choice == "m") {return "messaged"}
	else if (choice == "s") {return "seated"}
	else return "unknown"
}

var elementInFocus = null;

var Party = Backbone.Model.extend({
	create: function() {
		var thisModel = this;
		// first validate the form
		if ( ! isNumeric (this.attributes.size) || ! isNumeric (this.attributes.number) ) {
			console.log("Needs to be numeric!");
			return false;
		}
		else{ 
			$.ajax({
		  		type:"POST",
		  		url: root_url+"party/",
		  		dataType: "json",
		  		data:this.attributes,
				async: false,
				success: function(data) {
				    thisModel.set({'id':data});
				  }
			});
			return true;
		}
	},

	// this saves the changes
	save: function() {
		var thisModel = this;
		$.ajax({
	  		type:"POST",
	  		url: root_url+"party/"+thisModel.get('id'),
	  		dataType: "json",
	  		data:this.attributes,
			success: function(data) {
			    thisModel.set({'id':data});
			  }
		})
	}
		
	
});
var PartyList = Backbone.Collection.extend({
	url:root_url+"parties/"
});

var ModalView = Backbone.View.extend({
	// this renders a party as a modal
	
})

var PartyView = Backbone.View.extend({
	tagName:'tr',
	id:'party-view',
	className:'party',
	
	events: {
		 'click':'focus'
	},
	
	initialize: function(){
		this.model.on('change', this.render, this);
	},
	
	render: function() {
		console.log('render!');
		var id = this.model.get('id');
		var name =this.model.get('name');
		var size = this.model.get('size');
		var number = this.model.get('number');
		var status = this.model.get('status');
		var html =   "<td>" + id + "</td>"
					+ "<td>" + name + "</td>"
					+ "<td>" + size + "</td>"
					+ "<td>" + decode(status) + "</td>";
					
		this.$el.html(html);
		return this;
	},
	
	focus: function(){
		elementInFocus = this.model;
		$('#myModal').modal('show');
		$("#myModal span#id").text(this.model.get('id'));
		$("#myModal #name").val(this.model.get('name'));
		$("#myModal #number").val(this.model.get('number'));
		$("#myModal #size").val(this.model.get('size'));
		
		var status = decode(this.model.get('status'));
		$("#myModal #status").text(status);
		
		if (status == "waiting"){
			console.log(status);
			$('#sendSMS').button('reset');
			$('#seat').button('reset');
			
		} else if (status == "messaged") {
				console.log(status);
			$('#sendSMS').button('Send again');
			$('#seat').button('reset');
		}
		else if (status == "seated"){
				console.log(status);
			$('#sendSMS').button('Send again');
			$('#seat').button('toggle');
		}
	}
});

var PartyListView = Backbone.View.extend({
	tagName: 'tbody',
	el:$('#party-list'),

	initialize: function() {
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
	},
	
	render: function() {
		this.addAll();
		return this;
	},
	
	addAll: function() {
		this.collection.forEach(this.addOne, this);
	},
	
	addOne: function(party){
		var partyView = new PartyView({model:party});
		this.$el.append(partyView.render().el);
	}

});

var App = new (Backbone.View.extend({
	el: $("#hostapp"),
	
	events: {
      "click #add":  "newParty",
	  "click #sendSMS" : "sendSMS",
	  "click #seat" : "seat"
    },
	
	initialize: function(){
		this.partyList = new PartyList();
		this.partyListView = new PartyListView({collection:this.partyList});
		this.partyList.fetch();
	},
	
	newParty: function(e){
		e.preventDefault();
		size = $('#new-size').val();
		name = $('#new-name').val();
		number = $('#new-number').val();
		newParty = new Party({name:name, size:size, number:number, status:"w"});
		if (newParty.create()){
			this.partyList.add(newParty);
		}
		$('#new-size').val("");
		$('#new-name').val("");
		$('#new-number').val("");
		
	},
	
	sendSMS: function(e){
		$("#sendSMS").button('loading');
		id=elementInFocus.get('id');
		$.ajax({
			type:"POST",
			url: root_url+"/sms/",
			data:{'id':id},
			success: function(response) {
				$("#sendSMS").button('complete');
				$("#sendSMS").prepend('<i class="icon-comment icon-white"></i> ');
				elementInFocus.set("status", 'm');
				$("#myModal #status").text('messaged');
		  	}
		})
	},
	
	seat: function(e){
		console.log('seat!');
		id=elementInFocus.get('id');
		$.ajax({
			type:"POST",
			url: root_url+"/seat/",
			data:{'id':id},
			success: function(response) {
				elementInFocus.set("status", "s");
				$("#myModal #status").text('seated');
		  	}
		})
		
	}
	
}));


$(function() {
});