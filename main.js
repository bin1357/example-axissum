/**
 * Created by joni8 on 04.01.2018.
 */
function init() {
    let svg = document.getElementById('svg-root');
    const axisPosition = [10, 200];
    let axis = createAxis({
        start: 0,
        length: 21,
        d: 20, attr: {
            transform: `translate(${axisPosition[0]},${axisPosition[1]})`
        }
    });
    svg.appendChild(axis);
    const drawArrow = (from, to) => svg.appendChild(createArrowToAxis({
        from, to,
        dx: axisPosition[0],
        dy: axisPosition[1],
        arrCoord: axis.arrCoord
    }));
    const position = {
        a: [200, 40],
        b: [280, 40],
        sign: [240, 40],
        eq: [320, 40],
        c: [360, 40]
    };
    const drawInput = (_pos, onInput, d) => {
        let input;
        d = d || [0, 0];
        let pos = Array.isArray(_pos) ? _pos : position[_pos];
        const removeCallback = () => {
            svg.focus();
            input.parentNode.removeChild(input);
        };
        input = svg.appendChild(createInput({
            x: pos[0] + d[0], y: pos[1] + d[1]
        }, (e) => onInput(e, removeCallback)));
        return input;
    };
    const drawInputUpArrow = (arrow, onInput) => drawInput(arrow.arrCoord.vertex, onInput);


    const drawText = (text, _pos, attr) => {
        if (!position[_pos]) {
            console.log('position undefined');
            return 0;
        }
        const pos = position[_pos];
        const textNode = createText(text, {
            x: pos[0], y: pos[1],
            ...attr
        });

        const rect = createElement('rect', {
            x: pos[0] - 1,
            y: pos[1] - 16,
            width: 10,
            height: 18,
            fill: 'none',
            rx: 2, ry: 2,
        });
        svg.appendChild(textNode);
        svg.insertBefore(rect, textNode);
        textNode.filler = rect;
        return textNode;
    };


    return {
        drawText,
        drawArrow,
        drawInputUpArrow,
        drawInput
    }
}


