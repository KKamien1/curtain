import { Frame } from "./frame.js";
import { CURTAINS } from './figures.js';


const options = {
  type: 'fikmik',
  color: 'rgba(179,255,232,.9)',
  duration: 300
}

const divs = document.querySelectorAll('.frame') //? 
const buttonsType = [];
//divs.forEach((el,index) => {container[el.id + index] = {}}); //?





createButtons(CURTAINS)


function createButtons (curtains) {
  for (let [name, curtain] of curtains) {
    let button = document.createElement('button');
    button.appendChild(document.createTextNode(name))
    button.value = name;
    button.classList.add('button__type')
    document.getElementsByTagName('HEADER')[0].appendChild(button);
    button.addEventListener('click', changeCurtain);
    buttonsType.push(button);
  }
}



function changeCurtain(event) {
   
  const type = event.target.value;
  console.log(event);
    divs.forEach((el, index) => {
      if (el.frame) {
        el.frame.destroy();
        delete el.frame;
      }
      let canvas = el.getElementsByTagName('CANVAS')[0]
      if(canvas) {
        canvas.remove();
      }
      let duration = options.duration + (500 * index);
      el.frame = new Frame({ div: el, ...options, duration, type });
    });

    buttonsType.forEach(button => {
      button.classList.remove('active');
      if (button.value === type) {
        button.classList.add('active');
      }

    });
  
}

function markActiveButon(name) {
  
}







