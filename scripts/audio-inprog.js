
let base_frq = [220.00]
let note_frqs = [] // empty intialiser
let harmonic_steps = [3, 5, 7, 8, 10, 12, 14, 15] // C scale from A
// this loop calculates them from the base frq (A)
for (let i = 0; i < 8; i++) {
  note_frqs[i] = base_frq * Math.pow(2, (harmonic_steps[i])/12)
}

console.log('safari? -','webkitAudioContext' in window)
const audioContext = 'webkitAudioContext' in window ? new webkitAudioContext() : new AudioContext();

const SAMPLE_RATE = audioContext.sampleRate
const timeLength = 1

const buffer = audioContext.createBuffer(
  1,
  SAMPLE_RATE * timeLength,
  SAMPLE_RATE
)

// should this be in scheduleNoise?
let noiseDuration = 10
const bufferSize = audioContext.sampleRate * noiseDuration;
// Create an empty buffer
const noiseBuffer = new AudioBuffer({
  length: bufferSize,
  sampleRate: audioContext.sampleRate
});
const data = noiseBuffer.getChannelData(0);
for (let i = 0; i < bufferSize; i++) {
  data[i] = Math.random() * 2 - 1;
}


let unplayed = true

const startAudio = () => {

  unplayed = false; //remove

  const node = audioContext.createBufferSource();
  node.buffer = buffer;
  node.start(0);

  // scheduler()
  startSequencer()
}

const channelData = buffer.getChannelData(0)

for (let i = 0; i < buffer.length; i++) {
  channelData[i] = Math.random() * 2 - 1;
}

var filter = audioContext.createBiquadFilter()
filter.frequency.value = 2000
filter.Q.value = 10

const masterGain = audioContext.createGain()
// masterGain.gain.setValueAtTime(0.05, 0)
masterGain.gain.value = 0.2
filter.connect(masterGain)
masterGain.connect(audioContext.destination)



const lookahead = 25.0; // how frequently to call scheduling function (in milliseconds)
const scheduleAheadTime = 0.1; // how far ahead to schedule audio (sec)

let current_note = 0
let next_note_time = 0.0 // when next note due

// so what yu wanna o is have the scheduler checking every 25/50/100 msecs/pixels if anythng new has been drawn in front of it, - so check all the drawn shapes for an x reading, afor any in that block of time, schedule them using the one vairbale input for osc.start()

let schedule_note = 0

const scheduleNote = (frq, time, wave) => {
  const osc = audioContext.createOscillator()
  osc.frequency.value = frq
  osc.type = wave
  osc.connect(filter)
  osc.start(time)
  osc.stop(time + (600 / 8 / tempo))
  console.log('note frq', frq, 'scheduled', wave)
}
const scheduleNoise = (time) => {
  const noise = new AudioBufferSourceNode(audioContext, {
    buffer: noiseBuffer
  })
  noise.connect(filter)
  noise.start(time)
  noise.stop(time + (600 / 8 / tempo))
}

const scheduleVisual = (note, time) => {
  note = (note + 1) % 8
  setTimeout(() => {
    nodes_grid[0][note].obj.dom.style.opacity = 0.5
  }, time * 1000)
  setTimeout(() => {
    nodes_grid[0][note].obj.dom.style.opacity = 1
  }, (time*1000) + 200)
}


const nextNote = () => {
  const secs_per_beat = 60.0 / tempo

  next_note_time += secs_per_beat; // Add beat length to last beat time

  // Advance the beat number, wrap to zero when reaching 4
  current_note = (current_note+1) % 8;
  console.log(current_note)
}

let timerID

const checkForChain = (seq_no) => {
  // see if chain lies on note sequencer
  if (nodes_grid[0][seq_no].obj.part_of !== null) {
    let chain = nodes_grid[0][seq_no].obj.part_of

    let chain_frqs = chain.nodes.filter(x => x.type === 'note')

    let chain_waveforms = chain.nodes.filter(x => x.type === 'waveform')

    console.log(chain_waveforms)
    // if unattached to note nodes
    if (chain_frqs.length === 0) {
      scheduleNoise(next_note_time)
    } else {
      for (let i = 0; i < chain_frqs.length; i++) {
        let note_i = nodes_grid[1].indexOf(chain_frqs[i])

        if (chain_waveforms.length === 0) {
          scheduleNote(note_frqs[chain_frqs[i].value], next_note_time, 'sine')
        } else {
          for (let j = 0; j < chain_waveforms.length; j++) {
            scheduleNote(note_frqs[chain_frqs[i].value], next_note_time, chain_waveforms[j].value)
          }
        }
      }
    }
  }
}

const startSequencer = () => {
  checkForChain(0)
}

const scheduler = () => {
  while (next_note_time < audioContext.currentTime + scheduleAheadTime) {
    // if () {}
    let next_note = (current_note + 1) % 8
    // console.log(nodes_grid[0][next_note])



    scheduleVisual(current_note, audioContext.currentTime + scheduleAheadTime - next_note_time)
    nextNote()

  }
  timerID = setTimeout(scheduler, lookahead)
}





// DEBUG

setInterval(()=>{
  document.querySelector('#time-debug .display').textContent = audioContext.currentTime.toFixed(2) + 's - ' + (audioContext.currentTime * 1000).toFixed(0) + 'ms'
},20)
