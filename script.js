document.addEventListener("DOMContentLoaded", () => {
    const songList = document.getElementById("song-list");
    const audio = document.getElementById("audio");
    const playPauseBtn = document.getElementById("play-pause");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const currentSongText = document.getElementById("current-song");
    const seekBar = document.getElementById("seek-bar");
    const volumeControl = document.getElementById("volume-control");

    let songs = [];
    let currentIndex = 0;

    // Song database with thumbnails (Online Image URLs)
    const songDatabase = [
        { 
            title: "Blinding Lights", 
            artist: "The Weeknd", 
            src: "songs/blinding_lights.mp3",
            thumbnail: "https://imgs.search.brave.com/hh0jpkRDjIHLhPGOFs81mQHjJa9DJtcNYmvFz56yQ_U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLW9TVklv/UHpuMGZVOC0wLXQ1/MDB4NTAwLmpwZw"
        },
        { 
            title: "Shape of You", 
            artist: "Ed Sheeran", 
            src: "songs/shape_of_you.mp3",
            thumbnail: "https://imgs.search.brave.com/M5aCv-D2yS-w3l4RhGhD9wtLVHZSjXD1Dz5-wAut7sI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLUNkem85/REFqd24xZC0wLXQx/MDgweDEwODAuanBn"
        },
        { 
            title: "Levitating", 
            artist: "Dua Lipa", 
            src: "songs/Levitating.mp3",
            thumbnail: "https://imgs.search.brave.com/SHn0ynWWiww6c5eIj2WV1U0-6iYRiKOQg1zHHVPibOw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLVZDeWls/RU54eVIxSi0wLXQx/MDgweDEwODAuanBn"
        },
        { 
            title: "Peaches", 
            artist: "Justin Bieber", 
            src: "songs/Peaches.mp3",
            thumbnail: "https://imgs.search.brave.com/TrOaNcEHT0v7lQZipkUKRC40Y899ect-CND_7BBZ21E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuY2FwaXRhbGZt/LmNvbS8yMDIyLzQz/L2p1c3Rpbi1iaWVi/ZXItMTY2Njk1Mzk3/MC1lZGl0b3JpYWwt/c2hvcnQtZm9ybS0w/LnBuZw"
        },
        { 
            title: "Crush", 
            artist: "Cigarettes After", 
            src: "songs/crush.mp3",
            thumbnail: "https://imgs.search.brave.com/79lkPO_R_ixB76tnulj2L8hes8LnMGEg0nNZjgyl-L4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLTAwMDM1/NzAyMzU4Ni02YXZr/cXAtdDEwODB4MTA4/MC5qcGc"
        },
        { 
            title: "What once was", 
            artist: "Her's", 
            src: "songs/what_once_was.mp3",
            thumbnail: "https://imgs.search.brave.com/gE0LNCT5QZMcvWVjrr_79nZvE77whAE-IY5jU9INdr0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLTAwMDE2/MDEzMDE3My11aWti/aXEtdDEwODB4MTA4/MC5qcGc"
        },
        { 
            title: "Sundress", 
            artist: "A$AP Rocky", 
            src: "songs/Sundress.mp3",
            thumbnail: "https://imgs.search.brave.com/sWTAjCEz-bKtOXX6ofTPYXMXQ8GFBJI5YAnH5g0SVpM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc3F1YXJlc3Bh/Y2UtY2RuLmNvbS9j/b250ZW50L3YxLzVi/ZmYwMjFkZTJjY2Qx/Yjc5N2I1Njc1OS8x/NTk5MDc4Mjg2Njg3/LUlWUzlMOENNUVRD/QjVFWkY4RThFL0FT/QVBfUm9ja3lfU3Vu/ZHJlc3M"
        },
        { 
            title: "Stargazing", 
            artist: "The Neighbourhood", 
            src: "songs/Stargazing.mp3",
            thumbnail: "https://imgs.search.brave.com/Kd3YPFOh17UJh84hJ9eSSOaSbiom5i2-kZmv2Rx5bhY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLW54bWdG/eTI3ZGF1Zy0wLXQ1/MDB4NTAwLmpwZw"
        }
    ];

    // Load songs into the UI
    function loadSongs() {
        songList.innerHTML = "";
        songDatabase.forEach((song, index) => {
            const songCard = document.createElement("div");
            songCard.classList.add("card");
            songCard.innerHTML = `
                <img src="${song.thumbnail}" class="song-thumbnail img-fluid mb-2" alt="${song.title}">
                <h5>${song.title}</h5>
                <p>${song.artist}</p>
                <button class="btn btn-light play-btn" data-index="${index}">Play</button>
            `;
            songList.appendChild(songCard);
        });
    
        songs = songDatabase;
        addEventListeners();
    }

    // Add event listeners to play buttons
    function addEventListeners() {
        document.querySelectorAll(".play-btn").forEach((button) => {
            button.addEventListener("click", (event) => {
                currentIndex = event.target.getAttribute("data-index");
                playSong();
            });
        });
    }

    // Play the selected song
    function playSong() {
        const song = songs[currentIndex];
        audio.src = song.src;
        audio.play();
        currentSongText.innerHTML = `<img src="${song.thumbnail}" class="small-thumbnail"> ${song.title} - ${song.artist}`;
        playPauseBtn.textContent = "⏸"; // Change to pause icon
    }

    // Toggle play/pause
    playPauseBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            playPauseBtn.textContent = "⏸";
        } else {
            audio.pause();
            playPauseBtn.textContent = "▶";
        }
    });

    // Play previous song
    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + songs.length) % songs.length;
        playSong();
    });

    // Play next song
    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % songs.length;
        playSong();
    });

    // Seek bar functionality
    audio.addEventListener("timeupdate", () => {
        seekBar.value = (audio.currentTime / audio.duration) * 100;
    });

    seekBar.addEventListener("input", () => {
        audio.currentTime = (seekBar.value / 100) * audio.duration;
    });

    // Volume control
    volumeControl.addEventListener("input", () => {
        audio.volume = volumeControl.value;
    });

    loadSongs(); // Load the songs into the page
});
