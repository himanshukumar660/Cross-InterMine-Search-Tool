# Cross-Intermine Search Tool
This repository contains a functional prototype for the Intermine Search tool.

## Title
A client-driven cross-InterMine search page to search term once, and search many (or all) InterMines at the same time.

## Synopsis
There are lots of InterMines to explore organism and other research data provided by many different organizations. But, there is no centralized search tool from where quick search information like name, class, description, versions, organism, colors, logo from multiple mines could be retrieved at once. This leads an inefficient process of visiting the official sites of each mine in order to get these data. Motivated by these problems, Cross Intermine search tool idea was conceived. The aim is to create a search tool that uses InterMine web services to type a search term once and search many (or all) InterMines at the same time.

## Technology Stack
<b>Markup Language</b>: HTML, CSS<br />
<b>Programming Language</b>: Javascript<br />
<b>Libraries</b>: JQuery, Bootstrap<br /> 
<b>Testing Tools</b>: Chrome/Mozilla Developer Tools,  Selenium<br />
<b>Data Visualisation</b>: Chart.js<br />

# Theoretical Explanation
When the user enters a search term, we make a quick search across selected/all the mines and display the results which will look similar to Google search, with information fetched from the quick search APIs of the respective mines. One caveat to the developer is that while searching through all the mines, it may so happen that some API responds with a status code of 200 while some fail to render results. In this case, we use a user-friendly UI design that would inform the users about the mines that fail to render the results. We also provide a feature that allows the user to search the mines that belong to a certain neighborhood. Other features include adjusting the number of results to be fetched from the front end, filter the results according to the class type of the results, filter results according to the scores/relevances set by the user etc.

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
