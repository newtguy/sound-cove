import { fetchSongs, formatSongs } from './index.js';

export class Results {
    constructor(query, elementId) {
        this.query = query;
        this.grid = document.getElementById(elementId);
        this.songs = [];
    }

    async init() {
        await this.calculateResults();
    }

    async calculateResults() {
        if (!this.query) {
            this.grid.textContent = "Please enter a song and/or artist above.";
            return;
        }

        const data = await fetchSongs(this.query);
        if (!data || !data.recordings || data.recordings.length < 1) {
            this.grid.textContent = "No results found.";
            return;
        }

        console.log(data.recordings);

        this.songs = await formatSongs(data.recordings);
        this.renderSongs();
    }

    renderSongs() {
        this.grid.innerHTML = '';

        // make song card for each song; class: ""
        this.songs.forEach(song => {
            const songContainer = document.createElement("section");
            songContainer.className = "song-card";
            songContainer.innerHTML = `
                <img src="${song.coverArt}" alt="Cover Art" class="cover-art">
                <div class="song-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                    <p>${song.release}</p>
                </div>
                <button class="add-song-button">Add to Playlist</button>
            `;

            songContainer.querySelector(".add-song-button").addEventListener("click", () => {
                this.addToPlaylist(song);
            });

            this.grid.appendChild(songContainer);
        });
    }

    addToPlaylist(song) {
        // call or make instance of Playlist module
    }
}
