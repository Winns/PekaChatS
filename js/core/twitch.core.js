var ChatTwitch = function ( config, storage ) {
	var self = this;
	
	this.name = 'twitch';

	this.el = {
		$chat: $('.chat-room .chat-lines'),
		msgs: '.chat-line',
	};

	this.getNewMessages = function () {
		//var $temp = this.el.$chat.find( this.el.msgs );
		//if (! $temp.length) return [];
		
		var arr 		= [],
			$messages 	= this.el.$chat.find( this.el.msgs ).slice( -config.MSG_TO_PARSE ),
			$msg		= null,
			msg			= null;
		
		$messages.each(function() {
			$msg = $(this).find( '.message' );
			
			if ($msg.length) {
				msg = {
					//id: 	self.name +'-'+ $(this).prop('id').match(/ember([0-9]+)/)[1],
					id: 	self.name +'-'+ $(this).prop('id'),
					author: $(this).find( '.from' ).html(),
					msg: 	$msg.html(),
					source: self.name,
					type: 	1
				};
				
				if (! storage.isMessageExist( msg )) arr.push( msg );
			}
		});

		return arr;
	};
	
	this.isEnable = function() {
		return $( '#header_notification' ).length;
	};

	this.init = function () {
		if (! this.isEnable()) return;
		
		storage.save( self.name, [{
			id: 	'TWITCH_INIT',
			author: 'PekaChat',
			msg: 	'<i class="fa fa-check"></i> Twitch.com инициализирован.',
			source: self.name,
			type: 	0
		}]);
		
		setInterval(function(){
			storage.save( self.name, self.getNewMessages() );
		}, config.UPDATE_INTERVAL);
	};
	
	this.init();
};