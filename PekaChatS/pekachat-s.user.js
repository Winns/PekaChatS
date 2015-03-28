// ==UserScript==
// @name        PekaChat S
// @description Агрегатор чатов в один поток.
// @author      Winns
// @version     0.0.1

// @include     file:///*/PekaChatS/index.html
// @include     http://chat.sc2tv.ru/*pekachat*
// @include     http://goodgame.ru/chat2/*pekachat*
// @include     http://www.twitch.tv/*/chat*pekachat*
// @include     http://cybergame.tv/cgchat.htm*pekachat*

// @exclude     *chatdepot.twitch.tv*
// @exclude     *api.twitch.tv*

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

// @require		https://rawgit.com/Winns/PekaChatS/master/PekaChatS/js/core/helpers.core.js
// @require		https://rawgit.com/Winns/PekaChatS/master/PekaChatS/js/core/storage.core.js
// @require		https://rawgit.com/Winns/PekaChatS/master/PekaChatS/js/core/ui.core.js

// @require		https://rawgit.com/Winns/PekaChatS/master/PekaChatS/js/core/gg.core.js
// @require		https://rawgit.com/Winns/PekaChatS/master/PekaChatS/js/core/sc2tv.core.js
// @require		https://rawgit.com/Winns/PekaChatS/master/PekaChatS/js/core/twitch.core.js
// @require		https://rawgit.com/Winns/PekaChatS/master/PekaChatS/js/core/cybergame.core.js
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

	TODO:
		Оптимизировать рендер
	
	Идеи для модулей:
		[ok] Голосовалка
		Прокачка пользователей, чатика
		[ok] ПекаСчётчик
		[ok] Кол-во зрителей
		[ok] Кол-во сообщений
		Подсвечивать сообщения определённых юзеров
		[ok] Trivia bot
		[ok] Статистика игр (вов дота танки лол и т.д.)
		[ok] Спидометр, скорость чатика
		нюка в чатик, гуф сообщений
		[ok] модуль статистики в который другии модули могут отправлять свою статистику
*/

var uw = unsafeWindow;
this.$ = this.jQuery = jQuery.noConflict(true);

console.log( 'host: ('+ window.location.host +')' );

$(function () {

	var ui = new UI;

	var eventBus = {
		pool: [],
		on: function( event, f ) {
			this.pool.push({ event: event, f: f });
		},
		trigger: function( event, data ) {
			var o, data = data || null;

			for (var i=0; i < this.pool.length; i++) {
				o = this.pool[i];
				if (o.event == event) o.f( data );
			}
		}
	};
	
	var config = {
		HOST 				: window.location.host,
		
		URL_SC2TV_CHAT		: 'chat.sc2tv.ru',
		URL_GG_CHAT			: 'goodgame.ru',
		URL_TWITCH_CHAT		: 'www.twitch.tv',
		URL_CYBERGAME_CHAT	: 'cybergame.tv',
		
		UPDATE_INTERVAL		: 5000,
		MSG_TO_PARSE		: 50, // per iFrame
		MSG_LIMIT			: 150,
		SCROLL_SPEED		: 500,
		
		chatList			: ['sc2tv', 'gg', 'twitch', 'cybergame'],
		modules				: uw.hasOwnProperty( 'pekaChatModules' ) ? uw.pekaChatModules : [],
	};
	
	var storage = new Storage( config, eventBus );

	var pekaChat = new (function() {
		var self = this;

		this.config = null;

		this.initHost = function() {
			switch (config.HOST) {
				case config.URL_SC2TV_CHAT:
					new ChatSC2TV( config, storage );
					break;
					
				case config.URL_GG_CHAT:
					new ChatGG( config, storage );
					break;
					
				case config.URL_TWITCH_CHAT:
					new ChatTwitch( config, storage );
					break;
					
				case config.URL_CYBERGAME_CHAT:
					new ChatCyberGame( config, storage );
					break;
					
				case '':
					if (window.self === window.top) {
						storage.clear();
						storage.startObserver();
					}
					break;
			}
		};
		
		this.initModules = function() {
			for (var i=0, item, module; i < config.modules.length; i++) {
				item = config.modules[i];

				module = clonePageObject( item.name );

				if (module !== false) {
					module = new module( item.config, config, storage, eventBus, ui );
					module.init();	
					
					console.log( 'Module '+ item.name +' initialized' );
				} else {
					console.log( 'Error: Module '+ item.name +' not exist' );
				}
			}
		};

		this.init = function() {
			this.initHost();
			this.initModules();
		};
		this.init();
	});
});