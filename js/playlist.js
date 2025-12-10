import { loadHeaderFooter, loadBarsAnimation, submitSearchForm, Playlist } from "./index.js";

loadHeaderFooter();
loadBarsAnimation();

const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', submitSearchForm);

document.addEventListener("DOMContentLoaded", () => {
    const playlistFlexEl = document.getElementById("playlist-flex");
    const playlist = new Playlist();
    playlist.init(playlistFlexEl);
});