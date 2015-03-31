$(function() {

	(function initSwitcher() {
		$( document ).on( 'click', '.js-switcher', function() {
			var $target = $( $( this ).attr( 'data-switcher-target' ) );

			if ($( this ).hasClass( 'active' )) {
				$target.removeClass( 'active' );
				$( this ).removeClass( 'active' );
			} else {
				$target.addClass( 'active' );
				$( this ).addClass( 'active' );
			}
		});
	})();

	(function renderUserChats() {
		var list = pekaChatSetup.chatList,
			html = '';

		for (var i=0; i < list.length; i++) {
			switch ( list[i].name ) {
				case 'gg':
					html += '<li><iframe src="http://goodgame.ru/chat2/'+ list[i].id +'?pekachat=1"></iframe></li>';
					break;
					
				case 'sc2tv':
					html += '<li><iframe src="http://chat.sc2tv.ru/index.htm?channelId='+ list[i].id +'&pekachat=1"></iframe></li>';
					break;
					
				case 'twitch':
					html += '<li><iframe src="http://www.twitch.tv/'+ list[i].id +'/chat?pekachat=1"></iframe></li>';
					break;
					
				case 'cybergame':
					html += '<li><iframe src="http://cybergame.tv/cgchat.htm?v=b&pekachat=1#'+ list[i].id +'"></iframe></li>';
					break;
			}
		}
		
		$( '#iframes' ).html( html );
	})();
});