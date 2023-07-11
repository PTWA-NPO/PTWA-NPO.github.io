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

