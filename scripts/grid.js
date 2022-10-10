// ideas - numeral modifier -

// make higher and lower

let connecting = null;

const grid = document.querySelector('#the-grid');
const digits = ['A', 'B', 'C', 'D', 'E', '!', '?', 'O', '0', '-',]
const note_string = 'CDEFGABC/'
const number_string = '123456789'
const chord_string = 'Mm'
const digit_string = 'QWERTYUIOP{}[]ASDFGHJKL:;|\'"`~ZXCVBNM<>?/,.1234567890-=!@£$%^&*()_+±§¼½¾';

const row1 = '0123456789'
const row2 = '0000000000'

const row_sequencer = '#CDEFGABC#'

const op_row = {row: 'operators', text_string: ['12345678 O']}

const nodes_grid = [
  [{},{},{},{},{},{},{},{}],
  [{},{},{},{},{},{},{},{}],
  [{},{},{},{},{},{},{},{}],
  [{},{},{},{},{},{},{},{}],
  [{},{},{},{},{},{},{},{}],
  [{},{},{},{},{},{},{},{}],
  [{},{},{},{},{},{},{},{}],
  [{},{},{},{},{},{},{},{}],
]

// set up first row
nodes_grid[0].forEach(node=>{
  let index = nodes_grid[0].indexOf(node)
  node.symbol = index + 1
  node.value = index
  node.type = 'sequence'
  node.description = `This is a sequencer, it will trigger any chain attached to a note on it when it flashes.`
})

// set up second row
nodes_grid[1].forEach(node=>{
  let index = nodes_grid[1].indexOf(node)
  node.symbol = note_string.substr(index, 1)
  node.value = index
  node.type = 'note'
  node.description = `This is a note, it will add the note of ${index===7?'high ':''}${node.symbol}.`
})

for (let i = 0; i < 4; i++) {
  let node = nodes_grid[2][i]
  // node.symbol = [')', ']', '>', '\\'][i]
  node.symbol = ['S', 'Q', 'T', 'W'][i]
  node.value = ['sine', 'square', 'triangle', 'sawtooth'][i]
  node.type = 'waveform'
  node.description = `This is a waveform symbol, it will change the shape of the waveform to a ${node.value} wave.`
}

for (let i = 0; i < 4; i++) {
  let node = nodes_grid[2][i+4]
  node.symbol = ['<', '=', '>', '^'][i]
  node.value = i
  node.type = 'envelope'
  node.description = `This is an envelope symbol, it will change the envelope to a ${['sustained', 'decaying', 'ascending', 'peaking'][i]} one.`
}
for (let i = 0; i < 2; i++) {
  let node = nodes_grid[3][i+6]
  node.symbol = ['-', '+'][i]
  node.value = ['down', 'up'][i]
  node.type = 'range'
  node.description = `This is a octave range symbol, it will change the octave ${['down', 'up'][i]}, among other things.`
}

for (let i = 0; i < 6; i++) {
  let node = nodes_grid[3][i]
  node.symbol = '¼½¾234'.substr(i, 1)
  node.value = [0.25, 0.5, 0.75, 2, 3, 4][i]
  node.type = 'multiplier'
  node.description = `This is a modification multiplier: it will modify the effect of something by ${node.symbol}. (Hint: use on a sequencer node.)`
}

for (let i = 0; i < 2; i++) {
  let node = nodes_grid[4][i]
  node.symbol = '%‰'.substr(i, 1)
  node.value = ['half', 'quarter'][i]
  node.type = 'arpeggiator'
  node.description = `An arpeggiator: it arpeggiates into ${node.value} notes.`
}

for (let i = 0; i < 6; i++) {
  let node = nodes_grid[7][i]
  node.symbol = '()[]{}'.substr(i, 1)
  node.value = i
  node.type = 'bracket'
  node.description = `Brackets.`
}

nodes_grid[7][6] = {
  symbol : '?',
  type : 'wildcard',
  description : 'Wildcard. This symbol has unpredicatble results.'
}
nodes_grid[7][7] = {
  symbol : 'X',
  type : 'delete',
  description : 'Be careful! Attaching a chain to this will delete it.'
}


console.log(nodes_grid)

const wiringChain = () => {
  let hue = 0;
  return () => {
    hue += 20;
    if (hue === 360) {
      hue = 0;
    }
  }
}


let running_hue = 0;

const moveHue = () => {
  running_hue += 20;
  if (running_hue === 360) {
    running_hue = 0;
  }
}

let chains = []
// DEBUG
const printChains = () => {
  // console.log('current chains: ' + chains)
  document.querySelector('#chains .display').innerHTML = ''

  chains.forEach(chain => {
    document.querySelector('#chains .display').innerHTML += `<span style="color:hsl(${chain.hue},75%,50%);">${chain.getName()}</span>`
    document.querySelector('#chains .display').innerHTML += ' '
  })

}

