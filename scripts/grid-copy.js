let connecting = null;

const grid = document.querySelector('#the-grid');
const digits = ['A', 'B', 'C', 'D', 'E', '!', '?', 'O', '0', '-',]
const note_string = '/CDEFGABC/'
const number_string = '0123456789'
const digit_string = 'QWERTYUIOP{}[]ASDFGHJKL:;|\'"`~ZXCVBNM<>?/,.1234567890-=!@£$%^&*()_+±§';

const row1 = '0123456789'
const row2 = '0000000000'

const row_sequencer = '#CDEFGABC#'

const op_row = {row: 'operators', text_string: ['12345678 O']}

const grid_nodes = [
  [{},{},{},{},{},{},{},{},{},{}],
  [{},{},{},{},{},{},{},{},{},{}],
  [{},{},{},{},{},{},{},{},{},{}],
  [{},{},{},{},{},{},{},{},{},{}],
  [{},{},{},{},{},{},{},{},{},{}],
  [{},{},{},{},{},{},{},{},{},{}],
  [{},{},{},{},{},{},{},{},{},{}],
  [{},{},{},{},{},{},{},{},{},{}],
  [{},{},{},{},{},{},{},{},{},{}],
  [{},{},{},{},{},{},{},{},{},{}],
]

grid_nodes[0].forEach(node=>{
  node.symbol = grid_nodes[0].indexOf(node)
  // node.function = 
})

console.log(grid_nodes)

const wiringChain = () => {
  let hue = 0;
  return () => {
    hue += 20;
    if (hue === 360) {
      hue = 0;
    }
    console.log(hue)
  }
}


let running_hue = 0;

const moveHue = () => {
  running_hue += 20;
  if (running_hue === 360) {
    running_hue = 0;
  }
}

const select = (target) => {
  if (connecting === null) {
    if (target.hue === undefined || target.hue === 360) {
      target.hue = running_hue;
      moveHue();
    }
  } else {
    target.hue = connecting.hue;
  }


  console.log('selected', target, connecting)
  if (connecting === null) {
    connecting = target
  } else {
    if (target === connecting) {
      return;
    }
    if (connecting.connected_to.length === 0 && target.connected_to.length === 0) {
      let chain_object = Chain([target, connecting])
    }
    connecting.connectTo(target);
    connecting.wireTo(target);
    target.connectTo(connecting);
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
  console.log('hover')
  tooltip_dom.innerHTML = target.description
  target.dom.addEventListener('mouseout', clearTooltip)
}


const createDomWire = createDomWire_EXT;

const Node = (dom, description) => {
  let hue = 0;
  let connected_to = [];
  const log = () => {
    console.log(dom.innerHTML)
  }
  const connectTo = (target) => {
    console.log(target)
    connected_to.push(target);


  }
  const wireTo = (target) => {
    let wire_dom = createDomWire(dom, target.dom, `hsl(${target.hue},75%,50%)`);
  }
  const click = () => {
    // synth.triggerAttackRelease(`${dom.innerHTML}3`, '8n')
    dom.style.color = `hsl(${hue},75%,50%)`;
    dom.classList.add('selected');
    console.log(dom.innerHTML, hue)
    hue += 20;
  }
  const start_connection = () => {
    dom.style.color = `hsl(${hue},75%,50%)`;
    dom.classList.add('selected');
    console.log(dom.innerHTML, hue, event.target)
    hue += 20;
  }
  // dom.addEventListener('click', start_connection)
  return {log, dom, connectTo, wireTo, connected_to, description}
}

const node_objects = [];


const Chain = (node_array) => {
  let nodes = node_array;
  console.log('Chain:', node_array)
  return {node_array}
}


// GRID MAKER !!
for (y = 0; y < 10; y++) {
  let row = document.createElement('div');
  row.classList.add('row');
  grid.appendChild(row);
  for (x = 0; x < 10; x++) {
    let node = document.createElement('span');
    node.classList.add('node');

    if (y < 8 && y % 2 === 1) {
      node.innerHTML = note_string.substr(x, 1);
    } else if (y === 0 || y === 2) {
      node.innerHTML = number_string.substr(x, 1);
    } else {
      node.innerHTML = digit_string.substr(Math.floor(Math.random()*digit_string.length),1);
    }
    // node.addEventListener('click', (()=>{select(event.target)}))
    // node_objects.push(Node(node));

    let node_object = Node(node, 'a node');
    node_objects.push(node_object);
    node.addEventListener('click', (()=>{select(node_object)}))
    node.addEventListener('mouseover', (()=>{hover(node_object)}))

    row.appendChild(node);


  }
}

const nodes = document.querySelectorAll('.node');

const theGrid = (() => {

})


console.log(grid)
