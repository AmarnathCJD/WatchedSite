const dropdownButton = document.getElementById("dropdown-button");
const dropdownMenu = document.getElementById("dropdown");
const searchMovie = document.getElementById("search-movie");
const searchTv = document.getElementById("search-tv");
const searchAll = document.getElementById("search-all");
const downArrowSvg = `<svg class="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd"d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"clip-rule="evenodd"></path></svg>`
const searchSubmit = document.getElementById("search-submit");


var searchType = "all";

dropdownButton.addEventListener('click', () => {
    dropdownMenu.classList.toggle('hidden');
});

searchMovie.addEventListener('click', () => {
    dropdownMenu.classList.add('hidden');
    dropdownButton.innerHTML = 'Movie' + downArrowSvg
    searchType = "movie";
})

searchTv.addEventListener('click', () => {
    dropdownMenu.classList.add('hidden');
    dropdownButton.innerHTML = 'TV' + downArrowSvg
    searchType = "tv";
})

searchAll.addEventListener('click', () => {
    dropdownMenu.classList.add('hidden');
    dropdownButton.innerHTML = 'All categories' + downArrowSvg
    searchType = "all";
})

searchSubmit.addEventListener('click', searchTitle)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchTitle();
    }
})

function searchTitle() {
    var title = $('#search-dropdown').val() && $('#search-dropdown').val().length > 0 ? $('#search-dropdown').val() : "trending";
    var url = "/search?query=" + title + "&type=" + searchType;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function (data) {
            updateResultTable(data);
            setupPagination(data);
        }
    });
}

function updateResultTable(data) {
    var table = '';
    data.results.forEach(item => {
        var html = `<div class="w-1/2 sm:w-1/2 md:w-1/3 xl:w-1/5 p-4" id="${item.id}">
        <a href="/title/${item.id}-${item.media_type}" class="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden">
            <div class="relative pb-64 sm:pb-64 xl:pb-64 md:pb-60 overflow-hidden">
            <img class="absolute inset-0 h-full w-full object-cover"
                src="https://image.tmdb.org/t/p/w500/${item.poster_path}"
                alt="">
            </div>
            <div class="p-4 flex items-center text-sm text-gray-600">
            <span class="ml-2">${trimText(item.name || item.title, 20)}</span>
            </div>
        </a>
    </div>`
        if (item.media_type !== "person" && item.poster_path !== null) {
            table += html;
        }
    })
    $('#result-table').html(table);
}

function trimText(text, length) {
    if (text.length > length) {
        return text.substring(0, length) + "...";
    } else {
        return text;
    }
}

function setupPagination(data) {
    var page = data.page;
    var totalPages = data.total_pages;
    var firstPages = [1, 2, 3];
    var lastPages = [totalPages - 2, totalPages - 1, totalPages];
    pagination = `<nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
    <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
      <span class="sr-only">Previous</span>
      <!-- Heroicon name: solid/chevron-left -->
      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </a>
    <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
    ${page_list(firstPages, page, lastPages, totalPages)}
    <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
      <span class="sr-only">Next</span>
      <!-- Heroicon name: solid/chevron-right -->
      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </a>
  </nav>`
    $('#page').html(pagination);

}

function page_list(firstPages, page, lastPages, totalPages) {
    var page_list = '';
    firstPages.forEach(item => {
        if (item === page) {
            page_list += `<a href="#" aria-current="page" class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> ${page} </a>`
        } else {
            page_list += `<a href="#" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> ${item} </a>`
        }
    })
    if (page > 3) {
        page_list += `<a href="#" aria-current="page" class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> ... </a>`
        page_list += `<a href="#" aria-current="page" class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> ${page} </a>`
    }
    if (page < totalPages - 2) {
        page_list += `<a href="#" aria-current="page" class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> ... </a>`
    }
    lastPages.forEach(item => {
        page_list += `<a href="#" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> ${item} </a>`
    })
    return page_list;
}

function typeAhead() {
    query = $('#search-dropdown').val();
    console.log(query);
    if (query.length > 0 && query.length % 2 === 0) {
        $.ajax({
            url: `/autocomplete?query=${query}`,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                var html = '';
                data.forEach(item => {
                    html += `<li>
                    <button type="button"
                        class="inline-flex py-2 px-4 w-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        id="search-all">${item.label}</button>
                </li>`
                })
                $('#type-ahead-list').html(html);
                if (document.getElementById('type-ahead-list').classList.contains('hidden')) {
                    $('#type-ahead-list').toggleClass('hidden');
                }
                for (var i = 0; i < data.length; i++) {
                    $('#type-ahead-list').children().eq(i).click(function () {
                        $('#search-dropdown').val($(this).text().trim());
                        $('#type-ahead-list').addClass('hidden');
                        $('#search-dropdown').focus();
                        searchTitle();
                    })
                }
            }
        })
    }
}


document.addEventListener('DOMContentLoaded', function () {
    $('#search-dropdown').on('keyup', typeAhead);
})

$('body').click(function (e) {
    if (!$(e.target).closest('#type-ahead-list').length) {
        $("#type-ahead-list").addClass('hidden');
    }
});

$("#dark-mode-top").mouseover(function () {
    $("#dark-mode-top").text("Not Implemented");
})
$("#dark-mode-top").mouseout(function () {
    $("#dark-mode-top").html(`<svg
    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
    class="bi bi-moon-stars-fill" viewBox="0 0 16 16">
    <path
        d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
    <path
        d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
</svg>`)
})

$("#mobile-menu-toggle").click(function () {
    $("#mobile-menu").toggleClass("hidden");
})

searchTitle();


