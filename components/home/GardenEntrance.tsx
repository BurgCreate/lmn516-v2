/* =========================================================
   LMN516 Entrance Clean
   Keep image only
   Remove UI decoration
========================================================= */


/* Remove decorative atmosphere */

.garden-sun,
.garden-cloud,
.garden-cloud-one,
.garden-cloud-two {

  display:none!important;

}



/* Remove botanical SVG */

.garden-line-art {

  display:none!important;

}



/* Remove motif decorations */

.garden-entrance-butterfly,
.garden-entrance-grass {

  display:none!important;

}



/* Remove scroll guide */

.garden-scroll-cue {

  display:none!important;

}



/* Remove icon arrows inside buttons */

.garden-enter-button svg {

  display:none!important;

}



/* Button keep text only */

.garden-enter-button {

  display:inline-flex;

  align-items:center;

  justify-content:center;

  gap:0;

}



/* Keep image */

.garden-entrance-girl {

  display:block;

  max-width:100%;

  height:auto;

}



/* Clean illustration area */

.garden-illustration-frame {

  position:relative;

  background:none!important;

  border:0!important;

  box-shadow:none!important;

}



/* Remove extra visual frames */

.garden-illustration-frame::before,
.garden-illustration-frame::after {

  display:none!important;

}



/* Sign keep simple */

.garden-sign {

  background:none!important;

  border:0!important;

  box-shadow:none!important;

}



/* Remove decorative flower text */

.garden-visitor-flower {

  display:none!important;

}