var Notes = [];

class Note {
    constructor(){
        this.locked_to_grid = true;
        
        this.element = document.createElement("div");
        this.element.classList.add("note", "noselect");
        builder_interface.appendChild(this.element);

        this.selectable_area = document.createElement("div");
        this.selectable_area.classList.add("note-selectable-area");
        this.element.appendChild(this.selectable_area);

        Notes.push(this);
    }
    remove(){
        Notes.splice(Notes.indexOf(this), 1);
    }
    upside_down(){
        this.element.classList.add("flipped");
    }
    rightside_up(){
        this.element.classList.remove("flipped");
    }
    select(){
        this.element.classList.add("note-selection-visual");
    }
    deselect(){
        this.element.classList.remove("note-selection-visual");
    }
};

function position_note(note, top, left, bounded=false){
    if(top <= note_tops[3]){
        note.upside_down();
    } else {
        note.rightside_up();
    }
    if(bounded){
        if(top != null)
            top = Math.min(Math.max(top, note_tops[0]), note_tops[note_tops.length-1]);
        if(left != null)
            left = Math.min(Math.max(left, note_lefts[0]), note_lefts[note_lefts.length-1]);
    }
    position_interface_element(note.element, top, left);
}