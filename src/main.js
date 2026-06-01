import "./style.css";
import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

const supabaseUrl = "https://oqmlcdeeihebptalvtwv.supabase.co";;
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xbWxjZGVlaWhlYnB0YWx2dHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MDc5MjksImV4cCI6MjA5NTI4MzkyOX0.2z9Q5HeLtmgGFubrM9MLmGWrL-ALrZ1jgjO-EWI1aLs";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const articlesContainer = document.getElementById("articles");
const articleForm = document.getElementById("article-form");
const sortSelect = document.getElementById("sort");

function getSortOptions() {
  const value = sortSelect.value;
  if (value === "created_at.asc") {
    return { column: "created_at", ascending: true };
  }
  if (value === "created_at.desc") {
    return { column: "created_at", ascending: false };
  }
  return { column: "title", ascending: true };
}

function renderArticles(articles) {
  if (!articles || articles.length === 0) {
    articlesContainer.innerHTML =
      '<p class="text-gray-500">Brak artykułów do wyświetlenia.</p>';
    return;
  }

  articlesContainer.innerHTML = articles
    .map((article) => {
      const formattedDate = dayjs(article.created_at).format("DD-MM-YYYY");
      return `
        <article class="rounded border border-gray-300 bg-white p-5 shadow-sm">
          <h2 class="text-xl font-bold text-primary">${article.title}</h2>
          <h3 class="mt-1 text-lg font-medium text-gray-700">${article.subtitle}</h3>
          <div class="mt-3 text-sm text-gray-500">
            <span>Autor: ${article.author}</span>
            <span class="mx-2">|</span>
            <span>Data utworzenia: ${formattedDate}</span>
          </div>
          <p class="mt-4 text-gray-800">${article.content}</p>
        </article>
      `;
    })
    .join("");
}

async function loadArticles() {
  articlesContainer.innerHTML =
    '<p class="text-gray-500">...</p>';
  const { column, ascending } = getSortOptions();
  const { data, error } = await supabase
    .from("article")
    .select("*")
    .order(column, { ascending });
  if (error) {
    articlesContainer.innerHTML = `
      <p class="rounded bg-red-100 p-4 text-red-700">
        Wystąpił błąd podczas pobierania artykułów: ${error.message}
      </p>
    `;
    return;
  }
  renderArticles(data);
}

articleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const subtitle = document.getElementById("subtitle").value;
  const author = document.getElementById("author").value;
  const content = document.getElementById("content").value;
  const createdAt = document.getElementById("created_at").value;
  const newArticle = {
    title,
    subtitle,
    author,
    content,
  };
  if (createdAt) {
    newArticle.created_at = createdAt;
  }
  const { error } = await supabase.from("article").insert([newArticle]);
  if (error) {
    alert(`Nie udało się dodać artykułu: ${error.message}`);
    return;
  }
  articleForm.reset();
  await loadArticles();
});
sortSelect.addEventListener("change", loadArticles);
loadArticles();