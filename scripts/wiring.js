// wiring ONLY DOES WIRE - not highlight of boxes

const createDomWire_EXT = (from, to, colour) => {

  let from_col = Array.from(from.parentNode.children).indexOf(from),
      from_row = Array.from(from.parentNode.parentNode.children).indexOf(from.parentNode),
      to_col = Array.from(to.parentNode.children).indexOf(to),
      to_row = Array.from(to.parentNode.parentNode.children).indexOf(to.parentNode);
  // console.log('from',from.parentNode.children)


  // 2 options - vertical adjacent, horizontal adjacent
  // 2 options - same row but seperated, same col but seperated
  // 2 options - different row but 1 col apart, different col but 1 row apart
  // 1 option / 4 directions - row and col both 1 apart

  const addWireSection = (type, direction, length) => {
    if (x === undefined && y === undefined) {
      switch (direction) {
        case 'right':
        x = from.offsetLeft + from.offsetWidth + 2;
        y = from.offsetTop + (from.offsetHeight/2) - 1;
        break;
        case 'left':
        x = from.offsetLeft;
        y = from.offsetTop + (from.offsetHeight/2) - 1;
        break;
        case 'down':
        x = from.offsetLeft + (from.offsetWidth/2) - 1;
        y = from.offsetTop + from.offsetHeight + 2;
        break;
        case 'up':
        x = from.offsetLeft + (from.offsetWidth/2) - 1;
        y = from.offsetTop;
        break;
      }
    }

    let wire_dom = document.createElement('div');
    wire_dom.classList.add('wire');
    wire_dom.style.backgroundColor = colour;

    // wire_dom.style.width = to.offsetLeft - from.offsetLeft - to.offsetWidth + 'px';
    let xx = 0;
    let yy = 0;
    if (type === 'nub') {
      xx = 2;
      yy = 2;
    } else if (type === 'vertical') {
      xx = 2;
      yy = length;
    } else if (type === 'horizontal') {
      xx = length;
      yy = 2;
    }
    wire_dom.style.left = (direction === 'left' ? x-xx -2 : x) + 'px';
    wire_dom.style.top = (direction === 'up' ? y-yy -2 : y) + 'px';

    wire_dom.style.width = xx + 'px';
    wire_dom.style.height = yy + 'px';
    x += direction === 'left' ? -xx - 4 : xx;
    y += direction === 'up' ? -yy - 4 : yy;
    // grid.appendChild(wire_dom)
    from.parentNode.appendChild(wire_dom)
  }

  let x, y;

    // adjacent in row
  if ((to_col === from_col+1 || to_col === from_col-1) && to_row === from_row) {
    addWireSection('horizontal', to_col > from_col ? 'right' : 'left', 6)

    // adjacent in col
  } else if (to_col === from_col && (to_row === from_row - 1 || to_row === from_row + 1)) {
    addWireSection('vertical', to_row < from_row ? 'up' : 'down', 6)

    // adjacent columns, different rows
  } else if ((to_col === from_col+1 || to_col === from_col-1) && to_row !== from_row) {
    addWireSection('nub', to_col > from_col ? 'right' : 'left');
    addWireSection('vertical',
      to_row > from_row ? 'down' : 'up',
      to_row > from_row ? (to.offsetTop - from.offsetTop - 2) : (from.offsetTop - to.offsetTop - 2));
    addWireSection('nub', to_col > from_col ? 'right' : 'left');

    // same column, not adjacent
  } else if (to_col === from_col && (to_row > from_row+1 || to_row < from_row-1)) {
    addWireSection('nub', 'right');
    addWireSection('vertical',
      to_row > from_row ? 'down' : 'up',
      to_row > from_row ? (to.offsetTop - from.offsetTop - 2) : (from.offsetTop - to.offsetTop - 2));
    addWireSection('nub', 'left');

    // different columns, adjacent rows
  } else if ((to_row === from_row+1 || to_row === from_row-1) && to_col !== from_col) {
    addWireSection('nub', to_row > from_row ? 'down' : 'up');
    addWireSection('horizontal',
      to_col > from_col ? 'right' : 'left',
      to_col > from_col ? (to.offsetLeft - from.offsetLeft - 2) : (from.offsetLeft - to.offsetLeft - 2));
    addWireSection('nub', to_row > from_row ? 'down' : 'up');

    // same row, not adjacent
  } else if (to_row === from_row && (to_col > from_col+1 || to_col < from_col-1)) {
    addWireSection('nub', 'down');
    addWireSection('horizontal',
      to_col > from_col ? 'right' : 'left',
      to_col > from_col ? (to.offsetLeft - from.offsetLeft - 2) : (from.offsetLeft - to.offsetLeft - 2));
    addWireSection('nub', 'up');

    // both non-adjacent
  } else if ((to_col > from_col + 1 || to_col < from_col -1) && (to_row > from_row + 1 || to_row < from_row - 1)) {
    addWireSection('nub', to_col > from_col ? 'right' : 'left');
    addWireSection('vertical',
      to_row > from_row ? 'down' : 'up',
      ((to_row > from_row ? to.offsetTop - from.offsetTop : from.offsetTop - to.offsetTop) - (from.offsetHeight / 2) - 5 - 2));
      addWireSection('horizontal',
        to_col > from_col ? 'right' : 'left',
        ((to_col > from_col ? to.offsetLeft - from.offsetLeft : from.offsetLeft - to.offsetLeft) - (from.offsetWidth / 2) - 5 - 2));
    addWireSection('nub', to_row > from_row ? 'down' : 'up');
  }

}

// export { createDomWire_EXT }
