// ==UserScript==
// @name        PekaChat S
// @description Агрегатор чатов в один поток.
// @author      Winns
// @version     1.0

// @include     http://chat.sc2tv.ru*
// @include     http://goodgame.ru/chat2/*
// @include     http://www.twitch.tv/*/chat
// @include     file:///*/pekachat_s/index.html
// @include     http://*runpekachat


// @grant unsafeWindow
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @grant GM_log
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant GM_info
// @grant GM_getMetadata

// @require     http://code.jquery.com/jquery-2.1.3.min.js

// @require		file:///C:/Users/ps/Desktop/web_prog/code/sc2tv%20userscript%20screens/pekachat_s/storage.core.js?_11sddsd5dsdddsddsd
// @require		file:///C:/Users/ps/Desktop/web_prog/code/sc2tv%20userscript%20screens/pekachat_s/main.page.js?_111dddsdf5dsfsffsdddsddddsds

// @require		file:///C:/Users/ps/Desktop/web_prog/code/sc2tv%20userscript%20screens/pekachat_s/gg.page.js?_111sfd5dddsdd
// @require		file:///C:/Users/ps/Desktop/web_prog/code/sc2tv%20userscript%20screens/pekachat_s/sc2tv.page.js?_111dfd5dddsdd
// @require		file:///C:/Users/ps/Desktop/web_prog/code/sc2tv%20userscript%20screens/pekachat_s/twitch.page.js?_111sfd5dddsfd
// ==/UserScript==

/*
	GUIDE
	
	1)	
		enable userscript access to local files
		http://stackoverflow.com/questions/9931115/run-greasemonkey-on-html-files-located-on-the-local-filesystem

	2) 
		set URLs
		// @include     http://chat.sc2tv.ru/index.htm?channelId=157255
		// @include     http://goodgame.ru/chat/Pomi/217/
		// @include     file:///C:/Users/ps/Desktop/iframes/iframes-test-page.html
		// @match 		http://chat.sc2tv.ru/index.htm?channelId=157255
		// @match 		http://goodgame.ru/chat/Pomi/217/
		// @match 		file:///C:/Users/ps/Desktop/iframes/iframes-test-page.html

	Message format
	{
		id: 		uniq id,
		author:		author name,
		msg:		message,
		source: 	message source (website, "gg", "sc2tv")
	}
	
	навзвания - BarrensChat, PekaChat S
*/

// Check host
var enableScript = (function checkHost() {
	var HOST 		= window.location.host,
		modules 	= unsafeWindow.pekaChatModules;
		
	if (HOST === '') return true;
	
	for (var i=0, m; i < modules.length; i++) {
		m = modules[i];
		
		if (m.hasOwnProperty( 'host' )) {
			if (Array.isArray( m.host )) {
				for (var j=0; j < m.host.length; j++) {
					if (m.host[j] === HOST) return true;
				}
			} else {
				if (m.host === HOST) return true;
			}
		}
	}
	
	return false;
})();

if (enableScript) {

	this.$ = this.jQuery = jQuery.noConflict(true);

	// Helpers
	function getPageObject( name ) {
		var r = false;
		
		if (unsafeWindow.hasOwnProperty( name )) {
			r = unsafeWindow[ name ];

			// If browser support .toSource() method (if firefox)
			if (Object.prototype.hasOwnProperty( 'toSource' )) {
				var id = Math.random().toString(36).substr(2, 9);
				
				GM_setValue( id, r.toSource() );
				r = eval(GM_getValue( id ));
				GM_setValue( id, '' );
			}
		}
		
		return r;
	}

	$(function () {

		var pekaChat = new (function() {
			var self = this;
			
			
		});
		
		/*
		var config = {
			HOST 				: window.location.host,
			URL_SC2TV_CHAT		: 'chat.sc2tv.ru',
			URL_GG_CHAT			: 'goodgame.ru',
			URL_TWITCH_CHAT		: 'www.twitch.tv',
			
			UPDATE_INTERVAL		: 5000,
			MSG_TO_PARSE		: 12, // per iFrame
			MSG_LIMIT			: 50, // > MSG_TO_PARSE * number of iFrames + 1
			SCROLL_SPEED		: 500,
			
			CHAT_LIST			: ['sc2tv','gg','twitch']
		};
		
		var eventBus = {
			pool: [],
			on: function( event, f ) {
				this.pool.push({ event: event, f: f });
			},
			onTrigger: function( event, data ) {
				var o, data = data || null;

				for (var i=0; i < this.pool.length; i++) {
					o = this.pool[i];
					if (o.event == event) o.f( data );
				}
			}
		};
		
		var storage = new Storage( config );

		(function handleHost() {
			uw.console.log( 'HOST: ('+ config.HOST +')' );

			switch (config.HOST) {
				case config.URL_SC2TV_CHAT:
					new PageSC2TV( config, storage );
					break;
					
				case config.URL_GG_CHAT:
					new PageGG( config, storage );
					break;
					
				case config.URL_TWITCH_CHAT:
					new PageTwitch( config, storage );
					break;
					
				case '':
					new App( config, storage, uw.userModules );
					storage.startObserver();
					break;
			}
			
		})();
		*/
	});

}