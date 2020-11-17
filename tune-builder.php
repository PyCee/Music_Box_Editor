<?php
    include("./header.php");
?>
<h1>Build a tune</h1>
<div id="tune-builder">
    <div id="builder-buttons">
        <div id="play-tune-button">Play Tune</div>
        <div id="save-tune-button">Save Tune</div>
    </div>
    <div id="builder-interface">
        <img id="treble-clef" class="noselect" draggable="false" 
            src="res/treble-clef.png" alt="Image of a music treble clef.">
    </div>
</div>

<script src="js/rect.js"></script>
<script src="js/builder_interface.js"></script>
<script src="js/note.js"></script>
<script src="js/note-builder.js"></script>
<script>
$(document).ready(function(){
    $("#treble-clef").on('dragstart', function(event) { event.preventDefault(); });
    
    $("#play-tune-button").click(function(){
        console.log("play");
    });
    $("#save-tune-button").click(function(){
        console.log("save");
    });
});
</script>

<?php
    include("./footer.php");
?>