const cover = document.querySelector('#coverImage')
const song = document.querySelector('#song')
const artist = document.querySelector('#artist')
const lyric = document.querySelector('#lyric')

const canvas = document.querySelector('#result')
const ctx = canvas.getContext('2d')

const buttons = document.querySelectorAll('.colors button')
const COLORS = {
	lime: '#267d50'
}
let actualColor = COLORS.lime

const PADDING = 75
const SPACING = 15
const IMAGE_PERCENT = 20.45

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

    for (var i = 0; i < words.length; i++) {
        var testLine = line + words[i] + ' ';
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, yPosition);
            line = words[i] + ' ';
            yPosition += lineHeight;
        } else {
            line = testLine;
        }
    }

    ctx.fillText(line, x, yPosition);
}

function writeSongName() {
	const x = (IMAGE_PERCENT / 100 * canvas.width) + SPACING + PADDING
	const y = PADDING + ((IMAGE_PERCENT / 100 * canvas.width) / 2) - SPACING
	const maxWidth = canvas.width - PADDING

	ctx.fillStyle = "#fff"
	ctx.font = "bold 45px Arial";
	ctx.textBaseline = 'middle'
	drawText(song.value, x, y, maxWidth)
}

function writeArtistName() {
	const x = (IMAGE_PERCENT / 100 * canvas.width) + SPACING + PADDING
	const y = PADDING + ((IMAGE_PERCENT / 100 * canvas.width) / 2) + 2 * SPACING
	const maxWidth = canvas.width - 2* PADDING

	ctx.fillStyle = "#ccc"
	ctx.font = "40px Arial";
	ctx.textBaseline = 'middle'
	drawText(artist.value, x, y, maxWidth)
}

function writeLyric() {
	const x = PADDING
	const y = (IMAGE_PERCENT / 100 * canvas.width) + SPACING + 2 * PADDING
	const maxWidth = canvas.width - PADDING

	ctx.fillStyle = "#fff"
	ctx.font = "bold 60px Arial";
	ctx.textBaseline = 'middle'
	drawText(lyric.value, x, y, maxWidth, 60)
}

function draw() {
	ctx.fillStyle = actualColor
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	drawImage()
	writeSongName()
	writeArtistName()
	writeLyric()
}

Array.from([song, artist]).forEach(elm => {
	elm.addEventListener('input', draw)
})

draw()
