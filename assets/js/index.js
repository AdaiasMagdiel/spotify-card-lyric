const cover = document.querySelector('#coverImage')
const song = document.querySelector('#song')
const artist = document.querySelector('#artist')
const lyric = document.querySelector('#lyric')
const colorsBox = document.querySelector('.colors')

const canvas = document.querySelector('#result')
const ctx = canvas.getContext('2d')

const COLORS = {
	lime: '#1DB954',
	turquoise: '#40E0D0',
    indigo: '#4B0082',
    violet: '#8A2BE2',
    mustardyellow: '#FFDB58',
    lightpink: '#FFB6C1',
    limegreen: '#32CD32',
    steelblue: '#4682B4',
    coral: '#FF6347',
    chocolatebrown: '#D2691E',
    silvergray: '#C0C0C0',
    gold: '#FFD700',
    skyblue: '#87CEEB',
};

let actualColor = COLORS.lime
let textColor = getContrastColor(actualColor)
// const fontFamily = 'Circular'
const fontFamily = 'Poppins, sans-serif'

const PADDING = 75
const SPACING = 15
const IMAGE_PERCENT = 20.45

function getContrastColor(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calcula o brilho percebido (luminosidade percebida)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Decide se deve usar texto branco ou preto com base no brilho percebido
    return brightness > 128 ? '#000000' : '#FFFFFF';
}

function addTransparencyToHexColor(hexColor, transparency) {
    // Verifique se o valor de transparência está dentro do intervalo [0, 1]
    transparency = Math.min(1, Math.max(0, transparency));

    // Converte a cor hexadecimal para RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Retorna a cor no formato RGBA
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

	const size = IMAGE_PERCENT / 100 * canvas.width

	image.addEventListener('load', () => {
		ctx.drawImage(image, PADDING, PADDING, size, size)
	})
}

function drawText(text, x, y, maxWidth, lineHeight = 20) {
    var words = text.split(' ');
    var line = '';
    var yPosition = y;
    var lineCount = 1; // Inicializa a contagem de linhas

    for (var i = 0; i < words.length; i++) {
        var testLine = line + words[i] + ' ';
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, yPosition);
            line = words[i] + ' ';
            yPosition += lineHeight;
            lineCount++; // Incrementa a contagem de linhas
        } else {
            line = testLine;
        }
    }

    ctx.fillText(line, x, yPosition);

    return lineCount; // Retorna o número de linhas
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
	ctx.fillStyle = textColor
	ctx.font = "600 25px " + fontFamily;
	ctx.textBaseline = 'start'
	ctx.textAlign = 'start'

	const watermark = 'https://adaiasmagdiel.github.io/spotify-card-lyric'.toUpperCase()
	const textSize = ctx.measureText(watermark);
	const x = canvas.width / 2 - textSize.width / 2
	const y = canvas.height - PADDING / 2

	ctx.fillText(watermark, x, y)

	ctx.textBaseline = 'alphabetic'
	ctx.textAlign = 'start'
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

	image.addEventListener('load', draw)
})

generateButtonColors()

document.fonts.ready.then(() => {
    draw();
});
