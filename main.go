package main

import (
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
        "net/url"
        "os"
)

const (
	TMDB_API_KEY = "d56e51fb77b081a9cb5192eaaa7823ad"
)

var (
        PORT = getPort()
)

func main() {
	fmt.Println(fmt.Sprintf("Listening on port %s", PORT))
	http.ListenAndServe(":"+PORT, nil)
}

func init() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		index := template.Must(template.ParseFiles("index.html"))
		index.Execute(w, nil)
	})
	http.HandleFunc("/search", SearchTmdb)
}

func SearchTmdb(w http.ResponseWriter, r *http.Request) {
	_url := "https://api.themoviedb.org/3/search/multi"
	params := map[string]string{
		"api_key":       TMDB_API_KEY,
		"query":         url.QueryEscape(r.ParseForm("query")),
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
	fmt.Fprintf(w, string(data))
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
                return "80"
        }
        return port
}