// function for clicking on a node
const select = (target) => {
  if (connecting === null) {
    if (target.hue === undefined || target.hue === 360) {
      target.hue = running_hue;
      moveHue();
    }
  } else {
    target.hue = connecting.hue;
  }

  console.log('selected:', target.symbol, ', connecting:', connecting === null ? 'null' : connecting.symbol)
  // if not in connecting mode then put in connecting mode
  if (connecting === null) {
    connecting = target
  // if in connecting mode then do connection
  } else {
    // cannot connect to self
    if (target === connecting) {
      return;
    }



    // connnect to other node \/\/\/
    // if target is not part of a Chain
    if (connecting.part_of.length === 0) {
      let chain_object = Chain([connecting, target], connecting.hue)
      target.part_of.push(chain_object)
      connecting.part_of.push(chain_object)
      chains.push(chain_object)

      // if (connecting.type === 'note') {
      //   chain_object.notes.push(connecting.symbol)
      // } else if (target.type === 'note') {
      //   chain_object.notes.push(target.symbol)
      // }
    } else {
      // target.part_of.push()
      connecting.part_of[connecting.part_of.length-1].addNode(target)
      target.part_of.push(connecting.part_of[connecting.part_of.length-1])

      // if (target.type === 'note') {
      //   chain_object.notes.push(target.symbol)
      // }
    }
    printChains()



    // connecting.connectTo(target);
    connecting.wireTo(target);
    // target.connectTo(connecting);
    // ^^^ finish connect to other node ^^^

    // this is from audio.js or timing.js
    if (unplayed) { startAudio() }


    connecting = null;
  }
  target.dom.style.borderColor = `hsl(${target.hue},75%,50%)`;
  // target.dom.style.backgroundColor = `hsl(${target.hue},75%,50%)`;
  // target.hue += 20;
  target.dom.classList.add('selected');
}

const tooltip_dom = document.querySelector('#tooltip')
const original_tooltip_text = tooltip.innerHTML
const clearTooltip = () => {
  tooltip_dom.innerHTML = original_tooltip_text;
  // console.log(event)
  event.target.removeEventListener('mouseout', clearTooltip);
}
const hover = (target) => {
  // console.log('hover')
  tooltip_dom.innerHTML = target.description
  // if (target.part_of !== null) {
  //   tooltip_dom.innerHTML += `, chain: ${target.part_of.getName()}`
  // }
  target.dom.addEventListener('mouseout', clearTooltip)
}


const createDomWire = createDomWire_EXT;

const Node = (dom, description, type, value) => {
  let hue = 0
  let connected_to = []
  let part_of = []
  let symbol = dom.innerHTML
  // const log = () => {
  //   console.log(dom.innerHTML)
  // }
  // const connectTo = (target) => {
  //   connected_to.push(target);
  // }
  const wireTo = (target) => {
    let wire_dom = createDomWire(dom, target.dom, `hsl(${target.hue},75%,50%)`);
  }
  const click = () => {
    dom.style.color = `hsl(${hue},75%,50%)`;
    dom.classList.add('selected');
    hue += 20;
  }
  const start_connection = () => {
    dom.style.color = `hsl(${hue},75%,50%)`;
    dom.classList.add('selected');
    hue += 20;
  }

  return {dom, symbol, wireTo,
    // connectTo, connected_to, log,
    description, part_of, type, value}
}

const node_objects = [];


const Chain = (node_array, hue_in) => {
  let nodes = node_array;
  let hue = hue_in
  // let notes = []
  // console.log('Chain:', node_array)

  // console.log(node_array)

  let name = node_array[0].symbol + '-' + node_array[1].symbol

  const addNode = (node) => {
    console.log(`adding node [${node.symbol}] to chain`)
    nodes.push(node)
    name +=  '-' + node.symbol
  }
  const getName = () => {
    return name
  }
  return {nodes, name, hue, addNode, getName}
}

// DOM GRID MAKER !!
for (y = 0; y < 8; y++) {
  let row = document.createElement('div');
  row.classList.add('row');
  grid.appendChild(row);
  for (x = 0; x < 8; x++) {
    let node = document.createElement('span');
    node.classList.add('node');

    let node_blueprint

    // if node exists in blueprint grid
    if (nodes_grid[y][x].type !== undefined) {

      node_blueprint = nodes_grid[y][x]
      node.innerHTML = node_blueprint.symbol;

      // for testing - fills with random node types
    } else {
      node.innerHTML = digit_string.substr(Math.floor(Math.random()*digit_string.length),1);

      node_blueprint = {type: 'undefined'}
    }
    // node.addEventListener('click', (()=>{select(event.target)}))
    // node_objects.push(Node(node));

    let node_object = Node(
      node,
      // `a node: ${node.innerHTML}, type: ${node_blueprint.type}`,
      node_blueprint.description !== undefined ? node_blueprint.description : 'undefined',
      node_blueprint.type,
      node_blueprint.value
    );
    node_objects.push(node_object);
    nodes_grid[y][x].obj = node_object

    node.addEventListener('click', (()=>{select(node_object)}))
    node.addEventListener('mouseover', (()=>{hover(node_object)}))

    row.appendChild(node);


  }
}

// console.log(node_objects)

const nodes = document.querySelectorAll('.node');

const theGrid = (() => {

})


// console.log(grid)
