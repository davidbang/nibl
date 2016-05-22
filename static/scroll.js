function enable_scroll() {
	window.onmousewheel = document.onmousewheel = document.onkeydown = document.body.ontouchmove = null;  
}

var docElem = window.document.documentElement,
	scrollVal,
	isRevealed, 
	noscroll, 
	isAnimating,
	container = document.getElementById( 'container' ),
	trigger = container.querySelector( 'button.trigger' );

function scrollY() {
	return window.pageYOffset || docElem.scrollTop;
}

function scrollPage() {
	scrollVal = scrollY();
	
	if( noscroll && !ie ) {
		if( scrollVal < 0 ) return false;
		// keep it that way
		window.scrollTo( 0, 0 );
	}

	if( classie.has( container, 'notrans' ) ) {
		classie.remove( container, 'notrans' );
		return false;
	}

	if( isAnimating ) {
		return false;
	}
	
	if( scrollVal <= 0 && isRevealed ) {
		toggle(0);
	}
	else if( scrollVal > 0 && !isRevealed ){
		toggle(1);
	}
}

function toggle( reveal ) {
	isAnimating = true;
	
	if( reveal ) {
		classie.add( container, 'modify' );
		$("#app").show("fast");
		$("#bgvid").hide("fast");
		$(".title").hide("fast");
		startCoach();
	}
	else {
		$("#bgvid").show("fast");
		$("#app").hide("fast");
		$(".title").show("fast");
		noscroll = true;
		disable_scroll();
		classie.remove( container, 'modify' );
	}

	// simulating the end of the transition:
	setTimeout( function() {
		isRevealed = !isRevealed;
		isAnimating = false;
		if( reveal ) {
			noscroll = false;
			enable_scroll();
		}
	}, 600 );
}


var pageScroll = scrollY();
noscroll = pageScroll === 0;


window.addEventListener( 'scroll', scrollPage );
trigger.addEventListener( 'click', function() { toggle( 'reveal' ); } );
})();