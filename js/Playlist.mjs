
export class Playlist {
    constructor(storageKey = "sc-playlist") {
        this.storageKey = storageKey;
        this.songs = this.getStoredPlaylist() || [];
        this.flexEl = null;
    }

    init(flexEl) {
        this.flexEl = flexEl;
        this.renderPlaylist();
    }

    // localStorage getter, setter, clear //
    getStoredPlaylist() {
        if (!localStorage.getItem(this.storageKey)) {
            console.log("No storage key found");
            return [];
        }

        try {
            return JSON.parse(localStorage.getItem(this.storageKey));
        } catch (error) {
            console.error("Parse failed: ", error);
            return [];
        }
    }

    setPlaylist() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.songs));
    }

    clearPlaylist() {
        this.songs = [];
        this.setPlaylist();
    }

    // Playlist features //
    addToPlaylist(song) {
        if (!song || !song.mbid) { return; }

        //if song already exists in playlist, return
        if (this.songs.some(currSong => currSong.mbid === song.mbid)) {
            alert(`${song.title} already in playlist!`);
            return;
        }

        this.songs.push(song);
        this.setPlaylist();
    }

    removeSong(mbid) {
        // remove song that matches mbid
        this.songs = this.songs.filter(song => song.mbid != mbid);
        this.setPlaylist();
        this.renderPlaylist();
    }

    getCurrPlaylist() {
        return this.songs;
    }

    renderPlaylist() {
        this.flexEl.innerHTML = "";

        // cards
        this.songs.forEach(song => {
            const card = document.createElement("div");
            card.className = "pl-song-card";

            card.innerHTML = `
            <img src="${song.coverArt}" class="cover-art">
            <p>${song.title}</p>
            <p>${song.artist}</p>
            <button class="remove-button" data-mbid="${song.mbid}">❌</button>
        `;

            this.flexEl.appendChild(card);
        });

        // remove buttons
        this.flexEl.querySelectorAll(".remove-button").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const mbid = e.currentTarget.dataset.mbid;
                this.removeSong(mbid);
            });
        });
    }

}

