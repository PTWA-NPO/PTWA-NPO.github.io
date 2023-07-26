export { getRandomNumberArr, shuffle, reorder, getGameConfig}


function getRandomNumberArr(start, end, tolerance, times=1) {
    let result = new Set();
    while(result.size < times) {
        const range = Math.ceil((end - start) / tolerance);
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * (range + 1));
        } while (start + randomIndex * tolerance === 0)
        if (times === 1){
            return start + randomIndex * tolerance;
        }
        const number = start + randomIndex * tolerance;
        result.add(number)
    }
    return [...result]
  }

function shuffle(originArray){
    // Fisher-Yates shuffle algorithm
    let array = [...originArray]
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
  

function reorder(parentElement) {
    // Detach child elements
    let childElements = parentElement.children().detach();

    // Reorder child elements
    childElements = childElements.sort(function(a, b) {
      return Math.random() - 0.5;
    });

    // Re-append child elements in the new order
    parentElement.append(childElements);
}

function createAngle(angle, rotationAngle, centerX, centerY) {
    const lineLength = 200;
    angle *= Math.PI / 180;
    rotationAngle *= Math.PI / 180;
    const xA = centerX + lineLength * Math.cos(rotationAngle);
    const yA = centerY - lineLength * Math.sin(rotationAngle);
    const xB = centerX + lineLength * Math.cos(rotationAngle + angle);
    const yB = centerY - lineLength * Math.sin(rotationAngle + angle);

    return `
      <line x1="${centerX}" y1="${centerY}" x2="${xA}" y2="${yA}" stroke="black" stroke-width="4" />
      <line x1="${centerX}" y1="${centerY}" x2="${xB}" y2="${yB}" stroke="black" stroke-width="4" />
    `;
}

function createFanShape(cx, cy, radius, startAngle, endAngle) {
    startAngle *= Math.PI / 180;
    endAngle *= Math.PI / 180;
    const start = {
        x: cx + Math.cos(startAngle) * radius,
        y: cy + Math.sin(startAngle) * radius
    };
    const end = {
        x: cx + Math.cos(endAngle) * radius,
        y: cy + Math.sin(endAngle) * radius
    };

    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "fanShape");
    path.setAttribute("fill", "lightblue");
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("d", `
        M ${cx} ${cy}
        L ${start.x} ${start.y}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
        Z
    `);
    return path
}

function createLine({...extra}={}) {
    const defaults = {
        stroke: "black"
        , strokeWidth: "2"
        , strokeDasharray: ""
        , x1: 0
        , y1: 0
        , x2: 0
        , y2: 0
    };
    const settings = { ...defaults, ...extra };
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', `${settings.x1}`);
    line.setAttribute('y1', `${settings.y1}`);
    line.setAttribute('x2', `${settings.x2}`);
    line.setAttribute('y2', `${settings.y2}`);
    $(line).css({"stroke": settings.stroke
                , "stroke-width": settings.strokeWidth
                , "stroke-dasharray": settings.strokeDasharray});
    return line;
}

export function randomNumber(start, end) {
    return Math.floor(Math.random() * (end - start) + start);
}

async function getGameConfig() {
    return fetch('./game_config.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((jsonData) => {
            const gameData = jsonData;
            return gameData;
        })
        .catch((error) => {
            console.error('Error fetching JSON file:', error);
        });
}