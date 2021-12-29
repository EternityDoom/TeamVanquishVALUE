# Mr Booksy

## Project Description

Created a customer-facing Experience Cloud website for a fictional company. Used all necessary declarative customization, and created a series of Lightning Web/Aura components to add funtionality to the site. Also created Apex code to provide server-side behavior for the components.

## Technologies Used

* Salesforce
* Lightning Framework
* Experience Cloud
* Github Desktop
* Apex

## Features

List of features ready and TODOs for future development
* Created a LWC carousel that displays the Display URL field of each product(Books) in which we conveniently placed an image url. The purpose of this LWC was to showcase
the different books in our records.

To-do list:
* Display the average review score in the review table page in order to accurately measure the overall rating of a book based on their review ratings.
* Create different aura components that interacted with each others lwcs.
* Apex Classes and triggers to handle server-side logic for components. 

## Getting Started
   
Git commands:
  - Git clone
  - Git add
  - Git commit
  - Git push
  
Salesforce CLI:
  - sfdx force:project:create --projectname Bookstore
  - sfdx force:org:create -f project-scratch-def.json --nonamespace
  - sfdx force:package:create
  - sfdx force:package:version:create
  - sfdx force:package:install

## Usage

![front page](https://user-images.githubusercontent.com/43623906/147604025-2166370c-956e-4844-896a-e9dd905e9128.PNG)
* This is the front page of our experience cloud here we inform the user about the rules to follow in order to leave a review.
![createcontactpage](https://user-images.githubusercontent.com/43623906/147604038-a9421f7e-e1df-429e-829f-faeb7efb0595.PNG)
* Contact form includes error message for invalid input.
![viewrecpage](https://user-images.githubusercontent.com/43623906/147604050-37d7b3d3-98e1-48cf-afaf-1cd4bfa133ac.PNG)
* This table displays the 10 most recent recommendations.
![createrevpage](https://user-images.githubusercontent.com/43623906/147604056-04a6733f-0133-48b7-ab2b-a36a666ef254.PNG)
* In this page we have 3 different components one displays the different products available in our data base. The other component displays the relevant information about the products displayed. Lastly but not least the other component conditionally displays a review form with the use of a button event.


## Contributors

- Shayan Parvizi
- Jason Schley
- Daniel Ferraro
- Manuel Guzman

## License
This project uses the following license: [MIT License](https://choosealicense.com/licenses/mit/).

