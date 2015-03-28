var UI = function() {
	var self 	= this,
		$chat 	= $('#pekachat');

	this.node = {};
	
	this.node.menu = {
		$el: 		$chat.find( '.peka-menu' ),
		$btnToggle: $chat.find( '.btn-toggle-menu' ),
		
		template: function( data ) {
			return '<li><i style="background-image: url('+ data.icon +')"></i>'+ data.name +'</li>';
		},
		add: function( data ) {
			return $( this.template(data) ).appendTo( this.$el );
		},
		close: function() {
			this.$el.removeClass( 'active' );
			this.$btnToggle.removeClass( 'active' );
		}
	};
	
	this.node.statusBar = {
		$el: $chat.find( '.peka-statusbar' ),
		add: function( data ) {
			return $( data ).appendTo( this.$el );
		}
	};
	
	this.node.dialog = new (function() {
		this.el = {
			dialog: 	'.peka-dialog',
			title: 		'.peka-dialog-top .title',
			content:	'.peka-dialog-content',
			btnClose:	'.btn-close-dialog'
		};
		
		this.pool = {};

		this.template = function( data ) {
			var html = '';
			
			html += '<div class="peka-dialog peka-dialog-'+ data.name +'">';
			html += 	'<div class="peka-dialog-top">';
			html += 		'<div class="title">'+ data.title +'</div>';
			html += 		'<i class="btn-close-dialog js-switcher fa fa-times" data-switcher-target="#pekachat .peka-dialog-'+ data.name +'"></i>';
			html += 	'</div>';
			html += 	'<div class="peka-dialog-content">'+ data.content +'</div>';
			html += '</div>';
			
			return html;
		};
		
		this.add = function( data ) {
			var $el = $( this.template(data) ).appendTo( $chat );
			
			this.pool[ data.name ] = $el;
			
			return $el;
		};
		
		this.open = function( name ) {
			var $el = this.pool[ name ];
			$el.addClass( 'active' );
			$el.find( this.el.btnClose ).addClass( 'active' );
		};
		
		this.close = function( name ) {
			var $el = this.pool[ name ];
			$el.removeClass( 'active' );
			$el.find( this.el.btnClose ).removeClass( 'active' );
		};
	});
	
	this.add = function( el, data ) {
		return this.node[ el ].add( data );
	};
	
	this.open = function( el, data ) {
		return this.node[ el ].open( data );
	};
	
	this.close = function( el ) {
		this.node[ el ].close();
	};
};