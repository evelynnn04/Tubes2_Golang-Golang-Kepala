package main

import (
	"fmt"
	"time"

	"github.com/evelynnn04/Tubes2_Golang-Golang-Kepala/src/functions"
)

func main() {
	startURL := "https://en.wikipedia.org/wiki/Russia"
	goalURL := "https://id.wikipedia.org/wiki/Joko_Widodo"
	start := time.Now()
	if path, found := functions.Ids(startURL, goalURL, 6); found {
		fmt.Println("Solusi:", path)
	} else {
		fmt.Println("Ga ada solusi :(.")
	}
	end := time.Now()
	fmt.Println(end.Sub(start))
	// links := functions.Scrape("https://en.wikipedia.org/wiki/Philosophy")
	// fmt.Println(links)
}
