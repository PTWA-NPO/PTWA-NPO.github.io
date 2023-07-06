import * as constant from "./constant.js"

const helpModules = {
    getRandomNumberArr(start, end, tolerance = 1, times = 1) {
        let result = new Set();
        const range = Math.ceil((end - start) / tolerance);
        while (result.size < times) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * (range + 1));
            } while (start + randomIndex * tolerance === 0)
            result.add(start + randomIndex * tolerance);
        }
        return times === 1 ? [...result][0] : [...result];
    },

    shuffle(array) {
        array = [...array];
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    reorder(...parentElements) {
        parentElements.forEach(parentElement => {
            let childElements = parentElement.children().detach();
            childElements = childElements.sort(() => Math.random() - 0.5);
            parentElement.append(childElements);
        });
    },

    randomNumber(start, end) {
        return Math.floor(Math.random() * (end - start) + start);
    }
};

const svgModules = {
    createAngle(centerX, centerY, angle, rotationAngle) {
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
    },

    createFanShape(cx, cy, radius, startAngle, endAngle) {
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
    },

    getNewLine({ ...extra } = {}) {
        const defaults = {
            stroke: "black",
            strokeWidth: "4",
            strokeDasharray: "",
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };
        const settings = { ...defaults, ...extra };
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', `${settings.x1}`);
        line.setAttribute('y1', `${settings.y1}`);
        line.setAttribute('x2', `${settings.x2}`);
        line.setAttribute('y2', `${settings.y2}`);
        $(line).css({ "stroke": settings.stroke, "stroke-width": settings.strokeWidth, "stroke-dasharray": settings.strokeDasharray });
        return line;
    }
};

const gameModules = {
    async getJson(fileName) {
        try {
            const response = await fetch(fileName);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching JSON file:', error);
        }
    },

    showResultView(options) {
        this.playResultSound(options === constant.BINGO, options === constant.BINGO ? '#bingo' : '#dada', options === constant.BINGO ? '#correct' : '#wrong');
    },

    playResultSound(isCorrect, graphId, soundId) {
        const graph = $(graphId);
        const sound = $(soundId)[0];
        graph.css('display', 'block');
        sound.play();
        setTimeout(() => { graph.css('display', 'none'); }, 500);
    }
}

export { helpModules, svgModules, gameModules };
