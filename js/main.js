// Elements
const btnNavSearch = document.querySelector(".btn-nav-search");
const mainSearch = document.querySelector(".form-wrapper");
const form = document.querySelector(".input-form");
const selectCountry = document.querySelector(".select-country");
const selectCategory = document.querySelector(".select-category");
const inputTextarea = document.querySelector(".form-control");
const content = document.querySelector(".content-wrapper");
const wrapper = document.querySelector(".wrapper");

btnNavSearch.addEventListener("click", () => {
  if (mainSearch.classList.contains("nonvisible")) {
    btnNavSearch.textContent = "Закрыть";
    mainSearch.classList.toggle("nonvisible");
  } else {
    btnNavSearch.textContent = "Найти новости";
    mainSearch.classList.toggle("nonvisible");
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  loadNews();
});

function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.addEventListener("load", () => {
          // if (xhr.status < 200 || xhr.status > 299) {
          //   cb(`Error. Status code: ${xhr.status}`, xhr);
          //   return;
          // }
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          } else {
            const response = JSON.parse(xhr.responseText);
            cb(null, response);
          }
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.addEventListener("load", () => {
          // if (xhr.status < 200 || xhr.status > 299) {
          //   cb(`Error. Status code: ${xhr.status}`, xhr);
          //   return;
          // }
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          } else {
            const response = JSON.parse(xhr.responseText);
            cb(null, response);
          }
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) =>
            xhr.setRequestHeader(key, value)
          );
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}

// Init http module
const http = customHttp();

const newsService = (function () {
  const apiKey = "afcf9bb90959411991b638d71d2bbf5a";
  const apiUrl = "https://newsapi.org/v2";

  return {
    topHeadlines(country = "ru", category = "sport", cb) {
      http.get(
        `${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`,
        cb
      );
    },

    everything(query, cb) {
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    },
  };
})();

// Init selects
document.addEventListener("DOMContentLoaded", function () {
  loadNews();
});

// Load news function
function loadNews() {
  addSpinner();
  const chooseCountry = selectCountry.value;
  const chooseCategory = selectCategory.value;
  const textValue = inputTextarea.value;

  clearContent();

  if (!textValue) {
    newsService.topHeadlines(chooseCountry, chooseCategory, onGetResponse);
  } else {
    newsService.everything(textValue, onGetResponse);
  }
}

// Function on get response from server

function onGetResponse(error, response) {
  removeSpinner();
  renderNews(response.articles);
}

// Function render news
function renderNews(news) {
  const newsContainer = document.querySelector(".content-wrapper");
  let fragment = "";
  news.forEach((newsItem) => {
    if (!newsItem.urlToImage && !newsItem.title) {
      return;
    }
    const el = newsItemTemplate(newsItem);
    fragment += el;
  });
  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

// News item template function
function newsItemTemplate(newsItem) {
  return `
    <div class="card card-news">
        <img src="${
          newsItem.urlToImage || "img/wait.jpg"
        }" class="card-img-top" alt="Тут должна быть картинка, но она не прогрузилась">
        <div class="card-body">
          <h5 class="card-title">${newsItem.title || ""}</h5>
          <p class="card-text">${newsItem.description || ""}</p>
          <a href="${newsItem.url}" class="btn btn-primary">Read more</a>
        </div>
    </div>
  `;
}

// Clear content
function clearContent() {
  content.innerHTML = "";
}

// Add spinner
function addSpinner() {
  wrapper.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="d-flex justify-content-center spinner">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
    `
  );
}
function removeSpinner() {
  const spinner = document.querySelector(".spinner");
  spinner.innerHTML = "";
}
