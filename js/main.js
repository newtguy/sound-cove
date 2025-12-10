import { loadHeaderFooter, loadBarsAnimation, submitSearchForm } from "./index.js";

await loadHeaderFooter();
await loadBarsAnimation();

const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', submitSearchForm);
