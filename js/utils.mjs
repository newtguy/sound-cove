const HEADERPATH = "partials/header.html";
const FOOTERPATH = "partials/footer.html";

export async function loadHeaderFooter() {
    await loadHeader();
    await loadFooter();
}

async function loadHeader() {
    const headerEl = document.querySelector('header');

    try {
        const response = await fetch(HEADERPATH);
        const html = await response.text();
        headerEl.innerHTML = html;
    } catch (error) {
        console.error("Header error:", error);
    }
}

async function loadFooter() {
    const footerEl = document.querySelector('footer');

    try {
        const response = await fetch(FOOTERPATH);
        const html = await response.text();
        footerEl.innerHTML = html;
    } catch (error) {
        console.error("Footer error:", error);
    }
}

