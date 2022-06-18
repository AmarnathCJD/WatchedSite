const show = window.location.href.split("/").pop();
const id = show.split("-")[0];
const type = show.split("-")[1];
var seasons_ = null;
var current_episode = 1
var movieSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-film" viewBox="0 0 16 16">
<path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z"/>
</svg>`
const tvSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tv-fill" viewBox="0 0 16 16">
  <path d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zM2 2h12s2 0 2 2v6s0 2-2 2H2s-2 0-2-2V4s0-2 2-2z"/>
</svg>`

const menu = document.getElementById("mobile-menu");
const menuButton = document.getElementById("mobile-menu-toggle");
menuButton.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});
const userMenu = document.getElementById("user-menu");
const userMenuButton = document.getElementById("user-menu-toggle");
userMenuButton.addEventListener("click", () => {
  userMenu.classList.toggle("hidden");
});

function convertToCurrency(labelValue) {
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
    : Math.abs(Number(labelValue)) >= 1.0e6
      ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
      : Math.abs(Number(labelValue)) >= 1.0e3
        ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
        : Math.abs(Number(labelValue));
}

function trimTitle(data) {
  if (data.title !== undefined) {
    return data.title.length > 20
      ? data.title.substring(0, 20) + "..."
      : data.title;
  }
  return data.name.length > 20 ? data.name.substring(0, 20) + "..." : data.name;
}

function getYear(date) {
  var year = date.split("-")[0];
  return year;
}

function getShow() {
  if (type == "movie") {
    url = "/search/movie?id=" + id;
    $("#player").attr("src", "https://www.2embed.ru/embed/tmdb/movie?id=" + id);
  } else {
    url = "/search/tv?id=" + id;
    $("#player").attr(
      "src",
      "https://www.2embed.ru/embed/tmdb/tv?id=" + id + "&s=1&e=1"
    );
  }
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function (data) {
      const releaseDate =
        data.release_date && data.release_date.length > 0
          ? data.release_date
          : data.first_air_date;
      $("#description").html(data.overview);
      $("#genres").html(
        data.genres
          .map((genre) => {
            return `<span
                        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">${genre.name}</span>`;
          })
          .join("")
      );
      $("#main-title").html(
        data.title && data.title.length > 0
          ? data.title + " (" + getYear(releaseDate) + ")"
          : data.name + " (" + getYear(releaseDate) + ")"
      );
      $("#poster").attr(
        "src",
        "https://image.tmdb.org/t/p/w500/" + data.poster_path
      );
      $("#title").html(
        data.title && data.title.length > 0 ? data.title : data.name
      );
      $("#release-date").html(releaseDate);
      $("#rating").text(data.vote_average);
      $("#runtime").text(
        data.runtime && data.runtime > 0
          ? data.runtime + " min"
          : data.episode_run_time[0] + " min"
      );
      $("#language").text(String(data.original_language).toUpperCase());
      if (data.production_countries.length > 0) {
        $("#country").text(data.production_countries[0].name);
      }
      $("#production").html(
        data.production_companies
          .map((company) => {
            return company.name + " ";
          })
          .join("")
          .slice(0, -1)
      );
      $("#revenue").html(
        data.revenue && data.revenue > 0
          ? convertToCurrency(data.revenue) + " $"
          : "N/A"
      );
      if (data.networks > 0) {
        $("#networks").html(
          data.networks
            .map((network) => {
              return network.name + " ";
            })
            .join("")
            .slice(0, -1)
        );
      } else {
        $("#networks").html("N/A");
      }
      if (data.casts.cast.length !== 0) {
        $("#casts").html(getCasts(data.casts.cast));
      }
      getRecommendations(data.similar);
      if (type !== "movie") {
        seasons_ = data.seasons;
        setupSeason(data);
        setupEpisodeTable(data.seasons);
      }
    },
  });
}

function getCasts(casts) {
  var q = 0
  var cast = ''
  for (var i = 0; i < casts.length; i++) {
    if (q > 5) {
      break;
    }
    q++;
    cast += `${casts[i].name}` + `, `
  }
  cast = cast.replace(/,\s*$/, "");
  return cast;
}

