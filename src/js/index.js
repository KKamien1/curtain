import { Frame } from "./frame.js";

const divs = document.querySelectorAll('.frame') //? 
//const divek = document.getElementById('frame6') //? 

const options = {
  type: 'corners',
  color: 'rgba(179,255,232,.9)',
  duration: 300
}

divs.forEach(el => {
  options.duration += 200;
  new Frame({div:el, ...options})
});

// new Frame({div:divek, ...options});














