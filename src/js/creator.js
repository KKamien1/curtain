
import Elements  from './elements.js'

const Creator = (function(types){
  let instance;
  
  const Constructor = function() {
    
    if(!instance) {
      types.forEach(constructor => this[constructor.name] = constructor);
      instance = this
    }

    return instance;
  }

  return Constructor;

})(Elements)

export default new Creator();