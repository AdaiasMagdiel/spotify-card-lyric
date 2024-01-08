const search = document.querySelector('.search')
const modal = document.querySelector('#modal')
const modalBox = document.querySelector('.modal__wrapper')

async function evalSearch(artistName, songName) {
	const res = await fetch(`https://api.vagalume.com.br/search.php?art=${artistName}&mus=${songName}&extra=alb&apikey=660a4395f992ff67786584e238f501aa`)
	const data = await res.json()
	console.log(data)

	drawModal(data)
}

function createResult(img, artist, song, lyric) {
	const result = document.createElement('div')
	result.className = 'result'

	const image = new Image()
	image.src = img
	image.className = 'result__img'

	const songElm = document.createElement('p')
	songElm.className = 'result__song'
	songElm.appendChild(document.createTextNode(song))

	const artistElm = document.createElement('p')
	artistElm.className = 'result__artist'
	artistElm.appendChild(document.createTextNode(artist))

	result.appendChild(image)
	result.appendChild(songElm)
	result.appendChild(artistElm)

	result.addEventListener('click', () => {
		inputFields.artist.value = artist
		inputFields.song.value = song
		inputFields.lyric.value = lyric
		inputFields.cover.value = img

		modal.classList.remove('show')
		search.disabled = false
		draw()
	})

	return result
}

function drawModal(data) {
	modalBox.innerHTML = ''

	for (let item of data.mus) {
		const img = item.alb.url.replace('html', 'jpg')
		const artist = data.art.name
		const song = item.name

		const result = createResult(img, artist, song, item.text)
		modalBox.appendChild(result)
	}

	modal.classList.add('show')
}

search.addEventListener('click', async (e) => {
	const {artist, song} = inputFields

	if (artist.value === '') {
		artist.classList.add('error')
		return
	}

	if (song.value === '') {
		song.classList.add('error')
		return
	}

	e.currentTarget.disabled = true
	await evalSearch(artist.value, song.value)
})

document.addEventListener('click', (e) => {
	if (e.target.className.includes('search')) return

	const {artist, song} = inputFields

	if (artist.className.includes('error')) artist.classList.remove('error')
	if (song.className.includes('error')) song.classList.remove('error')
})
