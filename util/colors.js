
const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal',
 'blue', 'violet', 'purple', 'pink', 'brown'];

Array.prototype.sample = function(){
   return this[Math.floor(Math.random()*this.length)];
}

module.exports = colors;