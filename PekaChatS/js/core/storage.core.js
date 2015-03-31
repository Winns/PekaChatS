// Messages storage
var Storage = function( config, eventBus ) {
	
	this.observeState = function () {
		if (window.location.host !== '') return;

		var currentM 	= this.load( 'all' ),
			oldM 		= this.load( 'all', true ),
			newM		= [],
			saveData	= {},
			isNewMsg	= null;
			
		// Iterate current chats
		for (var chat in currentM) {
			saveData[ chat+'_old' ] = [];

			// Iterate current chat messages
			for (var i=0; i < currentM[ chat ].length; i++) {
				isNewMsg = true;

				// Iterate old chat messages
				for (var j=0; j < oldM[ chat+'_old' ].length; j++) {

					// If message already exist
					if (currentM[chat][i].id === oldM[ chat+'_old' ][j].id) {
						isNewMsg = false;
						break;
					}
				}
				
				if (isNewMsg) {
					newM.push( currentM[chat][i] );
					saveData[ chat+'_old' ].push( currentM[chat][i] );
				}
			}
		}

		
		for (var i=0, chat; i < config.chatParsers.length; i++) {
			chat = config.chatParsers[i] + '_old';
			GM_setValue(chat, JSON.stringify( oldM[chat].concat( saveData[chat] ) ));
		}

		if (newM.length > 0) {
			eventBus.trigger( 'NEW_MESSAGE', newM );
		}
	};
	
	this.startObserver = function () {
		setInterval( this.observeState.bind(this), config.UPDATE_INTERVAL );
	};
	
	this.getById = function (id) {
		return 'FUNCTION_DISABLED';
	/*-
		var old = this.load( 'all' );
		
		for (var i=0; i < old.length; i++) {
			if (old[i].id === id) return old[i];
		}
		
		return false;
	*/
	};
	
	this.isMessageExist = function ( msg ) {
		
		var data = this.load( msg.source );

		for (var i=0; i < data.length; i++) {
			if (data[i].id === msg.id) return true;
		}
		
		return false;
	};

	this.clear = function () {
		for (var i=0, chat; i < config.chatParsers.length; i++) {
			chat = config.chatParsers[i];
			GM_setValue( chat, 			'[]' );
			GM_setValue( chat + '_old', '[]' );
		}
	};
	
	this.load = function ( source, loadOld ) {
		var r = {};
		
		if (typeof loadOld === 'undefined') loadOld = false;
		
		if (source == 'all') {
			
			for (var i=0, name; i < config.chatParsers.length; i++) {
				name = (loadOld == true) ? config.chatParsers[i] + '_old' : config.chatParsers[i];
				r[ name ] = JSON.parse(GM_getValue( name ));
			}
		} else {
			if (loadOld)
				r = JSON.parse( GM_getValue( source + '_old' ) );
			else
				r = JSON.parse( GM_getValue( source ) );
		}
		
		return r;
	};
	
	this.save = function (source, newData) {

		if (newData.length < 1) return;

		var data = this.load( source );

		for (var i=0, len = newData.length; i < len; i++) {
			data.push( newData[i] );
		}
		
		// Delete messages over limit
		if (data.length > config.MSG_LIMIT)
			data = data.slice(data.length - config.MSG_LIMIT, data.length);

		var json = JSON.stringify(data);

		GM_setValue( source, json );
		
	};
	
	this.init = function() {};
	
	this.init();
};