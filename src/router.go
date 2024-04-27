package main

import (
	"fmt"
	// "go/printer"
	"net/http"
	"time"

	"github.com/evelynnn04/Tubes2_Golang-Golang-Kepala/src/functions"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type FrontendFormData struct {
	Method string `json:"method"`
	From   string `json:"from"`
	To     string `json:"to"`
}

func main() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
	router.POST("/save-data", func(c *gin.Context) {
		var data FrontendFormData

		if err := c.ShouldBindJSON(&data); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if data.Method == "ids" {
			start := time.Now()
			paths, found, totalArticle := functions.IDSMultiplePaths(data.From, data.To, 6)
			end := time.Now()
			runtime := end.Sub(start)

			if found {
				graphJSON, err := functions.DataIntoJson(paths, runtime, fmt.Sprint(len(paths)), fmt.Sprint(len(paths[0])), totalArticle)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"message": "Error generating data", "error": err.Error()})
					return
				}

				c.Header("Content-Type", "application/json")
				c.String(http.StatusOK, graphJSON)
			} else {
				c.JSON(http.StatusNotFound, gin.H{
					"message": "No paths found between the specified nodes",
					"runtime": runtime.String(),
				})
			}
		} else if data.Method == "bfs" {
			start := time.Now()
			paths, found, totalArticle := functions.BFS(data.From, data.To)
			end := time.Now()
			runtime := end.Sub(start)

			if found {
				graphJSON, err := functions.DataIntoJson(paths, runtime, fmt.Sprint(len(paths)), fmt.Sprint(len(paths[0])), totalArticle)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"message": "Error saving data", "error": err.Error()})
					return
				}

				//Kalo sukses kirim ini
				c.Header("Content-Type", "application/json")
				c.String(http.StatusOK, graphJSON)
			} else {
				// Kalo gagal
				c.JSON(http.StatusNotFound, gin.H{
					"message": "No paths found between the specified nodes",
					"runtime": runtime.String(),
				})
			}
		}
	})

	router.Run()

	// startURL := "https://en.wikipedia.org/wiki/Chair"
	// goalURL := "https://en.wikipedia.org/wiki/Phoenicia"
	// start := time.Now()
	// path, found := functions.BFS(startURL, goalURL)
	// if found {
	// 	fmt.Print("Solusi: ", path)
	// 	fmt.Print("Runtime: ")
	// } else {
	// 	fmt.Println("Ga ada solusi :(.")
	// }
	// end := time.Now()
	// fmt.Println(end.Sub(start))

	// link, err := functions.Scrape("https://en.wikipedia.org/wiki/Philosophy")
	// if err != nil {

	// } else {
	// 	fmt.Println(link)
	// }

}
