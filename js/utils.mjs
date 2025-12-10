const HEADERPATH = "partials/header.html";
const FOOTERPATH = "partials/footer.html";
const BARS_PATH = "partials/bars.html";

const BRAINZ_URL = "https://musicbrainz.org/ws/2/recording/";
const PIXABAY_KEY = "53641821-8f9b26e08c1d3aab8335dbbf0";

// EXPORT FUNCTIONS //

export async function loadHeaderFooter() {
    //grab and render partial files
    await loadHeader();
    await loadFooter();
}

export async function loadBarsAnimation() {
    //grab and render animation
    const barsEl = document.querySelector(".bars");
    try {
        const response = await fetch(BARS_PATH);
        const html = await response.text();
        barsEl.innerHTML = html;
    } catch (error) {
        console.error("Bars error:", error);
    }
}

export function submitSearchForm(event) {
    event.preventDefault();

    const searchInput = document.getElementById("search");
    // Delete trailing whitespace
    // Prevent search if query is empty
    const query = searchInput.value.trim();
    if (!query) { return; }

    // Swap window to result.html with URL param
    // encodeURIComponent necessary in case query has spaces
    window.location.href = `results.html?query=${encodeURIComponent(query)}`;
}

// MusicBrainz API fetch
export async function fetchSongs(query) {
    // URL PARAMs: JSON format, limit to 20 results, and include both songs/artists
    const url = `${BRAINZ_URL}?query=${encodeURIComponent(query)}&fmt=json&limit=20&inc=artists+releases`;

    return await fetchDataFromAPI(url, {
        headers: {
            // MusicBrainz requires a custom "user token" in case of contact purposes
            "User-Agent": "SoundCove/1.0 nate.e.shelley@gmail.com"
        }
    });
}

export async function formatSongs(songs) {
    // change results object into a more easily usable object
    // use ?. to avoid TypeError from empty entries
    const formattedSongs = songs
        .map(song => {
            const release = song?.releases?.[0];
            const artist = song["artist-credit"]?.[0]?.artist;
            return {
                mbid: song.id,
                title: song.title || "Title N/A",
                artist: artist?.name || "Artist N/A",
                release: release?.title || "Release N/A",
                releaseMBID: release?.id || null,
                // cover art populated by Cover Art Archive API
                coverArt: release?.id
                    ? `https://coverartarchive.org/release/${release.id}/front`
                    : null
            };
        })

    // reiterate over songs
    // if necessary, add image using wallhaven API
    const backupArtSongs = await Promise.all(
        formattedSongs.map(async song => {
            if (!song.coverArt || !(await hasImage(song.coverArt))) {
                // Always provide a safe query
                const query = `${song.artist || "music"}`;
                song.coverArt = await getPixabayImage(query);
            }
            return song;
        })
    );

    return backupArtSongs;
}

// Fetch image from Pixabay
export async function getPixabayImage(query) {
    //per_page param must be within 3-200
    const pixabayUrl = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query).replace(/%20/g, "+")}&image_type=photo&per_page=3&safesearch=true`;

    try {
        const res = await fetch(pixabayUrl);
        if (!res.ok) throw new Error(`Pixabay API error: ${res.status}`);
        const data = await res.json();

        if (data.hits && data.hits.length > 0) {
            // medium sized image
            return data.hits[0].webformatURL;
        }
    } catch (err) {
        console.error("Pixabay fetch error:", err);
    }

    // if fetch fails, use logo
    return "./images/headphone-svgrepo-com.svg";
}


export async function hasImage(url) {
    try {
        const response = await fetch(url, { method: "HEAD" });
        return response.ok;
    } catch (err) {
        return false;
    }
}

// HELPER FUNCTIONS //

async function loadHeader() {
    const headerEl = document.querySelector("header");

    try {
        const response = await fetch(HEADERPATH);
        const html = await response.text();
        headerEl.innerHTML = html;
    } catch (error) {
        console.error("Header error:", error);
    }
}

async function loadFooter() {
    const footerEl = document.querySelector("footer");

    try {
        const response = await fetch(FOOTERPATH);
        const html = await response.text();
        footerEl.innerHTML = html;
    } catch (error) {
        console.error("Footer error:", error);
    }
}

// Reusable API fetch
async function fetchDataFromAPI(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`URL error: ${response.status}`);
        return await response.json();
    }
    catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}