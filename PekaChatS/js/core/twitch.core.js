var ChatTwitch = function ( config, storage ) {
	var self = this;
	
	this.name = 'twitch';

	this.el = {
		$chat: $('.chat-room .chat-lines'),
		msgs: '.chat-line',
	};

	this.handleMessages = function ( $messages ) {
		this.pm.begin( 'handleMessages' );
		
		var arr 		= [],
			msg			= null,
			$text		= null,
			$author		= null;
			
	
		for (var i = 0, el, len = $messages.length; i < len; i++) {
			el 		= $messages[i];
			$text 	= el.querySelector( '.message' );
			$author = el.querySelector( '.from' );
			
			if ($author !== null && $text !== null) {
				msg = {
					id: 	this.name +'-'+ el.id,
					author: $author.innerHTML,
					text: 	$text.innerHTML,
					source: this.name,
					type: 	1
				};
				
				if (! storage.isMessageExist( msg )) arr.push( msg );
			}
		}
		
		if (arr.length) 
			storage.save( this.name, arr);
			
		this.pm.end( 'handleMessages' );
		this.pm.print();
	};
	
	this.isEnable = function() {
		return $( '#header_notification' ).length;
	};

	this.init = function () {
		if (! this.isEnable()) return;
		
		this.pm = new PM( $('.room-title') );
		
		var obs = wChatObserver({
			chatSelector: 	'.chat-room .chat-lines',
			messageClass: 	'chat-line',
			callback: 		this.handleMessages.bind( this )
		});
		
		storage.save( self.name, [{
			id: 	'TWITCH_INIT',
			author: 'PekaChat',
			text: 	'<i class="fa fa-check"></i> Twitch.com инициализирован.',
			source: self.name,
			type: 	0
		}]);
	};
	
	this.init();
};