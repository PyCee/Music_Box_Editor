
var sampling_rate = 1.0/200.0;
var playback_time = 0.0;
var playback_millis = null;
var playback_interval = null;

function get_current_millis(){
    return new Date().getTime();
}

function play_tune(){
    playback_time = 0.0;
    playback_millis = get_current_millis();
    if(playback_interval != null){
        stop_playback();
    }
    playback_interval = setInterval(advance_playback, sampling_rate);
}
function stop_tune(){

}
function get_tune_duration(){
    var max_time = 0.0;
    Notes.forEach(function(n){
        var note_time = n.get_time();
        if(note_time > max_time){
            max_time = note_time;
        }
    });
    return max_time * 1000;
}

function advance_playback(){
    var curr_millis = get_current_millis();
    var last_playback_time = playback_time;
    playback_time += (curr_millis - playback_millis);
    playback_millis = curr_millis;

    Notes.forEach(function(n){
        var note_time = n.get_time() * 1000;
        if(note_time >= last_playback_time && note_time < playback_time){
            // TODO: play sound
            console.log("Sound: " + n.get_note());
        }
    });

    if(playback_time > get_tune_duration()){
        stop_playback();
    }
}
function stop_playback(){
    if(playback_interval != null){
        clearInterval(playback_interval);
        playback_interval = null;
    }
}