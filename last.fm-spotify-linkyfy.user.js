/*jslint white: false, browser: true, onevar: false, undef: true */
/*global window, unsafeWindow, $, $$, Element */

// ==UserScript==
// @name        last.fm spotify-linkify
// @namespace   http://code.orly.ch/userscript
// @description Adds little spotify icons next to Artist links on last.fm.
// @include     http://last.fm/*
// @include     http://www.last.fm/*
// @author      Jiayong Ou
// @license		MIT; http://github.com/jou/last.fm-spotify-linkify/blob/master/LICENSE
// ==/UserScript==

(function(){
	/* Greasemonkey <=> GreaseKit compatibility */
	if (typeof(unsafeWindow) === 'undefined') {
		unsafeWindow = window;
	}
	
	/* Alias prototype stuff for Greasemonkey. There's already Prototype loaded
	 * on last.fm, so we just use that.
	 */
	if (typeof($) === 'undefined') {
		var $ = unsafeWindow.$;
	}
	
	if (typeof($$) === 'undefined') {
		var $$ = unsafeWindow.$$;
	}
	if (typeof(Element) === 'undefined') {
		var Element = unsafeWindow.Element;
	}
	
    var $r = function(pattern, flags) { return new RegExp(pattern, flags); };
    var artistLinkRegex = $r('music/([^+/?][^/?]+)$');
    var spotifyLinkifyArtist = function(artistLink) {
        if (
            artistLink.hasClassName('lfmButton')  || artistLink.hasClassName('spotified') ||
            artistLink.hasClassName('playbutton') || artistLink.id === 'inLibraryIndicatorForArtist' ||
            artistLink.innerHTML.match(/Artist/)
        ) {
            return;
        }
        var artist = artistLink.href.match(artistLinkRegex)[1];
        var spotifyUri = 'spotify:search:artist:'+artist;
        var iconSize = 15;
		
        var spotifyIcon = new Element('img', {
                src: 'http://www.spotify.com/wp-content/themes/spotify/images/favicon.ico'
            }).setStyle({
                width: iconSize+'px',
                height: iconSize+'px'
            });

        var spotifyLink = new Element('a', {href: spotifyUri});

        spotifyLink.insert(spotifyIcon);

        var reference = artistLink;
        var position = 'before';

        if (artistLink.down('.pictureFrame')) {
            reference = artistLink.down('.pictureFrame');
            position = 'after';
        }

        var ins = {};
        ins[position] = spotifyLink;

        reference.insert(ins);
        artistLink.addClassName('spotified');
    };
	
    var musicLinks = $$('a[href^=/music], a[href^=http://www.last.fm/music]');

    var artistLinks = musicLinks.findAll(function(link) {
        return link.href.match(artistLinkRegex);
    }).each(spotifyLinkifyArtist);

}());
