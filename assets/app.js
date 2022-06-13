var seasons = {};
function getType() {
    var _type = document.location.href.split("-").pop();
    if (_type == "movie") {
        getMovie();
    } else if (_type == "tv") {
        getTVShow();
    }
}

getType();

function getMovie() {
    id = document.location.href.split("/").pop();
    $.ajax({
        url: "/search/movie?id=" + id,
        type: "GET",
        dataType: "json",
        success: function (data) {
            $("#title").text(data.title + " (" + data.release_date + ")");
            $("#image").html(`<div class="container" style="margin-bottom: 10px;">
                 <iframe class="embed-responsive-item video-frame" src="https://www.2embed.ru/embed/tmdb/movie?id=${data.id}" allowfullscreen width="100%" height=580></iframe>
            </div>`);
            $("#description").html(
                `<div class=""><div>
        <small class="has-text-grey-light">${data.tagline}</small>
        <p>${data.overview}</p>
        <img src="https://image.tmdb.org/t/p/w500${data.poster_path
                }" class="is-pulled-right" alt="..."
            style="width: 180px;">
        <div style="margin-top: 20px; margin-left: 0px;" class="mx-auto d-block  row align-items-center">
            <b>Rating:</b> <span class="tag is-success">${data.vote_average
                }</span>
            <br>
            <b>Genres:</b> ${"<span class='tag is-light'>" +
                data.genres
                    .map((genre) => genre.name)
                    .join("</span><span class='tag is-light'>") +
                "</span>"
                }
            <br>
            <b>Production Companies:</b> ${data.production_companies
                    .map((company) => company.name)
                    .join(", ")}
            <br>
            <b>Production Countries:</b> ${data.production_countries
                    .map((country) => country.name)
                    .join(", ")}
            <br>
            <b>Languages:</b> ${data.spoken_languages
                    .map((language) => language.name)
                    .join(", ")}
            <br>
            <b>Budget:</b> ${NumberToReadableCurrency(data.budget)}
            <br>
            <b>Revenue:</b> ${NumberToReadableCurrency(data.revenue)}
            <br>
            <b>Runtime:</b> ${runtimeToString(data.runtime)}
            <br>
            <b>Status:</b> ${data.status}
            <br>
        </div></div>
        </div>`
            );
        },
    });
}

function getTVShow() {
    id = document.location.href.split("/").pop();
    $.ajax({
        url: "/search/tv?id=" + id,
        type: "GET",
        dataType: "json",
        success: function (data) {
            seasons = data.seasons;
            $("#title").text(data.name + " (" + data.first_air_date + ")");
            $("#image").html(`<div class="container" style="margin-bottom: 10px;">
                 <iframe class="embed-responsive-item video-frame" src="https://www.2embed.ru/embed/tmdb/tv?id=${data.id}&s=1&e=1" allowfullscreen width="100%"></iframe>
            </div>`);
            $("#description").html(
                `<div class="">
<div>
    <small class="has-text-grey-light">${data.tagline}</small>
    <p>${data.overview}</p>
    <img src="https://image.tmdb.org/t/p/original${data.poster_path
                }" class="is-pulled-right" alt="..."
        style="width: 150px;">
    <div style="margin-top: 20px; margin-left: 0px;" class="mx-auto d-block  row align-items-center">
        <b>Rating:</b> <span class="tag is-danger">${data.vote_average
                }/10</span>
        <br>
        <b>Genres:</b> ${"<span class='tag is-light'>" +
                data.genres
                    .map((genre) => genre.name)
                    .join("</span><span class='tag is-light'>") +
                "</span>"
                }
        <br>
        <b>Production Companies:</b> ${data.production_companies
                    .map((company) => company.name)
                    .join(", ")}
        <br>
        <b>Production Countries:</b> ${data.production_countries
                    .map((country) => country.name)
                    .join(", ")}
        <br>
        <b>Languages:</b> ${data.languages
                    .map((language) => language)
                    .join(", ")}
        <br>
        <b>Created By:</b> ${data.created_by
                    .map((creator) => creator.name)
                    .join(", ")}
        <br>
        <b>Runtime:</b> ${runtimeToString(data.episode_run_time[0])}
        <br>
        <b>Status:</b> ${data.status}
        <br>
    </div></div>
    </div>`
            );
            genEpisodeSelector(data);
        },
    });
}

function NumberToReadableCurrency(number) {
    var currency = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(number);
    return currency;
}

function runtimeToString(runtime) {
    if (runtime == null) {
        return "";
    }
    if (runtime < 60) {
        return runtime + " minutes";
    } else {
        return Math.floor(runtime / 60) + " hours " + (runtime % 60) + " minutes";
    }
}

function genEpisodeSelector(data) {
    $("#main-selector").html(
        `<div id="season-selector" class="select"></div>
    <div id="episode-selector" class="select"></div>
    <button class="button is-danger" id="play-button">
        Add to Watchlist
    </button>
    <a class="button is-link" id="more-button" href="/">
        Home
    </a>`
    );
    var seasons = data.seasons;
    $("#season-selector").html(
        `<select>${seasons
            .map(
                (season) =>
                    `<option value="${season.season_number}">${season.name}</option>`
            )
            .join("")}</select>`
    );
    $("#episode-selector").html(
        `<select>${Array.from(Array(seasons[0].episode_count).keys())
            .map(
                (episode) =>
                    `<option value="${episode + 1}">Episode${episode + 1}</option>`
            )
            .join("")}</select>`
    );
}

function regCallbacks() {
    if (_type == "tv") {
        $("#season-selector").on("change", function () {
            var season_number = $("#season-selector").find("select").val();
            var season = seasons.find(
                (season) => season.season_number == season_number
            );
            console.log(seasons, season_number);
            var episode_selector = $("#episode-selector");
            episode_selector.html(
                `<select>${Array.from(Array(season.episode_count).keys())
                    .map(
                        (episode) =>
                            `<option value="${episode + 1}">Episode${episode + 1}</option>`
                    )
                    .join("")}</select>`
            );
            changeStream(season_number, 1);
        });
        $("#episode-selector").on("change", function () {
            console.log("changed");
            var episode_number = $("#episode-selector").find("select").val();
            var season_number = $("#season-selector").find("select").val();
            changeStream(season_number, episode_number);
        });
    }
}

function changeStream(season_number, episode_number) {
    var movie_id = document.location.href.split("/").pop();
    console.log(movie_id, season_number, episode_number);
    $("#image").html(
        `<div class="container" style="margin-bottom: "30px;">"<iframe class="embed-responsive-item" src="https://www.2embed.ru/embed/tmdb/tv?id=${movie_id}&s=${season_number}&e=${episode_number}" allowfullscreen width="100%" height=580></iframe></div>`
    );
}
