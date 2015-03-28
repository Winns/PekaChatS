var ChatGG = function ( config, storage ) {
	var self = this;
	
	this.name = 'gg';
	
	this.el = {
		$chat: $( '.content-window' ),
		msgs: '.message-block:not(.system)',
	};
	
	this.getSmilePath = function( $el ) {
		if ($el.hasClass( 'animated' ))
			return 'http://goodgame.ru/images/anismiles/'+ $el.attr('name') +'-gif.gif';
		else
			return 'http://goodgame.ru/images/smiles/'+ $el.attr('name') +'-big.png';
	};
	
	this.getNewMessages = function () {
		var arr 		= [],
			$messages 	= this.el.$chat.find( this.el.msgs ).slice( -config.MSG_TO_PARSE ),
			$msg		= null,
			msg			= null;

		$messages.each(function() {
			$msg = $(this).find( '.message' ).clone();

			$msg.find( 'img' ).each(function() {
				$(this).attr('src', 
					self.getSmilePath( $(this) )
				);
			});

			msg = {
				id: 	self.name +'-'+ $(this).attr('data-timestamp'),
				author: $(this).find('.user .nick').html(),
				msg: 	$msg.html(),
				source: self.name,
				type: 	1,
			};

			if (! storage.isMessageExist( msg )) arr.push( msg );
		});

		return arr;
	};

	this.init = function () {
		storage.save( self.name, [{
			id: 	'GG_INIT',
			author: 'PekaChat',
			msg: 	'<i class="fa fa-check"></i> GoodGame.ru инициализирован.',
			source: self.name,
			type: 	0
		}]);
		
		setInterval(function(){
			storage.save( self.name, self.getNewMessages() );
		}, config.UPDATE_INTERVAL);
	};
	
	this.init();
};