function getRecommendations(data) {
  var q = 0;
  var html = "";
  data.results.forEach((item) => {
    if (q < 10) {
      const url = "/title/" + item.id + "-" + type;
      var icon = movieSVG
      if (type == "tv") {
        icon = tvSVG
      }
      var release_date = item.release_date && item.release_date.length > 0
        ? item.release_date
        : item.first_air_date;
      q += 1;
      html += `<div class="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-3">`;
      html += `<a href="${url}" class="c-card block shadow-md hover:shadow-xl rounded-lg overflow-hidden">`;
      html += `<div class="relative overflow-hidden">`;
      html += `<img class="h-auto w-auto object-cover"src="https://image.tmdb.org/t/p/w500/${item.poster_path}"alt=""></div>`;
      html += `<div class="p-4" id="rec">`;
      html += `<span class="inline-block leading-none rounded-full font-semibold uppercase tracking-wide text-xs">(${release_date})</span><h2 class="mt-2 mb-2 font-bold text-sm">${trimTitle(
        item
      )}</h2>`;
      html += `</div></a></div>`;
    }
  });
  $("#suggest").html(`<div class="flex flex-wrap">` + html + "</div>");
}

function setupSeason(data) {
  $("#main-selector").html(
    `<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Select Season</label>

        <select
            class="select relative bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            id="season-select">

        </select>
        <div id="episode-table"></div>`
  );
  var seasons = data.seasons;
  var html = ``;
  seasons.forEach((season) => {
    if (season.name != "Specials") {
      html += `<option class="option ${season.name == "Season 1" ? "active" : ""
        } text-grey-900" value="${season.name}">${season.name}</option>`;
    }
  });
  $("#season-select").html(html);
  $("#season-select").on("change", updateEpsidoes);
}

function setupEpisodeTable(data, season) {
  var html = ``;
  html += `<div class="flex flex-wrap">`;
  if (season == undefined) {
    season = data[0];
    if (season.name == "Specials") {
      season = data[1];
    }
  } else {
    season = data.find((item) => {
      return item.name == season;
    });
  }
  for (let i = 1; i <= season.episode_count; i++) {
    html += `<div class="w-1/3 md:w-1/3 xl:w-1/6 p-3">`;
    html += `<button href="#" class="c-card block shadow-md hover:shadow-xl rounded-lg overflow-hidden ${"bg-red-600 text-white" && i == 1 ? "bg-red-600 text-white" : "bg-gray-100"} py-1 sm:px-10 px-3" id="episode-${i}">`;
    html += `<h2 class="mt-2 mb-2 font-bold">Episode ${i}</h2>`;
    html += `</button></div>`;
  }
  html += `</div>`;
  $("#episode-table").html(html);
  current_episode = 1;
  for (let i = 1; i <= season.episode_count; i++) {
    $("#episode-" + i).on("click", () => {
      $("#episode-select").val(i);
      changeStream(i);
      var activeButton = document.getElementById("episode-" + current_episode);
      activeButton.classList.remove("bg-red-600");
      activeButton.classList.remove("bg-red-600");
      activeButton.classList.toggle("text-white");
      var thisButton = document.getElementById("episode-" + i);
      thisButton.classList.remove("bg-gray-100");
      thisButton.classList.add("bg-red-600");
      thisButton.classList.toggle("text-white");
      current_episode = i;
    }
    );
  }
}


getShow();

function updateEpsidoes() {
  var season = document.getElementById("season-select").value;
  setupEpisodeTable(seasons_, season);
  changeStream(1);
}

function changeStream(stream) {
  var season = document.getElementById("season-select").value;
  season_id = seasons_.find((item) => {
    return item.name == season;
  }).season_number;
  $("#player").attr(
    "src",
    "https://www.2embed.ru/embed/tmdb/tv?id=" +
    id +
    "&s=" +
    season_id +
    "&e=" +
    stream
  );
}
