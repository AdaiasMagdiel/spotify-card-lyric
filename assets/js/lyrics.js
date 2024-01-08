const search = document.querySelector('.search')
let TOTAL_LYRIC = 0

const modal = document.querySelector('#modal')
const modalBox = document.querySelector('.modal__wrapper')
const modalClose = document.querySelector('.modal__close')

const lyricModal = document.querySelector('#lyric-box')
const lyricModalBox = document.querySelector('.lyric-box__wrapper')
const lyricModalClose = document.querySelector('.lyric__close')
const lyricModalTrigger = document.querySelector('.generate-card')

async function evalSearch(artistName, songName) {
	const res = await fetch(`https://api.vagalume.com.br/search.php?art=${artistName}&mus=${songName}&extra=alb&apikey=660a4395f992ff67786584e238f501aa`)
	const data = await res.json()

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
		modal.classList.remove('show')
		search.disabled = false

		drawLyricModal(img, artist, song, lyric)
	})

	return result
}

function drawModal(data) {
	modalBox.innerHTML = '<button class="modal__close">X</button>'

	for (let item of data.mus) {
		const img = item.alb.url.replace('html', 'jpg')
		const artist = data.art.name
		const song = item.name

		const result = createResult(img, artist, song, item.text)
		modalBox.appendChild(result)
	}

	modal.classList.add('show')
}

function createLyricButton(content) {
	const button = document.createElement('button')
	button.appendChild(document.createTextNode(content))

	button.addEventListener('click', (e) => {
		const isActive = e.currentTarget.className.includes('active')

		if (isActive) {
			e.currentTarget.classList.remove('active')
			TOTAL_LYRIC--
		}
		else {
			if (TOTAL_LYRIC === 7) return

			e.currentTarget.classList.add('active')
			TOTAL_LYRIC++
		}
	})

	return button
}

function drawLyricModal(img, artistName, songName, lyricContent) {
	TOTAL_LYRIC = 0
	
	const image = document.querySelector('#lyric-box .header__img')
	const artist = document.querySelector('#lyric-box .header__info_artist')
	const song = document.querySelector('#lyric-box .header__info_song')
	const body = document.querySelector('#lyric-box .body')

	image.src = img
	artist.innerText = artistName
	song.innerText = songName
	body.innerHTML = ''

	for (let excerpt of lyricContent.split('\n')) {
		if (excerpt === '') continue

		const button = createLyricButton(excerpt)
		body.appendChild(button)
	}

	lyricModal.classList.add('show')
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


modal.addEventListener('click', (e) => {
	if (e.target !== e.currentTarget) return
	modal.classList.remove('show')
	search.disabled = false
})
modalClose.addEventListener('click', (e) => {
	modal.classList.remove('show')
	search.disabled = false
})

lyricModal.addEventListener('click', (e) => {
	if (e.target !== e.currentTarget) return
	lyricModal.classList.remove('show')
	search.disabled = false
})
lyricModalClose.addEventListener('click', (e) => {
	lyricModal.classList.remove('show')
	search.disabled = false
})

lyricModalTrigger.addEventListener('click', () => {
	const img = document.querySelector('#lyric-box .header__img')
	const artist = document.querySelector('#lyric-box .header__info_artist')
	const song = document.querySelector('#lyric-box .header__info_song')
	const lyric = Array.from(document.querySelectorAll('#lyric-box .body button'))
		.filter(item => item.className.includes('active'))
		.map(item => item.innerText)
		.join('\n')

	inputFields.artist.value = artist.innerText
	inputFields.song.value = song.innerText
	inputFields.lyric.value = lyric
	inputFields.cover.value = img.src
	draw()

	lyricModal.classList.remove('show')
})
