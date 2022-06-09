package main

import (
	"fmt"
	"html/template"
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
}
