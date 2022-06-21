package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strings"
)

const (
	TMDB_API_KEY = "d56e51fb77b081a9cb5192eaaa7823ad"
)

var (
	PORT   = getPort()
	GENRES []Genre
)

func main() {
	fmt.Println("Listening on port " + PORT)
	fmt.Println(http.ListenAndServe(":"+PORT, nil))
}

type Genre struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func init() {
	getGenre()
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		index := template.Must(template.ParseFiles("index.html"))
		index.Execute(w, nil)
	})
	http.HandleFunc("/mv", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "https://index.hitarashi.ml/0:/Napte%20Thunai%20%282019%29%20Tamil%20%5B1080p%20-%20HD%20AVC%20-%20x264%20-%20UNTOUCHED%20-%20DDP5.1%20-%208.3GB%20-%20Esub%5D.mkv", http.StatusSeeOther)
	}
	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("assets"))))
	http.HandleFunc("/search", SearchTmdb)
	http.HandleFunc("/search/movie", getMovie)
	http.HandleFunc("/search/tv", getTvShow)
	http.HandleFunc("/autocomplete", AutoComplete)
	http.HandleFunc("/genre", getByGenre)
	http.HandleFunc("/title/", func(w http.ResponseWriter, r *http.Request) {
		title := template.Must(template.ParseFiles("title.html"))
		title.Execute(w, nil)
	})
	http.HandleFunc("/home", func(w http.ResponseWriter, r *http.Request) {
		title := template.Must(template.ParseFiles("index.html"))
		title.Execute(w, nil)
	})
	http.HandleFunc("/signup", func(w http.ResponseWriter, r *http.Request) {
		s := template.Must(template.ParseFiles("signup.html"))
		s.Execute(w, nil)
	})
}

func SearchTmdb(w http.ResponseWriter, r *http.Request) {
	_type := r.FormValue("type")
	_url_suffix := "/multi"
	if _type == "movie" {
		_url_suffix = "/movie"
	} else if _type == "tv" {
		_url_suffix = "/tv"
	}
	_url := "https://api.themoviedb.org/3/search" + _url_suffix
	_query := r.FormValue("query")
	if _query == "trending" {
		parseTrending(w, _query)
		return
	}
	params := map[string]string{
		"api_key":       TMDB_API_KEY,
		"query":         url.QueryEscape(_query),
		"language":      "en-US",
		"page":          "1",
		"include_adult": "false",
	}
	resp, err := http.Get(_url + "?" + encodeParams(params))
	if err != nil {
		fmt.Fprintf(w, "Error: %s", err)
		return
	}
	defer resp.Body.Close()
	data, _ := ioutil.ReadAll(resp.Body)
	fmt.Fprint(w, string(data))
}

func parseTrending(w http.ResponseWriter, query string) {
	_url := "https://api.themoviedb.org/3/trending/all/day"
	resp, err := http.Get(_url + "?api_key=" + TMDB_API_KEY)
	if err != nil {
		fmt.Fprintf(w, "Error: %s", err)
		return
	}
	defer resp.Body.Close()
	data, _ := ioutil.ReadAll(resp.Body)
	fmt.Fprint(w, string(data))
}

func getGenre() {
	_url := "https://api.themoviedb.org/3/genre/movie/list"
	params := map[string]string{
		"api_key":  TMDB_API_KEY,
		"language": "en-US",
	}
	resp, err := http.Get(_url + "?" + encodeParams(params))
	if err != nil {
		fmt.Println(err)
		return
	}
	defer resp.Body.Close()
	data, _ := ioutil.ReadAll(resp.Body)
	var genres map[string][]Genre
	json.Unmarshal(data, &genres)
	GENRES = genres["genres"]
}

func getMovie(w http.ResponseWriter, r *http.Request) {
	_url := "https://api.themoviedb.org/3/movie/"
	_id := r.FormValue("id")
	params := map[string]string{
		"api_key":            TMDB_API_KEY,
		"language":           "en-US",
		"page":               "1",
		"include_adult":      "false",
		"append_to_response": "similar,credits",
	}
	resp, err := http.Get(_url + _id + "?" + encodeParams(params))
	if err != nil {
		fmt.Fprintf(w, "Error: %s", err)
		return
	}
	defer resp.Body.Close()
	data, _ := ioutil.ReadAll(resp.Body)
	fmt.Fprint(w, string(data))
}

func getTvShow(w http.ResponseWriter, r *http.Request) {
	_url := "https://api.themoviedb.org/3/tv/"
	_id := r.FormValue("id")
	params := map[string]string{
		"api_key":            TMDB_API_KEY,
		"language":           "en-US",
		"page":               "1",
		"include_adult":      "false",
		"append_to_response": "similar,credits,episode_groups",
	}
	resp, err := http.Get(_url + _id + "?" + encodeParams(params))
	if err != nil {
		fmt.Fprintf(w, "Error: %s", err)
		return
	}
	defer resp.Body.Close()
	data, _ := ioutil.ReadAll(resp.Body)
	fmt.Fprint(w, string(data))
}

func AutoComplete(w http.ResponseWriter, r *http.Request) {
	_query := r.FormValue("query")
	if _query == "" {
		fmt.Fprint(w, "")
		return
	}
	_firstLetter := strings.ToLower(_query[0:1])
	_url := "https://v2.sg.media-imdb.com/suggestion/titles/" + _firstLetter + "/" + url.QueryEscape(_query) + ".json"
	resp, err := http.Get(_url)
	if err != nil {
		fmt.Fprintf(w, "Error: %s", err)
		return
	}
	defer resp.Body.Close()
	var data struct {
		D []struct {
			I struct {
				ImageURL string
			}
			L string
		}
	}
	json.NewDecoder(resp.Body).Decode(&data)
	var result []map[string]string
	for _, v := range data.D {
		result = append(result, map[string]string{
			"image": v.I.ImageURL,
			"label": v.L,
		})
	}
	d, _ := json.Marshal(result)
	fmt.Fprint(w, string(d))
}

func getByGenre(w http.ResponseWriter, r *http.Request) {
	_url := "https://api.themoviedb.org/3/discover/movie"
	params := map[string]string{
		"api_key":       TMDB_API_KEY,
		"language":      "en-US",
		"page":          "1",
		"include_adult": "false",
		"with_genres":   getGenreID(r.FormValue("genre")),
	}
	resp, err := http.Get(_url + "?" + encodeParams(params))
	if err != nil {
		fmt.Fprintf(w, "Error: %s", err)
		return
	}
	defer resp.Body.Close()
	data, _ := ioutil.ReadAll(resp.Body)
	fmt.Fprint(w, string(data))
}

func encodeParams(params map[string]string) string {
	var query string
	for k, v := range params {
		query += k + "=" + v + "&"
	}
	return query[:len(query)-1]
}

func getPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		return "3000"
	}
	return port
}

func getGenreID(name string) string {
	for _, v := range GENRES {
		if strings.EqualFold(v.Name, name) {
			return fmt.Sprint(v.ID)
		}
	}
	return ""
}
