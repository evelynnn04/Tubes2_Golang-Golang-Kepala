package main

import (
	"fmt"
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
			paths, found := functions.IDSMultiplePaths(data.From, data.To, 6)
			end := time.Now()
			runtime := end.Sub(start)

			if found {
				err := functions.DataIntoJson(paths, "../frontend/client/src/Graph.json", runtime, fmt.Sprint(len(paths)))
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"message": "Error saving data", "error": err.Error()})
					return
				}

				//Kalo sukses kirim ini
				c.JSON(http.StatusOK, gin.H{
					"message":    "Data processed successfully!",
					"runtime":    runtime.String(),
					"pathsFound": len(paths),
				})
			} else {
				// Kalo gagal
				c.JSON(http.StatusNotFound, gin.H{
					"message": "No paths found between the specified nodes",
					"runtime": runtime.String(),
				})
			}
		} else {
			start := time.Now()
			paths, found := functions.BFS(data.From, data.To)
			end := time.Now()
			runtime := end.Sub(start)

			if found {
				err := functions.DataIntoJson(paths, "../frontend/client/src/Graph.json", runtime, fmt.Sprint(len(paths)))
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"message": "Error saving data", "error": err.Error()})
					return
				}

				//Kalo sukses kirim ini
				c.JSON(http.StatusOK, gin.H{
					"message":    "Data processed successfully!",
					"runtime":    runtime.String(),
					"pathsFound": len(paths),
				})
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

	// startURL := "https://en.wikipedia.org/wiki/Fire"
	// goalURL := "https://en.wikipedia.org/wiki/Nanometre"
	// start := time.Now()
	// if path, found := functions.IDSMultiplePaths(startURL, goalURL, 10); found {
	// 	functions.DataIntoJson(path, "../frontend/client/src/Graph.json")
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
