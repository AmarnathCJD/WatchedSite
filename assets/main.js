const show = window.location.href.split("/").pop();
const id = show.split("-")[0];
const type = show.split("-")[1];
var seasons_ = null;
const genres = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Science Fiction", "TV Movie", "Thriller", "War", "Western"];
const genresButton = document.getElementById("genres-button");
const menu = document.getElementById("mobile-menu");
const menuButton = document.getElementById("mobile-menu-toggle");
menuButton.addEventListener("click", () => {
  menu.classList.toggle("hidden");
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
  if (type === "movie") {
    var url = "/search/movie?id=" + id;
    $("#player").attr("src", "https://www.2embed.ru/embed/tmdb/movie?id=" + id);
  } else {
    var url = "/search/tv?id=" + id;
    $("#player").attr("src", "https://www.2embed.ru/embed/tmdb/tv?id=" + id + "&s=1&e=1");
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
      $("#site-title").html("Watch TV - " + trimTitle(data));
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
      if (data.credits != undefined) {
        if (data.credits.cast.length !== 0) {
          $("#casts").html(getCasts(data.credits.cast));
        }
      }
      getRecommendations(data.similar);
      if (type !== "movie") {
        seasons_ = data.seasons;
        writeSeason(data);
        setupEpisodeTable(data.seasons);
      }
    },
  });
}

function getCasts(casts) {
  var q = 0;
  var cast = "";
  for (var i = 0; i < casts.length; i++) {
    if (q > 5) {
      break;
    }
    q++;
    cast += `${casts[i].name}` + `, `;
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
      var release_date =
        item.release_date && item.release_date.length > 0
          ? item.release_date
          : item.first_air_date;
      q += 1;
      html += `<div class="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-3">`;
      html += `<a href="${url}" class="c-card block shadow-md hover:shadow-xl hover:bg-gray-300 rounded-lg overflow-hidden">`;
      html += `<div class="relative overflow-hidden">`;
      html += `<img class="h-auto w-auto object-cover"src="https://image.tmdb.org/t/p/w500/${item.poster_path}"alt=""></div>`;
      html += `<div class="p-4 h-20" id="rec">`;
      html += `<span class="inline-block leading-none rounded-full font-semibold uppercase tracking-wide text-xs">(${release_date})</span><h2 class="mt-2 mb-2 font-bold text-sm">${trimTitle(
        item
      )}</h2>`;
      html += `</div></a></div>`;
    }
  });
  $("#suggest").html(`<div class="flex flex-wrap">` + html + "</div>");
}

function writeSeason(data) {
  $("#main-selector").html(
    `<div class="container bg-gray-100 rounded-lg p-3 w-full lg:max-w-full lg:flex py-3"><div class="p-1 bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center"
    title="poster"><label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Select Season</label>
       <div id="season-table" class="flex flex-col items-center p-1"></div>
   </div><div class="rounded-b lg:rounded-b-none lg:rounded-r p-6 flex flex-col justify-between leading-normal"><div id="episode-table"></div></div></div>`
  );
  var seasons = data.seasons;
  var html = ``;
  var i = 0;
  var q = 0;
  seasons.forEach((season) => {
    i += 1;
    if (season.name != "Specials") {
      q += 1;
      html += `<div class="w-24 p-1">`;
      html += `<button href="#" class="round-lg c-card block shadow-md hover:shadow-xl rounded-sm ${"bg-red-600 text-white" && q == 1
        ? "bg-blue-600 text-white"
        : "bg-gray-100"
        } px-2 sm:px-2 hover:bg-blue-300 hover:shadow-xl" id="season-${i}">`;
      html += `<h2 class="w-full mt-2 mb-2"><div class="flex items-center">${season.name}</div></h2>`;
      html += `</button></div>`;
    }
  });
  $("#season-table").html(html);
  for (var i = 1; i <= seasons.length; i++) {
    $("#season-" + i).on("click", function () {
      const ss = $(this).text();
      $("#season-table .bg-blue-600").removeClass("bg-blue-600 text-white");
      $(this).addClass("bg-blue-600 text-white");
      setupEpisodeTable(seasons_, ss);
      changeStream(1);
    });
  }
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
    html += `<div class="w-full sm:w-1/4 w-1/2 px-3 py-1">`;
    html += `<button href="#" class="c-card block shadow-md hover:shadow-xl rounded-lg ${"bg-red-600 text-white" && i == 1
      ? "bg-red-600 text-white"
      : "bg-gray-100"
      } px-3 lg:px-3 sm:px-3 sm:w-full w-auto hover:bg-red-300 " id="episode-${i}">`;
    html += `<h2 class="w-full mt-2 mb-2"><div class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 28 28" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg> Episode ${i}</div></h2>`;
    html += `</button></div>`;
  }
  html += `</div>`;
  $("#episode-table").html(html);
  current_episode = 1;
  for (let i = 1; i <= season.episode_count; i++) {
    $("#episode-" + i).on("click", () => {
      changeStream(i);
      $("#episode-table .bg-red-600").removeClass("bg-red-600 text-white");
      $("#episode-" + i).addClass("bg-red-600 text-white");
    });
  }
}

