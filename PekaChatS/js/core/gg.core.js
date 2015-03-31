var ChatGG = function ( config, storage ) {
	var self = this;
	
	this.name = 'gg';

	this.getSmilePath = function( $el ) {
		var isAnimated;
		
		if ($el.classList)
			isAnimated = $el.classList.contains( 'animated' );
		else
			isAnimated = new RegExp('(^| )' + 'animated' + '( |$)', 'gi').test( $el.className );

		if (isAnimated)
			return 'http://goodgame.ru/images/anismiles/'+ $el.getAttribute('name') +'-gif.gif';
		else
			return 'http://goodgame.ru/images/smiles/'+ $el.getAttribute('name') +'-big.png';
	};
	
	this.handleMessages = function ( $messages ) {
		this.pm.begin( 'handleMessages' );
		
		var arr 		= [],
			msg			= null,
			$text 		= null,
			$img		= null,
			$author		= null;

		for (var i = 0, el, len = $messages.length; i < len; i++) {
			el 		= $messages[i];
			$text 	= el.querySelector( '.message' );
			$author = el.querySelector( '.nick' );
			
			if ($author !== null && $text !== null) {
				$img = $text.getElementsByTagName( 'img' );

				if ($img !== null) {
					for (var j = 0, len2 = $img.length; j < len2; j++) {
						$img[j].setAttribute('src', self.getSmilePath( $img[j] ));
					}
				}
			
				msg = {
					id: 		self.name +'-'+ el.getAttribute( 'data-timestamp' ),
					author: 	$author.innerHTML,
					text: 		$text.innerHTML,
					source: 	self.name,
					type: 		1,
				};

				if (! storage.isMessageExist( msg )) arr.push( msg );
			}
		}
		
		if (arr.length) 
			storage.save( this.name, arr);
			
		this.pm.end( 'handleMessages' );
		this.pm.print();
	};

	this.init = function () {
		this.pm = new PM( $('#login') );

		var obs = wChatObserver({
			chatSelector: 	'.chat-section',
			messageClass: 	'message-block',
			callback: 		self.handleMessages.bind( self )
		});

		storage.save( self.name, [{
			id: 	'GG_INIT',
			author: 'PekaChat',
			text: 	'<i class="fa fa-check"></i> GoodGame.ru инициализирован.',
			source: self.name,
			type: 	0
		}]);
	};
	
	this.init();
};