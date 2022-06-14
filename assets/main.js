const show = window.location.href.split("/").pop();
const id = show.split("-")[0];
const type = show.split("-")[1];
var seasons_ = null;

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
      $("#country").text(data.production_countries[0].name);
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
      getRecommendations(data.similar);
      if (type !== "movie") {
        seasons_ = data.seasons;
        setupSeason(data);
      }
    },
  });
}

function getRecommendations(data) {
  var q = 0;
  var html = "";
  data.results.forEach((item) => {
    if (q < 10) {
      const url =
        item.id && item.id > 0
          ? "/title/" + item.id + "-" + type
          : "/title/" + item.name + "-" + type;
      q += 1;
      html += `<div class="w-1/2 md:w-1/2 xl:w-1/5 p-3">`;
      html += `<a href="${url}" class="c-card block shadow-md hover:shadow-xl rounded-lg overflow-hidden">`;
      html += `<div class="relative pb-48 overflow-hidden">`;
      html += `<img class="absolute inset-0 h-full w-full object-cover"src="https://image.tmdb.org/t/p/w500/${item.poster_path}"alt=""></div>`;
      html += `<div class="p-4" id="rec">`;
      html += `<span class="inline-block px-2 py-1 leading-none bg-orange-200 text-orange-800 rounded-full font-semibold uppercase tracking-wide text-xs">Highlight 2022</span><h2 class="mt-2 mb-2 font-bold">${trimTitle(
        item
      )}</h2>`;
      html += `</div></a></div>`;
    }
  });
  $("#suggest").html(`<div class="flex flex-wrap">` + html + "</div>");
}

function setupSeason(data) {
  var seasons = data.seasons;
  var html = ``;
  seasons.forEach((season) => {
    if (season.name != "Specials") {
      html += `<option class="option ${season.name == "Season 1" ? "active" : ""
        } text-grey-900" value="${season.name}">${season.name}</option>`;
    }
  });
  $("#season-select").html(html);
  html = ``;
  season = seasons[0];
  if (season.name == "Specials") {
    season = seasons[1];
  }
  for (var i = 0; i < season.episode_count; i++) {
    html += `<option class="option ${i == 0 ? "active" : ""
      } text-grey-900" value="${i + 1}">${i + 1}</option>`;
  }
  $("#episode-select").html(html);
}
getShow();

function updateEpsidoes() {
  var season = document.getElementById("season-select").value;
  season = seasons_.find((item) => {
    return item.name == season;
  });
  console.log(season);
  var html = ``;
  for (var i = 0; i < season.episode_count; i++) {
    html += `<option class="option ${i == 0 ? "active" : ""
      } text-grey-900" value="${i + 1}">${i + 1}</option>`;
  }
  $("#episode-select").html(html);
  changeStream();
}

function changeStream() {
  var stream = document.getElementById("episode-select").value;
  var season = document.getElementById("season-select").value;
  season_id = seasons_.find((item) => {
    return item.name == season;
  }).id;
  $("#player").attr(
    "src",
    "https://www.2embed.ru/embed/tmdb/tv?id=" +
    id +
    "&s=" +
    season +
    "&e=" +
    stream
  );
}

$("#season-select").on("change", updateEpsidoes);
$("#episode-select").on("change", changeStream);