function createArrowToAxis({from, to, dx, dy, arrCoord}) {
    dx = dx || 0;
    dy = dy || 0;
    from = from || 0;
    if (!arrCoord[to] || !arrCoord[from]) {
        console.error('number out of axis');
        return false;
    }
    return createArrow({
        x1: arrCoord[from][0] + dx, x2: arrCoord[to][0] + dx,
        y: arrCoord[from][1] + dy, h: 40, attr: {
            fill: 'none',
            'stroke-width': 1,
            'stroke': '#e00000',
        }
    });
}
function createElement(name, attr, spec) {
    spec = spec || "http://www.w3.org/2000/svg";
    const elem = document.createElementNS
        ? document.createElementNS(spec, name)
        : document.createElement(name);
    const alieses = {
        className: 'class',
        htmlFor: 'for'
    };
    attr && Object.keys(attr).forEach(key => {
        elem.setAttribute(alieses[key] || key, attr[key]);
    });
    return elem;
}
function createText(text, attr) {
    const elem = createElement('text', attr);
    elem.appendChild(document.createTextNode(text));
    return elem;
}
function createInput({x, y, dx, dy, attr}, onInput) {
    const width = 24, height = 24;
    dx = dx || 0;
    dy = dy || 0;
    const obj = createElement('foreignObject', {
        width, height,
        transform: `translate(${x - width / 2 + dx},${y - height + dy})`,
        ...attr
    });
    const div = createElement('div', {
        //style: `padding: ${0} ${1}px`,
        xmlns: 'http://www.w3.org/1999/xhtml'
    }, 'http://www.w3.org/1999/xhtml');
    const input = createElement('input', {
        type: 'text',
        style: `width: ${16}px; text-align: center;`
    }, 'http://www.w3.org/1999/xhtml');
    input.oninput = onInput;
    div.appendChild(input);
    obj.appendChild(div);
    return obj;
}
function createArrow({x1, x2, y, h, attr}) {
    h = h || 40;
    const g = createElement('g', attr);
    let vertex = [(x1 + x2) / 2, y - h];
    let tangetn = [x2 - (x2 - x1) / 4, vertex[1]];
    let toTangent = Math.sqrt((x2 - tangetn[0]) * (x2 - tangetn[0]) + (y - tangetn[1]) * (y - tangetn[1]));
    let arrowLen = 8;
    g.appendChild(createElement('path', {
        d: `M ${x1} ${y} Q ${x1 + (x2 - x1) / 4} ${vertex[1]},
            ${vertex[0]} ${vertex[1]} T 
            ${x2} ${y}`
    }));
    g.appendChild(createElement('line', {
        x2: arrowLen * ((tangetn[0] - x2) / toTangent),
        y2: arrowLen * ((tangetn[1] - y) / toTangent),
        transform: `translate(${x2},${y}) rotate(30)`
    }));
    g.appendChild(createElement('line', {
        x2: arrowLen * ((tangetn[0] - x2) / toTangent),
        y2: arrowLen * ((tangetn[1] - y) / toTangent),
        transform: `translate(${x2},${y}) rotate(-30)`
    }));
    g.arrCoord = {
        vertex
    };
    return g;
}
function createAxis({start, length, d, attr}) {
    const HEIGHT = 28;
    const DASH_HEIGHT = 12;
    const MARGIN = [8, 16];
    const x1 = 0, x2 = length * d;
    const g = createElement('g', {
        'stroke-width': '1',
        'stroke': 'black',
        ...attr
    });
    g.appendChild(createElement('rect', {
        width: x2 - x1 + 2 * MARGIN[1],
        rx: MARGIN[1],
        ry: MARGIN[0],
        height: HEIGHT + 2 * MARGIN[0],
        style: `fill: #fff1b2; stroke-width: 0; opacity: 0.5`
    }));
    const lineWithDash = createElement('g', {
        transform: `translate(${MARGIN[1]},${MARGIN[0]})`
    });
    lineWithDash.appendChild(createElement('line', {
        x1: x1,
        x2: x2,
        y1: DASH_HEIGHT / 2,
        y2: DASH_HEIGHT / 2
    }));
    lineWithDash.appendChild(createElement('line', {
        x1: 0,
        x2: -d / 2,
        transform: `translate(${x2},${DASH_HEIGHT / 2}) rotate(45) `
    }));
    lineWithDash.appendChild(createElement('line', {
        x1: 0,
        x2: -d / 2,
        transform: `translate(${x2},${DASH_HEIGHT / 2}) rotate(-45) `
    }));
    const arrCoord = {};
    for (let i = 0; i < length; ++i) {
        let isBig = i % 5 === 0;
        let dashHeight = isBig ? 1 : 0.8;
        lineWithDash.appendChild(createElement('line', {
            x1: i * d,
            x2: i * d,
            y1: DASH_HEIGHT * (1 - dashHeight) / 2,
            y2: DASH_HEIGHT * (1 - (1 - dashHeight) / 2),
            'stroke-width': isBig ? 1.5 : 'inherit'
        }));

        lineWithDash.appendChild(createText(start + i, {
            x: i * d,
            y: DASH_HEIGHT + 2 + 16,
            'font-size': isBig ? 16 : 14,
            'stroke-width': isBig ? 1.3 : 'inherit',
            'class': 'unselectable',
            'text-anchor': 'middle'
        }));
        arrCoord[start + i] = [i * d + MARGIN[1], DASH_HEIGHT / 2 + MARGIN[0]];
    }
    g.appendChild(lineWithDash);
    g.arrCoord = arrCoord;
    return g;
}
function randomInt(a, b) {
    return Math.floor(a + Math.random() * (b - a + 0.999));
}
function generateQuest() {
    //a​​∈ [6, 9], a+b ​∈ [11, 14]
    const a = randomInt(6, 9);
    const b = randomInt(11 - a, 14 - a);
    const c = a + b;
    return {
        a, b, c
    }

}
document.addEventListener("DOMContentLoaded", function () {
    const {
        drawText,
        drawArrow,
        drawInputUpArrow,
        drawInput
    } = init();


    const quest = generateQuest();
    const node = {};


    let stages = {
        0: function () {
            node.a = drawText(quest.a, 'a');
            node.sign = drawText('+', 'sign');
            node.b = drawText(quest.b, 'b');
            node.eq = drawText('=', 'eq');
            node.c = drawText('?', 'c');
            stages.getNum(node.a, quest.a);
        },
        getNum: function (textNode, questInt, prevInt) {
            prevInt = prevInt || 0;
            let arrow = drawArrow(prevInt, prevInt + questInt);
            let input = drawInputUpArrow(arrow, (e, d) => {
                let inputField = input.firstChild.firstChild;
                let {value} = e.target;
                if (value == questInt) {
                    textNode.filler.setAttribute('fill', 'none');
                    d();
                    prevInt === 0 ? stages.getNum(node.b, quest.b, questInt) : stages.getEq();
                } else if (value === '') {
                    textNode.filler.setAttribute('fill', 'none');
                    inputField.style.color = 'black';
                } else {
                    textNode.filler.setAttribute('fill', 'orange');
                    inputField.style.color = 'red';
                }
            });
            input.firstChild.firstChild.focus();
        },
        getEq: function () {
            node.eq.parentNode.removeChild(node.c);
            let input = drawInput('c', (e, d) => {
                let inputField = input.firstChild.firstChild;
                let {value} = e.target;
                if (quest.c == value) {
                    d();
                    drawText(quest.c, 'c')
                } else if (value === '') {
                    inputField.style.color = 'black'
                } else {
                    inputField.style.color = 'red'
                }
            }, [4, 8]);
            input.firstChild.firstChild.focus();

        }
    };
    stages[0]();
});