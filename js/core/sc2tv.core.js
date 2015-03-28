var ChatSC2TV = function ( config, storage ) {
	var self = this;
	
	this.name = 'sc2tv';

	this.el = {
		$chat: $('#chat'),
		msgs: '.mess',
	};
	
	this.getSmilePath = function( v ) {
		return 'http://chat.sc2tv.ru' + v;
	};
	
	this.getNewMessages = function () {
		//var $temp = this.el.$chat.find( this.el.msgs );
		//if (! $temp.length) return [];
		
		var arr 		= [],
			$messages 	= this.el.$chat.find( this.el.msgs ).slice( -config.MSG_TO_PARSE ),
			$msg		= null,
			author		= null,
			msg			= null;
		
		$messages.each(function() {
			$msg = $(this).find( '.text, .system_text' ).clone();

			$msg.find( 'img' ).each(function() {
				$(this).attr('src', self.getSmilePath( $(this).attr('src') ) );
				$(this).attr( 'name', $(this).attr('src').match(/chat.sc2tv.ru\/img\/(.*)\./)[1] );
			});
			
			author = $(this).find('.nick');
			
			author = (author.length > 0) ? author.html() : 'system';

			msg = {
				//id: 	self.name +'-'+ $(this).prop('class').match(/message_([0-9]+)/)[1],
				id: 	self.name +'-'+ $(this).prop('class'),
				author: author,
				msg: 	$msg.html(),
				source: self.name,
				type: 	1
			}
			
			if (! storage.isMessageExist( msg )) arr.push( msg );
		});

		return arr;
	};

	this.init = function () {
		storage.save( self.name, [{
			id: 	'SC2TV_INIT',
			author: 'PekaChat',
			msg: 	'<i class="fa fa-check"></i> SC2TV.ru инициализирован.',
			source: self.name,
			type: 	0
		}]);
		
		setInterval(function(){
			storage.save( self.name, self.getNewMessages() );
		}, config.UPDATE_INTERVAL);
	};
	
	this.init();
};