# Cross-Intermine Search Tool

A client-driven cross-InterMine search page to search term once, and search many (or all) InterMines at the same time.

## About InterMine

A powerful open source data warehouse system. InterMine allows users
to integrate diverse data sources with a minimum of effort, providing
powerful web-services and an elegant web-application with minimal
configuration. InterMine powers some of the largest data-warehouses in
the life sciences.

For details, please visit: [InterMine Documentation](http://intermine.readthedocs.io/en/latest/)

## Introduction

There are lots of InterMines to explore organism and other research data provided by many different organizations. But, there is no centralized search tool from where quick search information like name, class, description, versions, organism, colors, logo from multiple mines could be retrieved at once. This leads an inefficient process of visiting the official sites of each mine in order to get these data. Motivated by these problems, Cross Intermine search tool idea was conceived. The aim is to create a search tool that uses InterMine web services to type a search term once and search many (or all) InterMines at the same time.

## Features of the search tool

1. Implementing a feature that would enable the user to filter the search results according to an individual mine or multiple mines. By default, the user would be provided with a search bar that would search all mines.  
2. Another feature to filter out the results according to individual mines. To provide best UI/UX experience, the intermines, would be represented as buttons that would enable the user to filter out the results according to individual mine in the results page.
3. Feature to get ‘n’ number of results with most relevance scores. This n can be varied by the user. For example, the user could select to display, say, for example, 17 most relevant quick search results.
4. Feature to filter out the result according to the type/class of the search query. Say, for example, the user searches for BRCA1. Now, the user would be able to filter the search results by the type of the search query like publication, Gene, mRNA, synonyms etc.
5. Allow the user to filter the results according to the scores/relevances set by him/her.
6. Implement a feature to select from the neighborhood, for example, when the user selects MODs and plants (neighborhoods), all the mines which have MODs and plants as their neighbors will get searched along with the selected mines.
7. Implement a feature for graphical analysis of data related to any search term in form of pie charts. For example,  
   a. Analysing which mines have the most correlation with the search query.<br />
   b. Analysing which mines matches the search term and has maximum scores.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Running

This is a complete client-side web application and just requires an active internet connection and a browser to run. Open the `index.html` in your favourite browser and you are good to go.

## Technology Stack
* **Markup Language** - HTML, CSS

* **Programming Language** - Javascript

* **Libraries** - JQuery, Bootstrap

* **Testing Tools** - Chrome/Mozilla Developer Tools, Selenium Web Automation Tool

* **Data Visualisation** - Chart.js

## Contributing

Please read [CONTRIBUTING.md]() for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Himanshu Kumar** - *Initial work* - [himanshukumar660](https://github.com/himanshukumar660)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## Acknowledgments

* Intermine group