getShow();

function updateEpsidoes() {
  var season = document.getElementById("season-select").value;
  setupEpisodeTable(seasons_, season);
  changeStream(1);
}

function changeStream(stream) {
  var season = $("#season-table .bg-blue-600").text();
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

function typeAhead() {
  query = $("#search-dropdown").val();
  console.log(query);
  if (query.length > 0 && query.length % 2 === 0) {
    $.ajax({
      url: `/autocomplete?query=${query}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        var html = "";
        data.forEach((item) => {
          html += `<li>
                  <button type="button"
                      class="inline-flex py-2 px-4 w-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      id="search-all">${item.label}</button>
              </li>`;
        });
        $("#type-ahead-list").html(html);
        if (
          document
            .getElementById("type-ahead-list")
            .classList.contains("hidden")
        ) {
          $("#type-ahead-list").toggleClass("hidden");
        }
        for (var i = 0; i < data.length; i++) {
          $("#type-ahead-list")
            .children()
            .eq(i)
            .click(function () {
              $("#search-dropdown").val($(this).text().trim());
              $("#type-ahead-list").addClass("hidden");
              $("#search-dropdown").focus();
              searchTitle();
            });
        }
      },
    });
  }
}

function searchTitle() {
  query = $("#search-dropdown").val();
  var html = `<div class="flex flex-wrap">`;
  $.ajax({
    url: `/search?query=${query}`,
    type: "GET",
    dataType: "json",
    success: function (data) {
      data.results.forEach((item) => {
        if (item.poster_path != null) {
          const url = `/title/${item.id}-${item.media_type}`;
          html += `<div class="sm:w-24 w-1/3 p-3">`;
          html += `<a href="${url}" class="c-card block shadow-md hover:shadow-xl rounded-lg overflow-hidden">`;
          html += `<div class="relative overflow-hidden">`;
          html += `<img class="h-auto w-auto object-cover"src="https://image.tmdb.org/t/p/w400/${item.poster_path}"alt=""></div>`;
          html += `</a></div>`;
        }
      });
      $("#suggest-dropdown").html(html + `</div>`);
      $("#suggest-dropdown").toggleClass("hidden");
    },
  });
}

genresView = () => {
  if ($("#genres-dropdown").hasClass("hidden") == false) {
      $("#genres-dropdown").addClass("hidden");
      return;
  }
  var html = `<div class="flex flex-wrap bg-indigo-500 rounded-lg" id="genres-drop">`;
  q = 0;
  genres.forEach((item) => {
      q += 1;
      html += `<div class="border-current sm:w-1/6 w-1/5 py-1"><button type="button"
                class="border-current inline-block px-4 py-2.5 bg-indigo-500 opacity-75 text-white font-medium text-xs leading-tight uppercase hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none focus:ring-0 active:bg-indigo-800 transition duration-150 ease-in-out"
                id="search-all">${item}</button></div>`;
  });
  html += "</div>";
  $("#genres-dropdown").html(html);
  $("#genres-dropdown").toggleClass("hidden");
  for (var i = 0; i < genres.length; i++) {
      $("#genres-drop")
          .children()
          .eq(i)
          .click(function () {
              window.location.href = `/?genre=${$(this).text().trim()}`;
          });
  }
}

genresButton.onclick = genresView;
genresButton.onmouseover = genresView;

document.addEventListener("DOMContentLoaded", function () {
  $("#search-dropdown").on("keyup", typeAhead);
  $("#search-submit").on("click", searchTitle);
});

$("body").click(function (e) {
  if (!$(e.target).closest("#type-ahead-list").length) {
    $("#type-ahead-list").addClass("hidden");
  }
  if (!$(e.target).closest("#suggest-dropdown").length) {
    $("#suggest-dropdown").addClass("hidden");
  }
});

