import {Curtain} from './figures.js' 
import {debounce} from './utils.js'

const [START, FORWARD, PAUSE, BACK, END] = ['start', 'forward', 'pause', 'back', 'end'];



class Frame {
  constructor({div, type, duration, color}) {
    this.div = div;
    this.container = this.div.querySelector('.frame__container');
    this.overlay = this.div.querySelector('.frame__overlay');
    this.duration = duration || 500;
    this.fps = 60;
    this.id = Math.random() * 100; 
    this.t = 0;
    this.start = null;
    this.color = color || 'rgba(179,255,232,.9)';
    this.phase = observable(START);    
    this.loop = this.loop.bind(this);
    this.requestId = undefined;
    this.createCanvas();
    this.createCurtain(type);
    this.events();
    this.onEnterHandler = this.onEnterHandler.bind(this);
    this.onLeaveHandler = this.onLeaveHandler.bind(this);
    this.div.addEventListener('mouseenter', this.onEnterHandler);
    this.div.addEventListener('mouseleave', this.onLeaveHandler);
  }
  
  onEnterHandler() {
    this.notify(FORWARD);
  }
  
  onLeaveHandler() {
    this.notify(BACK);
  }
  
  events() {
    window.addEventListener('resize', debounce(()=> this.handleResize(), 10));
  }

  destroy() {
    this.div.removeEventListener('mouseenter', this.onEnterHandler)
    this.div.removeEventListener('mouseleave', this.onLeaveHandler)
    window.removeEventListener('resize', debounce);
  }
  
  notify(eventType) {
    console.log('Notification:', eventType);
    this.phase(eventType);
    switch (eventType) {
      case FORWARD: this.requestId = requestAnimationFrame(this.loop); break;
      case BACK:    {this.requestId = requestAnimationFrame(this.loop); this.back();} break;
      case PAUSE:   { window.cancelAnimationFrame(this.requestId); this.pause() }     break;
      case END:     {window.cancelAnimationFrame(this.requestId); this.end()}      break;
      default: return;
    }
  }
  
  loop(timestemp) {
    if (!this.start) this.start = timestemp;
    this.t = timestemp - this.start;
    
    this.draw();
    
    if (this.t <= this.duration) {
      this.requestId = requestAnimationFrame(this.loop);
    } else {
      this.start = null;
      this.phase() === FORWARD ? this.notify(PAUSE) : this.notify(END);
    }
  }
  
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.curtain.draw(this.t);
  }

  pause() {
    console.log(this.id);
    this.container.classList.add('frame__container--hidden');
    this.overlay.classList.add('frame__overlay--show');
  }
  back() {
    //this.container.classList.add('frame__container--hidden');
    this.overlay.classList.remove('frame__overlay--show');
  }
  end() {
    this.container.classList.remove('frame__container--hidden');
    //this.overlay.classList.remove('frame__overlay--show')
  }
  
  createCanvas() {
    this.div.style.position = 'relative';
    this.canvas = document.createElement('canvas');
    this.setSize = this.div;
    this.canvas.style.position = 'absolute';
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.save();
    this.div.appendChild(this.canvas);
  }

  createCurtain(type) {
    this.curtain = new Curtain(this.div, type, this.ctx);
    this.set = this.curtain.getSet();
    this.curtain.elements.forEach(el => {this.phase.subscribe(el);Object.assign(el, {ctx:this.ctx,  duration:this.duration}) });
  }

  handleResize() {
    if (this.canvas) {
      this.setSize = this.div;
      this.ctx.fillStyle = this.color;
      this.curtain.points.refreshPoints(this.div);
      this.draw();
      this.info;
    }
  }

  get info() {
    const info = `
      id:${this.id} ${this.div.clientWidth} x ${this.div.clientHeight}
      canvas: ${this.canvas.width} x ${this.canvas.height}
      `;
    console.log(info);
    return info;
  }
  
  set setSize({clientWidth, clientHeight}) {
    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight;
  }



}

function observable(value) {
  const subscribers = [];
  
  function notify(value, oldValue) {
    for (let subscriber of subscribers) {
      subscriber.notify(value);
    }
  }
  function assesor(newValue) {
    if(newValue && newValue !== value) {
      let temp = value;
      value = newValue;
      notify(value, temp);
    }
    return value;
  }
  
  assesor.subscribe = function(subscriber) {
    subscribers.push(subscriber);
  }
  
  return assesor;
  
}


export {

  Frame
};
    