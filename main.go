package main

import (
	"fmt"
)


// BFS Tester
func main() {
	var g = NewDirectedGraph()
	g.AddVertex("1.com")
	g.AddVertex("2.com")
	g.AddVertex("3.com")
	g.AddVertex("4.com")
	g.AddVertex("5.com")
	g.AddVertex("6.com")
	g.AddVertex("7.com")
	g.AddVertex("8.com")
	g.AddVertex("9.com")
	g.AddVertex("10.com")
	g.AddEdge("1.com", "9.com")
	g.AddEdge("1.com", "5.com")
	g.AddEdge("1.com", "2.com")
	g.AddEdge("2.com", "2.com")
	g.AddEdge("3.com", "4.com")
	g.AddEdge("5.com", "6.com")
	g.AddEdge("5.com", "8.com")
	g.AddEdge("6.com", "7.com")
	g.AddEdge("9.com", "10.com")

	visitedOrder := []string{}
	var processFunc = func(s string) {
		visitedOrder = append(visitedOrder, s)
	}
	BFS(g.Vertices["1.com"], processFunc)

	fmt.Println(visitedOrder)
}
