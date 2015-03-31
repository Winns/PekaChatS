var ChatCyberGame = function ( config, storage ) {
	var self = this;
	
	this.name = 'cybergame';
	
	this.el = {
		$chat: $( '#chatPage' ),
		msgs: '.msg',
	};

	
	this.getNewMessages = function () {
		var arr 		= [],
			$messages 	= this.el.$chat.find( this.el.msgs ).slice( -config.MSG_TO_PARSE ),
			$msg		= null,
			author		= null,
			id			= null;

		$messages.each(function() {
			$msg 	= $(this).clone();
			author 	= $(this).find( '.nickName' ).html();
			id 		= $(this).find( '.nick' ).attr( 'title' ) + author;
				
			$msg.find( '.nick' ).remove();

			var msg = {
				id: 	id,
				author: author,
				text: 	$msg.html(),
				source: self.name,
				type: 	1,
			};

			if (! storage.isMessageExist( msg )) arr.push( msg );
		});

		return arr;
	};

	this.init = function () {
		storage.save( self.name, [{
			id: 	'CYBERGAME_INIT',
			author: 'PekaChat',
			text: 	'<i class="fa fa-check"></i> CyberGame.tv инициализирован.',
			source: self.name,
			type: 	0
		}]);
		
		setInterval(function(){
			storage.save( self.name, self.getNewMessages() );
		}, config.UPDATE_INTERVAL);
	};
	
	this.init();
};