function initShareButtons() {
    var init = function (selector, width, height, url) { var left = (screen.width - width) / 2; var top = (screen.height - height) / 2; var params = 'top=' + top + ', left=' + left + ', width=' + width + ', height=' + height; $(selector).click(function () { window.open(url, '_blank', params); }); }
    var url = encodeURIComponent(location.href); var text = encodeURIComponent($(document).find("title").text()); init('.hp-social-fb', 550, 420, 'https://www.facebook.com/sharer.php?u=' + url); init('.hp-social-tw', 550, 420, 'https://twitter.com/share?url=' + url + '&text=' + text);
}
function isMobile() { return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)); }
function playM3U8(src) {
    window.location.hash = 'type=m3u8&src=' + encodeURIComponent(src); $('#player-tip').hide(); if ($('#player-proxy').prop('checked')) { src = src.replace(/https?:\/\//i, 'https://localhost/fetch.php/') }
    if (isMobile()) { playM3U8byNative(src); } else { playM3U8byHlsJS(src); }
}
function playM3U8byNative(src) {
    var html = '<video id="player" controls autoplay>'; html += '<source src="' + src + '" type="application/x-mpegurl">'
    html += '<source src="' + src + '" type="video/mp4">'
    html += '</video>'; $('#player').replaceWith(html); return;
}
function playM3U8byHlsJS(src) { $('#player').replaceWith('<video id="player" controls></video>'); var video = document.getElementById('player'); var hls = new Hls(); hls.attachMedia(video); hls.on(Hls.Events.MEDIA_ATTACHED, function () { console.log("video and hls.js are now bound together !"); hls.loadSource(src); hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) { console.log("manifest loaded, found " + data.levels.length + " quality level"); video.play(); }); }); }
function playM3U8byGrindPlayer(src) {
    if (src.indexOf(".3mu8") == -1) { src = src + "#.m3u8"; }
    var flashvars = { autoPlay: 'true', src: escape(src), scaleMode: 'letterbox', plugin_hls: '/player/grindplayer/flashlsOSMF.swf', hls_debug: false, hls_debug2: false, hls_minbufferlength: -1, hls_lowbufferlength: 2, hls_maxbufferlength: 60, hls_startfromlowestlevel: false, hls_seekfromlowestlevel: false, hls_live_flushurlcache: false, hls_seekmode: 'ACCURATE', hls_capleveltostage: false, hls_maxlevelcappingmode: 'downscale' }; var params = { allowFullScreen: 'true', allowScriptAccess: 'always', wmode: 'opaque' }; var attributes = { id: 'player' }; swfobject.embedSWF('/player/grindplayer/GrindPlayer.swf', 'player', '640', '480', '10.2', null, flashvars, params, attributes);
}
var videojsScriptRequested = false; var videojsPlayer = null; function playM3U8byVideoJS(src) { if (!videojsScriptRequested) { videojsScriptRequested = true; var link = document.createElement('link'); link.href = '/player/videojs/video-js.css'; link.rel = 'stylesheet'; document.body.appendChild(link); var script = document.createElement('script'); script.src = '/player/videojs/videojs-hls-bundle.js'; script.onload = function () { playM3U8byVideoJSCallback(src); }; document.body.appendChild(script); } else { playM3U8byVideoJSCallback(src); } }
function playM3U8byVideoJSCallback(src) {
    if (videojsPlayer) { videojsPlayer.dispose(); videojsPlayer = null; $('#player-container').append('<div id="player"></div>'); }
    var attributes = { 'id': 'player', 'class': 'video-js vjs-default-skin', 'width': 'auto', 'height': 'auto', 'controls': ' ', 'autoplay': '', 'preload': 'auto', 'data-setup': '{}' }
    var element = $('<video><source type="application/x-mpegURL" src="' + src + '"></source></video>').attr(attributes)
    $("#player").replaceWith(element); videojsPlayer = videojs("#player", {}, function () { });
}
function playRTMP(src) {
    window.location.hash = 'type=rtmp&src=' + encodeURIComponent(src); $('#player-tip').hide(); if (isMobile()) { $('#player-tip').html("RTMP protocol is not supported on your device."); return; }
    var flashvars = { autoPlay: 'true', src: escape(src), streamType: 'live', scaleMode: 'letterbox', }; var params = { allowFullScreen: 'true', allowScriptAccess: 'always', wmode: 'opaque' }; var attributes = { id: 'player' }; swfobject.embedSWF('/player/grindplayer/GrindPlayer.swf', 'player', '640', '480', '10.2', null, flashvars, params, attributes);
}
function playMP4(src) {
    window.location.hash = 'type=mp4&src=' + encodeURIComponent(src); $('#player-tip').hide(); var html = '<video id="player" controls autoplay>'; html += '<source src="' + src + '" type="video/mp4">'
    html += '</video>'; $('#player').replaceWith(html);
}
$(document).ready(function () {
    initShareButtons(); if (window.location.hash) {
        var hash = window.location.hash.substr(1); var result = hash.split('&').reduce(function (result, item) { var parts = item.split('='); result[parts[0]] = parts[1]; return result; }, {}); console.log(result); if (result.src) {
            var src = decodeURIComponent(result.src); $('#player-src').val(src)
            if ("rtmp" == result.type) { playRTMP(src); } else if ("mp4" == result.type) { playMP4(src); } else { playM3U8(src); }
        }
    }
});