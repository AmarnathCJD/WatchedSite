package main

import (
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
)

func main() {
	fmt.Println("Listening on port 80")
	http.ListenAndServe(":80", nil)
}

func init() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		index := template.Must(template.ParseFiles("index.html"))
		index.Execute(w, nil)
	})
	http.HandleFunc("/search", SearchTmdb)
}

const (
	TMDB_API_KEY = "d56e51fb77b081a9cb5192eaaa7823ad"
)

func SearchTmdb(w http.ResponseWriter, r *http.Request) {
	url := "https://api.themoviedb.org/3/search/multi"
	params := map[string]string{
		"api_key":       TMDB_API_KEY,
		"query":         r.FormValue("query"),
		"language":      "en-US",
		"page":          "1",
		"include_adult": "false",
	}
	resp, err := http.Get(url + "?" + encodeParams(params))
	if err != nil {
		fmt.Fprintf(w, "Error: %s", err)
		return
	}
	defer resp.Body.Close()
	data, _ := ioutil.ReadAll(resp.Body)
	fmt.Fprintf(w, string(data))
}

func encodeParams(params map[string]string) string {
	var query string
	for k, v := range params {
		query += k + "=" + v + "&"
	}
	return query[:len(query)-1]
}
