var PekaCounter = function ( moduleConfig, globalConfig, storage, eventBus, ui ) {
	var self = this;
	
	this.name 		= 'PekaCounter';
	this.version 	= '1.0';
	this.count 		= 0;
	
	this.el = {};
	
	// Templates
	this.templates = {};
	this.templates.dialog = function() {
		var html = '';
		
		html += '<p>';
		html += 	'<button class="g-button btn-reset">Обнулить</button>';
		html += '</p>';
		
		return html;
	};
	
	this.templates.statusEl = function() {
		var html 	= '',
			style 	= {li: '', div: '', span: ''};
			
		style.li 	+= 'padding-top: 2px; line-height: normal; text-align: center;';
		
		style.div 	+= 'margin: 0 auto;';
		style.div 	+= 'width: 16px; height: 14px;';
		style.div 	+= 'background-image: url(http://chat.sc2tv.ru/img/mini-happy.png);';
		style.div 	+= 'background-position: center; background-repeat: no-repeat;';
		style.div 	+= 'background-size: contain;';
		
		style.span 	+= 'display: block; height: 14px; line-height: 14px; font-size: 10px';
		
		html += '<li style="'+ style.li +'">';
		html += 	'<div style="'+ style.div +'"></div>';
		html += 	'<span style="'+ style.span +'">0</span>';
		html += '</li>';
		
		return html;
	};
	
	// Methods
	this.reset = function() {
		this.count = 0;
		this.render();
	};
	
	this.render = function() {
		this.el.$count.html( this.count );
	};

	this.createUI = function() {
		this.el.$btnMenu = ui.add('menu', {
			icon: 'http://www.androidmenow.com/wp-content/uploads/2014/01/hike_android-icon1.png',
			name: this.name
		});

		this.el.$dialog = ui.add('dialog', {
			name: 		'PekaCounter',
			title: 		this.name +' '+ this.version,
			content: 	this.templates.dialog()
		});
		
		this.el.$btnReset = this.el.$dialog.find( '.btn-reset' );
		this.el.$btnReset.on( 'click', this.reset.bind(this) );
		
		this.el.$statusEl = ui.add( 'statusBar', this.templates.statusEl() );
		this.el.$count = this.el.$statusEl.find( 'span' );

		this.el.$btnMenu.on( 'click', function() {
			ui.close( 'menu' );
			ui.open( 'dialog', 'PekaCounter' );
		});
	};

	this.init = function() {
		this.createUI();

		var smiles = ['mini-happy', 'peka-big'];
		
		eventBus.on( 'NEW_MESSAGE', function( data ) {

			for (var i=0; i < data.length; i++) {
				for (var j=0; j < smiles.length; j++) {
					if (data[i].text.indexOf( smiles[j] ) > -1) {
						self.count++;
					}
				}
			}

			self.render();
		});
	};

};
