const songs = document.querySelectorAll('.song')
const songs_Section = document.querySelectorAll('#songs')
const audio_Tag = document.querySelector('#audio_Tag')
const play_Btn = document.querySelector('#play_Btn')
const pause_Btn = document.querySelector('#pause_Btn')
const play_Cover = document.querySelector('#play_Cover')
const play_Name = document.querySelector('#play_Name')
const play_Artist = document.querySelector('#play_Artist')
const forward = document.querySelector('#forward')
const backward = document.querySelector('#backward')
const current_Time = document.querySelector('#currentTime')
const track_Duration = document.querySelector('#track_Duration')
const current_Position = document.querySelector('#current_Position')
const seek_Btn = document.querySelector('#seek_Btn')
const seek_Mouse_Move = document.querySelector('#seek_Mouse_Move')
const seek_Bar = document.querySelector('#seek_Bar')
const repeat = document.querySelector('#repeat')
const shuffle = document.querySelector('#shuffle')
const volume_Bar = document.querySelector('#volume_Bar')
const current_Volume = document.querySelector('#current_Volume')
const volume_Btn = document.querySelector('#volume_Btn')
const volume_Mouse_Move = document.querySelector('#volume_Mouse_Move')
const volume = document.querySelector('#volume')


// onload setup
let turn = 0

let src_Cover_Full = songs[0].children[2].children[0].src
let src_Cover = src_Cover_Full.substring(src_Cover_Full.lastIndexOf("src"));
play_Cover.setAttribute('src', src_Cover)

play_Name.textContent = songs[0].children[3].children[0].textContent
play_Artist.textContent = songs[0].children[3].children[1].textContent

song_Src = songs[0].getAttribute('data-src')
audio_Tag.src = song_Src

let duration_Full

audio_Tag.addEventListener("loadedmetadata", () => {
    duration_Full = Math.floor(audio_Tag.duration)
    let duration_Minutes = Math.floor(duration_Full / 60)
    let duration_Seconds = duration_Full % 60
    duration_Seconds = String(duration_Seconds).padStart(2, "0")
    track_Duration.textContent = duration_Minutes + ":" + duration_Seconds
})
// onload setup


// play track by click on songs
songs.forEach((item, index) => {
    item.addEventListener('click', (e) => {

        turn = index

        play_Track(turn)

        pause_Btn.style.display = 'flex'
        play_Btn.style.display = 'none'

    }, false)
})
// play track by click on songs


// play music and set the audio tag infos
function play_Track(turn) {
    src_Cover_Full = songs[turn].children[2].children[0].src
    src_Cover = src_Cover_Full.substring(src_Cover_Full.lastIndexOf("src"));
    play_Cover.setAttribute('src', src_Cover)
    
    play_Name.textContent = songs[turn].children[3].children[0].textContent
    play_Artist.textContent = songs[turn].children[3].children[1].textContent
    
    
    song_Src = songs[turn].getAttribute('data-src')
    audio_Tag.src = song_Src
    
    audio_Tag.play()
    
    flag++
    
}
// play music and set the audio tag infos


// play or resume music
play_Btn.addEventListener('click', (e) => {
    pause_Btn.style.display = 'flex'
    play_Btn.style.display = 'none'
    audio_Tag.play()
    flag++
})
// play or resume music


// pause music
pause_Btn.addEventListener('click', (e) => {
    pause_Btn.style.display = 'none'
    play_Btn.style.display = 'flex'
    audio_Tag.pause()
    flag++
})
// pause music


// go to next music
forward.addEventListener('click', (e) => {
    if (shuffle_On) {
        let rand_Turn = Math.floor(Math.random() * songs.length)
        if (rand_Turn == turn) {
            rand_Turn += 10
            if (rand_Turn > (songs.length - 1)) {
                rand_Turn -= 20
            }
        }
        turn = rand_Turn
        play_Track(turn)
    } else {
        turn++
        if (turn > songs.length - 1) turn = 0
        play_Track(turn)
    }


    pause_Btn.style.display = 'flex'
    play_Btn.style.display = 'none'
})
// go to next music


// go to previous music
backward.addEventListener('click', (e) => {
    if (shuffle_On) {
        let rand_Turn = Math.floor(Math.random() * songs.length)
        if (rand_Turn == turn) {
            and_Turn += 10
            if (rand_Turn > (songs.length - 1)) {
                rand_Turn -= 20
            }
        }
        turn = rand_Turn
        play_Track(turn)
    }
    turn--

    if (turn < 0) turn = songs.length - 1
    play_Track(turn)

    pause_Btn.style.display = 'flex'
    play_Btn.style.display = 'none'
})
// go to previous music


// update time and autoplay
function updateTime_Func(e) {
    let time = Math.floor(e.currentTime)
    let minutes = Math.floor(time / 60)
    let seconds = time % 60
    seconds = String(seconds).padStart(2, "0")
    current_Time.textContent = minutes + ":" + seconds

    current_Position.style.width = Math.floor((time / duration_Full) * 100) + '%'

    if (current_Time.textContent == track_Duration.textContent) {
        if (repeat_On) {
            audio_Tag.play()
        } else if (shuffle_On) {
            let rand_Turn = Math.floor(Math.random() * songs.length)
            if (rand_Turn == turn) {
                rand_Turn += 10
                if (rand_Turn > (songs.length - 1)) {
                    rand_Turn -= 20
                }
            }
            turn = rand_Turn
            play_Track(turn)
        } else {
            turn++
            play_Track(turn)
        }
    }

}
// update time and autoplay


