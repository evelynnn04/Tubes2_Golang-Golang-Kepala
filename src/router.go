package main

import (
	"fmt"
	"net/http"

	//"github.com/evelynnn04/Tubes2_Golang-Golang-Kepala/src/functions"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type FromToData struct {
	From string `json:"from"`
	To   string `json:"to"`
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
		var data FromToData

		if err := c.ShouldBindJSON(&data); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		fmt.Printf("Received data: from=%s, to=%s\n", data.From, data.To)

		c.JSON(http.StatusOK, gin.H{"message": "Data saved successfully!"})
	})

	router.Run()

	// startURL := "https://en.wikipedia.org/wiki/Russia"
	// goalURL := "https://id.wikipedia.org/wiki/Joko_Widodo"
	// start := time.Now()
	// if path, found := functions.Ids(startURL, goalURL, 6); found {
	// 	fmt.Println("Solusi:", path)
	// } else {
	// 	fmt.Println("Ga ada solusi :(.")
	// }
	// end := time.Now()
	// fmt.Println(end.Sub(start))
	// links := functions.Scrape("https://en.wikipedia.org/wiki/Philosophy")
	// fmt.Println(links)
}
