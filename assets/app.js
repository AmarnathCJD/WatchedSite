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
        var html = `<div class="w-full sm:w-1/2 md:w-1/2 xl:w-1/5 p-4">
        <a href="/title/${item.id}-${item.media_type}" class="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden">
            <div class="relative pb-48 overflow-hidden">
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




searchTitle();
