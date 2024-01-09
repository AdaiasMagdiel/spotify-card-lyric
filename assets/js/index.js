const cover = document.querySelector('#coverImage')
const song = document.querySelector('#song')
const artist = document.querySelector('#artist')
const lyric = document.querySelector('#lyric')
const colorsBox = document.querySelector('.colors')
const saveButton = document.querySelector('.save')

const canvas = document.querySelector('#result')
const ctx = canvas.getContext('2d')

const COLORS = {
    darkred: '#8B0000',
    tomato: '#FF6347',
    coral: '#FF6347',
    indianred: '#CD5C5C',
    mediumvioletred: '#C71585',
    chocolatebrown: '#D2691E',
    peru: '#CD853F',
    gold: '#FFD700',
    mustardyellow: '#FFDB58',
    silvergray: '#C0C0C0',
    lavender: '#E6E6FA',
    mediumorchid: '#BA55D3',
    darkmagenta: '#8B008B',
    violet: '#8A2BE2',
    indigo: '#4B0082',
    royalblue: '#4169E1',
    steelblue: '#4682B4',
    darkslategray: '#2F4F4F',
    midnightblue: '#191970',
    turquoise: '#40E0D0',
    mediumseagreen: '#3CB371',
    limegreen: '#32CD32',
    forestgreen: '#228B22',
    teal: '#008080',
    skyblue: '#87CEEB',
    palegoldenrod: '#EEE8AA',
    lime: '#1DB954',
    greenyellow: '#ADFF2F',
};


let actualColor = Object.values(COLORS)[0];
let textColor = getContrastColor(actualColor)
let fontFamily = 'Arial, sans-serif'

const PADDING = 75
const SPACING = 15
const IMAGE_PERCENT = 20.45

function slugify(text) {
    return text.toString().toLowerCase()
	    .replace(/\s+/g, '-')
	    .replace(/[^\w\-]+/g, '')
	    .replace(/\-\-+/g, '-')
	    .replace(/^-+/, '')
	    .replace(/-+$/, '');
}

function getContrastColor(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? '#000000' : '#FFFFFF';
}

function addTransparencyToHexColor(hexColor, transparency) {
    transparency = Math.min(1, Math.max(0, transparency));

    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${transparency})`;
}


function generateButtonColors() {
	for (let key in COLORS) {
		const button = document.createElement('button')
		button.style.backgroundColor = COLORS[key]

		button.addEventListener('click', () => {
			actualColor = COLORS[key]
			textColor = getContrastColor(actualColor)
			draw()
		})

		colorsBox.appendChild(button)
	}
}

function drawImage() {
	const image = new Image()
	image.src = cover.value
	image.crossOrigin = "anonymous"

	const size = IMAGE_PERCENT / 100 * canvas.width

	image.addEventListener('load', () => {
		ctx.drawImage(image, PADDING, PADDING, size, size)
	})
}

function drawText(text, x, y, maxWidth, lineHeight = 20) {
    const words = text.split(' ');
    let line = '';
    let yPosition = y;
    let lineCount = 1;

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, x, yPosition);
            line = words[i] + ' ';
            yPosition += lineHeight;
            lineCount++;
        } else {
            line = testLine;
        }
    }

    ctx.fillText(line, x, yPosition);

    return lineCount;
}


function writeSongName() {
	let x = (IMAGE_PERCENT / 100 * canvas.width) + SPACING + PADDING
	let y = PADDING + ((IMAGE_PERCENT / 100 * canvas.width) / 2) - SPACING
	const maxWidth = canvas.width - PADDING * 2

	ctx.fillStyle = textColor
	ctx.font = "600 45px " + fontFamily;
	ctx.textBaseline = 'middle'

	if (song.value.split(' ').length > 6) {
		const times = Math.floor(song.value.split(' ').length / 6)

		for (let i=0; i<times; i++) y -= 45
	}

	drawText(song.value, x, y, maxWidth, 45)
}

function writeArtistName() {
	const x = (IMAGE_PERCENT / 100 * canvas.width) + SPACING + PADDING
	const y = PADDING + ((IMAGE_PERCENT / 100 * canvas.width) / 2) + 2 * SPACING
	const maxWidth = canvas.width - 2* PADDING

	ctx.fillStyle = addTransparencyToHexColor(textColor, .75)
	ctx.font = "40px " + fontFamily;
	ctx.textBaseline = 'middle'
	drawText(artist.value, x, y, maxWidth)
}

function writeLyric() {
	let x = PADDING
	let y = (IMAGE_PERCENT / 100 * canvas.width) + SPACING + 2 * PADDING
	const maxWidth = canvas.width - PADDING

	const fontSize = 55

	ctx.fillStyle = textColor
	ctx.font = `600 ${fontSize}px ${fontFamily}`;
	ctx.textBaseline = 'middle'

	for (let letter of lyric.value.split('\n')) {
		let lines = drawText(letter, x, y, maxWidth, fontSize-5)
		y += (SPACING * 2) + (60 * lines)
	}
}

function drawWatermark() {
	const fontSize = 18

	ctx.fillStyle = textColor
	ctx.font = `600 ${fontSize}px ${fontFamily}`;
	ctx.textBaseline = 'center'
	ctx.textAlign = 'middle'

	const watermark = 'adaiasmagdiel.github.io/spotify-card-lyric'.toUpperCase()
	const metrics = ctx.measureText(watermark);
	const x = canvas.width / 2 - metrics.width / 2
	const y = canvas.height - PADDING / 3

	const rectX = 0;
	const sizeX = canvas.width
	const rectY = canvas.height - PADDING / 3 - 1.5*fontSize
	const sizeY = fontSize * 4

	ctx.fillStyle = actualColor
	ctx.fillRect(rectX, rectY, sizeX, sizeY)

	ctx.fillStyle = textColor
	ctx.fillText(watermark, x, y)

	ctx.textBaseline = 'alphabetic'
	ctx.textAlign = 'start'
}

function createImage(canvas) {
	const dataURL = canvas.toDataURL('image/png')
	const link = document.createElement('a')

	link.href = dataURL
	link.download = `${slugify(song.value)}_${slugify(artist.value)}.png`

	link.click()
}

function draw() {
	ctx.fillStyle = actualColor
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	drawImage()
	writeSongName()
	writeArtistName()
	writeLyric()
	drawWatermark()
}

Array.from([song, artist, lyric]).forEach(elm => {
	elm.addEventListener('input', draw)
})

cover.addEventListener('input', (e) => {
	const image = new Image()
	image.src = e.target.value
	image.crossOrigin = "anonymous"

	image.addEventListener('load', draw)
})

saveButton.addEventListener('click', () => createImage(canvas))

generateButtonColors()

document.fonts.ready.then(() => {
	fontFamily = 'Poppins, sans-serif'
    draw();
});

window.inputFields = {
	cover, song, artist, lyric, draw
}
