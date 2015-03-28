/*
	Message types:
		0: system
		1: user
*/
var Render = function ( moduleConfig, globalConfig, storage, eventBus, ui ) {
	var self = this;
	
	this.name 		= 'Render';
	this.version 	= '1.0';

	this.el = {
		$msgOutput: $( '#pekachat .peka-messages-list' ),
		message: 	'.peka-message'
	};

	// Templates
	this.templates = {};
	this.templates.dialog = function() {
		var html = '';
		
		html += '<p>';
		html += 	'<input type="checkbox"> пека';
		html += '</p>';
		
		return html;
	};
	this.templates.userMessage = function( data ) {
		var html = '';
		
		html += '<li class="peka-message" title="'+ data.id +'">';
		html += 	'<span class="peka-author"><span class="peka-source"><i class="g-vicon g-vicon-'+ newM[i].source +'"></i></span> '+ data.author +'</span> ';
		html += 	'<span class="peka-text">'+ data.msg +'</span>';
		html += '</li>';
		
		return html;
	};
	this.templates.systemMessage = function( data ) {
		return '<li class="peka-message peka-system-message" title="'+ data.id +'">'+ data.msg +'</li>';
	};
	
	// Methods
	this.print = function( newM ) {
		var html = '';

		for (var i=0; i < newM.length; i++) {
			// Original
			//html += this.templates.message( newM[i] );
			// Minified for maximum performance
			switch (newM[i].type) {
				case 1:
					html += '<li class="peka-message" title="'+ newM[i].id +'"><span class="peka-author"><span class="peka-source"><i class="g-vicon g-vicon-'+ newM[i].source +'"></i></span> '+ newM[i].author +':</span> <span class="peka-text">'+ newM[i].msg +'</span></li>';
					break;
				case 0:
					html += this.templates.systemMessage( newM[i] );
					break;
			}
		}

		
		this.el.$msgOutput.append( html );
		
		var $msgs = self.el.$msgOutput.find( self.el.message );

		this.el.$msgOutput.animate({
			scrollTop: this.el.$msgOutput[0].scrollHeight - this.el.$msgOutput.height()
		}, globalConfig.SCROLL_SPEED, function(){

			// Remove over limit messages
			var $msgs = self.el.$msgOutput.find( self.el.message );
			
			if ($msgs.length > globalConfig.MSG_LIMIT)
				$msgs.slice(0, $msgs.length - globalConfig.MSG_LIMIT).remove();
		});
	};
	
	this.createUI = function() {
		this.el.$btnMenu = ui.add('menu', {
			icon: 'http://www.portsmouth-marketing.com/wp-content/uploads/2014/12/iPhoneAppDeveloperCustomerSupport.png',
			name: this.name
		});

		this.el.$dialog = ui.add('dialog', {
			name: 		'Render',
			title: 		this.name +' '+ this.version,
			content: 	this.templates.dialog()
		});
		
		/*
		this.el.$statusEl = ui.add( 'statusBar', this.templates.statusEl() );
		
		this.el.$count = this.el.$statusEl.find( 'span' );

		this.el.$btnOpen.on( 'click', function() {
			ui.close( 'menu' );
			ui.open( 'dialog', 'PekaCounter' );
		});
		*/
		
		this.el.$btnMenu.on( 'click', function() {
			ui.close( 'menu' );
			ui.open( 'dialog', 'Render' );
		});
	};
	
	this.init = function() {
		this.createUI();
		
		eventBus.on( 'NEW_MESSAGE', this.print.bind(this) );
	};
};
