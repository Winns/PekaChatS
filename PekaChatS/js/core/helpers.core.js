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