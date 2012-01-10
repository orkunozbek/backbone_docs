window.jsonData = [{
    "name": "oi.mp3",
    "size": 2300
},
{
	"name" : "fener.gif",
	"size" : 1400
},
{
	"name" : 'oi15.wmw',
	"size" : 5500
}];


$(document).ready(function() {
	
	window.Document = Backbone.Model.extend({

	});
	
	window.Documents = Backbone.Collection.extend({
		model: Document,
		url: '/',
		
		totalSize: function() {
			return this.models.reduce(function(sum, doc) {return sum + doc.get('size')},0);
		}
	});
	
	window.documents = new Documents();
	
	window.DocumentView = Backbone.View.extend({
		tagName: 'li',
		className: 'document-li',
		template: _.template($("#document-template").html()),
		
		initialize: function() {
			_.bindAll(this, 'render');
			this.model.bind('change', this.render);
		},
		
		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		}
	});
	
	window.DocumentListView = DocumentView.extend({
		events: {
			"click #clickable" : "select"
		},
		
		select: function(e) {
			this.collection.trigger('select', this.model);
		}
	});
	
	window.DocumentsView = Backbone.View.extend({
		el: $("#doc-list-container"),
		template: _.template($("#document-list-template").html()),
		
		initialize: function() {
			_.bindAll(this, 'render', 'addOne', 'addAll', 'highlight');
			this.collection = documents;
			this.collection.bind('reset', this.addAll);
			this.collection.bind('all', this.render);
			this.collection.bind('select', this.highlight);
			
			this.collection.reset(jsonData);
		},
		
		render: function() {
			this.$('#doc-stats').html(this.template({
				count: this.collection.length,
				totalSize: this.collection.totalSize()
			}));
			
			return this;
		},
		
		addOne: function(doc) {
			var view = new DocumentListView({
				model: doc,
				collection: this.collection
			});
			this.$("#doc-list").append(view.render().el);
		},
		
		addAll: function() {
			this.$("#doc-list").empty();
			this.collection.each(this.addOne);
		},
		
		highlight: function(model) {
			console.log("HI OI from Documents View " + model.get('name'));
			
		}
	});
	
	var docsView = new DocumentsView();
	
});