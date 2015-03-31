var ChatSC2TV = function ( config, storage ) {
	var self = this;
	
	this.name = 'sc2tv';

	this.el = {
		$chat: $('#chat'),
		msgs: '.mess',
	};
	
	this.smiles = unsafeWindow.smiles;

	/*
	this.handleMessages = function ( $messages ) {
		this.pm.begin( 'handleMessages' );
		
		var arr 		= [],
			msg			= null,
			$text		= null,
			$author		= null;
			
		$messages = $( $messages );
		
		for (var i=0, el, len = $messages.length; i < len; i++) {
			el 		= $messages[i];
			$text 	= el.querySelector( '.text' );
			$author = el.querySelector( '.nick' );

			if ($author !== null && $text !== null) {
				msg = {
					id: 	this.name +'-'+ el.className,
					author: $author.innerHTML,
					text: 	$text.innerHTML,
					source: this.name,
					type: 	1
				};
			
				if (! storage.isMessageExist( msg )) arr.push( msg );
			}
		}
		
	
		/*
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
				text: 	$msg.html(),
				source: self.name,
				type: 	1
			}
			
			if (! storage.isMessageExist( msg )) arr.push( msg );
		});
		*/

	/*	
		this.pm.end( 'handleMessages' );
		this.pm.print();
		
		if (arr.length) 
			storage.save( this.name, arr);
	};
	*/
	
	this.msg2html = function( data ) {
		// BB codes
		var html = [
			'<b>$1</b>',
			'<a href="$1" target="_blank">$2</a>'
		];
		
		var bb = [
			/\[b\](.*?)\[\/b\]/g,
			/\[url=(.*?)\](.*?)\[\/url\]/g
		];
		
		for (var i=0; i < bb.length; i++) {
			data = data.replace( bb[i], html[i] );
		}
		
		// URL's
		data = data.replace( /\[url\](.*?)\[\/url\]/g, function( match, url ) {
			var text;
			if (url.length > 40)
				text = url.substr(0, 26) +'...'+ url.substr(url.length - 11);
			else
				text = url;
				
			text = text.replace(/(http[s]?:\/\/)?(www\.)?/i, '');
			if (text.length < 1) text = 'link';
				
			return '<a href="'+ url +'" target="_blank">'+ text +'</a>';
		});

		// Smiles
		data = data.replace( /:s(:[-a-z0-9]{2,}:)/gi, function( match, code ) {
			var smile = code;
			for (var i=0; i < self.smiles.length; i++) {
				if (self.smiles[i].code == code) {
					smile = '<img src="http://chat.sc2tv.ru/img/'+ self.smiles[i].img +'" title="'+ self.smiles[i].code +'">';
				}
			}
			return smile;
		});
		
		return data;
	};
	
	this.oldData = [];

	this.handleMessages = function( data ) {
		this.pm.begin( 'handleMessages' );
		
		var newData = data.messages,
			isNewMsg,
			temp,
			newMessages = [],
			saveArr = [];
		
		// Iterate new data
		for (var i = newData.length-1; i > -1; i--) {
			isNewMsg = true;
			
			// Iterate old data
			for (var j=0, len2 = this.oldData.length; j < len2; j++) {
			
				// If message already exist
				if (this.oldData[j].id === newData[i].id) {
					isNewMsg = false;
					break;
				}
			}
			
			if (isNewMsg) {
				saveArr.push({
					id: 	newData[i].id,
					author: newData[i].name,
					text: 	this.msg2html( newData[i].message ),
					source: self.name,
					type: 	1
				});
				newMessages.push( newData[i] );
			}
		}
		
		this.oldData = newData;
		
		if (saveArr.length)
			storage.save( this.name, saveArr);

		this.pm.end( 'handleMessages' );
		this.pm.print();
	};

	this.init = function () {
		this.pm = new PM( $('.chat-channel-name') );

		storage.save( self.name, [{
			id: 	'SC2TV_INIT',
			author: 'PekaChat',
			text: 	'<i class="fa fa-check"></i> SC2TV.ru инициализирован.',
			source: self.name,
			type: 	0
		}]);
		
		
		var id = getQueryVariable( 'channelId' );

		setInterval(function(){
			$.getJSON( 'http://chat.sc2tv.ru/memfs/channel-'+ id +'.json', self.handleMessages.bind(self) );
		}, config.UPDATE_INTERVAL);
	};
	
	this.init();
};