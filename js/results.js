import { loadHeaderFooter, loadBarsAnimation, submitSearchForm, Results } from "./index.js";

await loadHeaderFooter();
await loadBarsAnimation();

const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", submitSearchForm);

// Grab song/artist query from URL
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("query");

// create instance of Results class
const resultsPage = new Results(query, "results-grid");
resultsPage.init();
