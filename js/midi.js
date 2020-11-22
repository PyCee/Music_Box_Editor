var midi_track = "";

class MIDI_event {
    constructor(absolute_time, note){
        // switch(note){
        //     case "D4":
        //         this.note = 62;
        //         break;
        //     case "E4":
        //         this.note = 62;
        //         break;
        //     case "F4":
        //         this.note = 62;
        //         break;
        //     case "G4":
        //         this.note = 62;
        //         break;
        //     case "A5":
        //         this.note = 62;
        //         break;
        //     case "B5":
        //         this.note = 62;
        //         break;
        //     case "C5":
        //         this.note = 62;
        //         break;
        //     case "D5":
        //         this.note = 62;
        //         break;
        //     case "E5":
        //         this.note = 62;
        //         break;
        //     case "F5":
        //         this.note = 62;
        //         break;
        // }
    }
}

function add_midi_event(){

}
function generate_midi_header(){
    var header_start = 0x4D546864;
    var header_remaining_length = 00000006; /* Constant */
    var header_file_format = 0001; /* Single-track format */
    var header_track_count = 0001; /* One track */
    var header_ticks_per_note = 0x0000; /* TODO Ticks per quarter-note */
}
/* MIDI format
 *
 * event codes:
 * http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html#BMA1_
 * middle-c is C4 (60)
 * 
 * key numbers: 
 * http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html#BMA1_3
 * 
 * key velocity:
 * idk, hardcode it (0-127)
 *
 */