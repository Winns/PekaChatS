function clonePageObject( name ) {
	var r = false;
	
	if (uw.hasOwnProperty( name )) {
		r = uw[ name ];

		// If FireFox
		if (Object.prototype.hasOwnProperty( 'toSource' )) {
			var id = Math.random().toString(36).substr(2, 9);
			
			GM_setValue( id, r.toSource() );
			r = eval(GM_getValue( id ));
			GM_setValue( id, '' );
		}
	}
	
	return r;
}

// Performance monitor
function PM( $el ) {
	this.$el 	= $el;
	this.pool 	= {};
	
	this.reset = function() {
		this.pool = {};
		this.$el.html( '' );
	};
	
	this.begin = function( name ) {
		this.pool[ name ] = {
			begin: 	new Date().getTime(),
			end: 	null,
			time: 	null
		};
	};
	
	this.end = function( name ) {
		this.pool[ name ].end	= new Date().getTime();
		this.pool[ name ].time 	= this.pool[ name ].end - this.pool[ name ].begin;
	};
	
	this.print = function( name ) {
		var html = '';
		
		if (name !== undefined) {
			html = '[<strong>'+ name +'</strong> '+ this.pool[ name ].time +' ms] ';
		} else {
			for (var name in this.pool) {
				html += '[<strong>'+ name +'</strong> '+ this.pool[ name ].time +' ms] ';
			}
		}

		this.$el.html( html );
	};
};

function getQueryVariable(variable) {
	var query 	= window.location.search.substring(1),
		vars 	= query.split('&'),
		pair	= null;
		
	for (var i=0; i < vars.length; i++) {
		pair = vars[i].split('=');
		if (pair[0] == variable) return pair[1];
	}
	
	return false;
}

/*
	chat - chat selector "#chat", message - message class name "msg"
*/
function wChatObserver ( o ) {
	var target 	= document.querySelector( o.chatSelector ),
		exp 	= new RegExp('(^| )' + o.messageClass + '( |$)', 'gi'),
		arr 	= [],
		item, 
		hasClass,
		mutation,
		addedNodes;
		
	var observer = new MutationObserver(function( mutationsList ) {
		arr = [];

		mutationsList.forEach(function(mutation) {
			addedNodes = mutation.addedNodes;

			for (var i=0, len = addedNodes.length; i < len; i++) {
				item = addedNodes[i];

				if (item.classList)
					hasClass = item.classList.contains( o.messageClass );
				else
					hasClass = exp.test( item.className );

				if (hasClass)
					arr.push( item );
			}

		});
		
		if (arr.length)
			o.callback( arr );
	});

	observer.observe( target, {
		childList: true,
		attributes: false,
		characterData: false,
		subtree: true,
		attributeOldValue: false,
		characterDataOldValue: false,
	});
}