// seek bar
const seek_Bar_Width = seek_Bar.clientWidth

let computed_Position

let is_Dragging = false


function getSeekPercentage(e) {
    const rect = seek_Bar.getBoundingClientRect()
    let offset_X = e.clientX - rect.left

    if (offset_X < 0) offset_X = 0
    if (offset_X > rect.width) offset_X = rect.width

    return (offset_X / rect.width) * 100
}

seek_Bar.addEventListener('mousemove', (e) => {
    if (!is_Dragging) {
        const hover_Position = getSeekPercentage(e)
        seek_Mouse_Move.style.width = hover_Position + '%'
    }
})

seek_Bar.addEventListener('mouseleave', () => {
    if (!is_Dragging) {
        seek_Mouse_Move.style.width = '0%'
    }
})

seek_Bar.addEventListener('click', (e) => {
    const click_Position = getSeekPercentage(e)
    current_Position.style.width = click_Position + '%'
    if (duration_Full) {
        audio_Tag.currentTime = Math.floor((click_Position * duration_Full) / 100)
    }
})

seek_Btn.addEventListener('mousedown', (e) => {
    e.stopPropagation()
    is_Dragging = true
})

document.addEventListener('mousemove', (e) => {
    if (is_Dragging) {
        computed_Position = getSeekPercentage(e)
        current_Position.style.width = computed_Position + '%'
        seek_Mouse_Move.style.width = '0%'
    }
})

document.addEventListener('mouseup', () => {
    if (is_Dragging) {
        is_Dragging = false
        if (duration_Full) {
            audio_Tag.currentTime = Math.floor((computed_Position * duration_Full) / 100)
        }
        if (!audio_Tag.paused) {
            audio_Tag.play()
        }
    }
})
// seek bar


// volume bar
const volume_Bar_Width = volume_Bar.clientWidth

let computed_Volume_Position

let is_Volume_Dragging = false


function getVolumePercentage(e) {
    const rect = volume_Bar.getBoundingClientRect()
    let offset_X_Volume = e.clientX - rect.left
    
    if (offset_X_Volume < 0) offset_X_Volume = 0
    if (offset_X_Volume > rect.width) offset_X_Volume = rect.width
    
    return (offset_X_Volume / rect.width) * 100
}

volume_Bar.addEventListener('mousemove', (e) => {
    if (!is_Volume_Dragging) {
        const hover_Volume_Position = getVolumePercentage(e)
        volume_Mouse_Move.style.width = hover_Volume_Position + '%'
    }
})

volume_Bar.addEventListener('mouseleave', () => {
    if (!is_Volume_Dragging) {
        volume_Mouse_Move.style.width = '0%'
    }
})

volume_Bar.addEventListener('click', (e) => {
    if(is_Muted) {
        is_Muted = false
        volume.classList.add('unmute')
        volume.classList.remove('mute')
    }
    const click_Volume_Position = getVolumePercentage(e)
    current_Volume.style.width = click_Volume_Position + '%'
    audio_Tag.volume = parseFloat(click_Volume_Position / 100)
})

volume_Btn.addEventListener('mousedown', (e) => {
    e.stopPropagation()
    if(is_Muted) {
        is_Muted = false
        volume.classList.add('unmute')
        volume.classList.remove('mute')
    }
    is_Volume_Dragging = true
})

document.addEventListener('mousemove', (e) => {
    if (is_Volume_Dragging) {
        computed_Volume_Position = getVolumePercentage(e)
        current_Volume.style.width = computed_Volume_Position + '%'
        volume_Mouse_Move.style.width = '0%'
    }
})

document.addEventListener('mouseup', () => {
    if (is_Volume_Dragging) {
        is_Volume_Dragging = false
        audio_Tag.volume = parseFloat(computed_Volume_Position / 100)
    }
})
// volume bar


// mute and unmute
let is_Muted = false
let saved_Volume = 1

volume.addEventListener('click', (e) => {
    e.stopPropagation()
    
    if (is_Muted) {
        audio_Tag.volume = saved_Volume
        current_Volume.style.width = (saved_Volume * 100) + '%'
        volume.classList.add('unmute')
        volume.classList.remove('mute')
        is_Muted = false
    } else {
        if (audio_Tag.volume > 0) {
            saved_Volume = audio_Tag.volume
        }
        audio_Tag.volume = 0
        current_Volume.style.width = '0%'
        volume.classList.remove('unmute')
        volume.classList.add('mute')
        is_Muted = true
    }
})
// mute and unmute


// play and pause with enter key
let flag = 0

window.addEventListener('keyup', (e) => {
    if (e.keyCode == 32 || e.which == 32) {
        flag++
        if (flag % 2) {
            pause_Btn.style.display = 'flex'
            play_Btn.style.display = 'none'
            audio_Tag.play()
        } else {
            pause_Btn.style.display = 'none'
            play_Btn.style.display = 'flex'
            audio_Tag.pause()
        }
    }
})
// play and pause with enter key



// repeat music
let repeat_On = false

repeat.addEventListener('click', (e) => {
    repeat_On = !repeat_On
    if (repeat_On) {
        repeat.style.color = '#1ed760'
    } else {
        repeat.style.color = '#ffffff'
    }
})
// repeat music



// shuffle play
let shuffle_On = false

shuffle.addEventListener('click', (e) => {
    shuffle_On = !shuffle_On
    if (shuffle_On) {
        shuffle.style.color = '#1ed760'
    } else {
        shuffle.style.color = '#ffffff'
    }
})
// shuffle play
