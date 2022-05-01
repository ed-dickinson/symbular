// operators control each other, carriers are heard
// https://github.com/mohayonao/fm-synth <<<<<<<<< useful

const slider = document.getElementById('slider1');

var context = new AudioContext();

function Modulator (type, freq, gain) {
  this.modulator = context.createOscillator();
  this.gain = context.createGain();
  this.modulator.type = type;
  this.modulator.frequency.value = freq;
  this.gain.gain.value = gain;
  this.modulator.connect(this.gain);
  this.modulator.start(0);
}

// Make a stack of modulator
var modulatorStackNode = [
    // new Modulator("sawtooth", 0.01*Math.random(), 200*Math.random()),
    // new Modulator("square", 0.1*Math.random(), 200*Math.random()),
    // new Modulator("sine", 1*Math.random(), 200*Math.random()),
    // new Modulator("square", 10*Math.random(), 200*Math.random()),
    // new Modulator("sine", 10*Math.random(), 200*Math.random())

    new Modulator("sine", 200, 100),
    new Modulator("sine", 2500, 100),
    new Modulator("square", 1000, 100)
].reduce(function (input, output) {
   input.gain.connect(output.modulator.frequency);
    return output;
});
//reduce function takes (total, current value of element)

function Operator(type, freq, gain) {
  this.oscillator = context.createOscillator();
  this.gain = context.createGain();
  this.oscillator.type = type;
  this.oscillator.frequency.value = freq;
  this.gain.gain.value = gain;
  this.oscillator.connect(this.gain)
  this.oscillator.start(0)
}

let op1 = new Operator('sine', 200, 100)

console.log(op1)

// Make an oscillator, connect the modulator stack, play it!
var osc = context.createOscillator();
osc.type = "sine";
osc.frequency.value = 100+4*slider.value;
// modulatorStackNode.gain.connect(osc.frequency);
op1.gain.connect(osc.frequency);

var filter = context.createBiquadFilter();
filter.frequency.value = 2000;
filter.Q.value = 10;
osc.connect(filter);
// filter.connect(context.destination);



const masterGain = context.createGain();
masterGain.gain = 0.1;
// osc.connect(masterGain);
filter.connect(masterGain)
masterGain.connect(context.destination);

document.querySelector('#play-button').addEventListener('click', ()=>{
  // console.log(osc.started)
  osc.start(0)
  // osc.stop(0 + 1)
})
console.log(osc)

// const linkSliderToValue = (slider_id, control_paramater, slider_multiplier) => {
//   console.log('working')
//   let slider = document.querySelector(slider_id);
//   slider.addEventListener('input', ()=>{
//     console.log('working')
//     control_paramater = slider.value * slider_multiplier;
//   })
// }
//
// linkSliderToValue('#slider1', osc.frequency.value, 100+4)

document.querySelector('#slider1').addEventListener('input', ()=>{
  osc.frequency.value = 100+4*event.target.value;
})
document.querySelector('#slider2').addEventListener('input', ()=>{
  op1.oscillator.frequency.value = 100+4*event.target.value;
})

document.querySelector('#slider-vol').addEventListener('input', ()=>{
  masterGain.gain.value = event.target.value;
})
document.querySelector('#slider-filt1').addEventListener('input', ()=>{
  // console.log(slider.value)
  filter.frequency.value = event.target.value;
})
