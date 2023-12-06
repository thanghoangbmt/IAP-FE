export const BASE_API_URL = "https://iapcapstone.azurewebsites.net/api/auvik";

export const SEVERITY_MAP = [
    {
        id: 6,
        text: 'Informational'
    },
    {
        id: 4,
        text: 'Warning'
    },
    {
        id: 3,
        text: 'Error'
    },
    {
        id: 5,
        text: 'Notice'
    },
    {
        id: 0,
        text: 'Emergency'
    },
    {
        id: 1,
        text: 'Alert'
    },
    {
        id: 2,
        text: 'Critical'
    },
    {
        id: 7,
        text: 'Debug'
    }

]

function getRandomHexColor(length) {
    const characters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        color += characters[randomIndex];
    }

    return color;
}

export function generateRandomColorsArray(arrayLength, hexLength) {
    const colorsArray = [];

    for (let i = 0; i < arrayLength; i++) {
        const randomColor = getRandomHexColor(hexLength);
        colorsArray.push(randomColor);
    }

    return colorsArray;
}