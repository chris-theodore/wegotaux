Group Name: The Party People (temporary)
Open Project Option

Group Members:
Ezra Belgrave
Preston McDonald
Kenny Moore
Clara Savchik
Chris Theodore

Final Project Video: https://www.youtube.com/watch?v=5acc2cqQTUc
Final project currently being run off EzraCSS gitlab branch.
We would like to be included in the voting.
Final Project Updates: 
Clara
-I transitioned to work on the frontend with Chris to solve some of the nagging issues with the multi user functionality of the application. This week was all about debugging and attempting to fix any remaining issues particularly with the multi user functionality. 
Chris
 While working alongside Clara, I was able to create both frontend and backend functionalities needed to complete our app. I worked heavily on creating sockets to allow multi-user functionality, as well as creating proper database calls to allow our app to work as intended. Clara and I also worked heavily on a big code chunk for the voting block functionality to be maintained throughout the app. I also helped clean up some of our database schema to make sure it was exactly what we needed and also worked on allowing delete on cascade. The final days leading up to this has been debugging and fixing lingering issues
Preston
I worked in our SQL file, changing the schema as design decisions necessitated them. I worked with Clara and Kenny to work out various design problems, ex. how we would know when state changes occurred, and the logic for how to update the tables when songs changed. I wrote triggers to enforce voting behavior, ex. A user cannot vote on the same song twice.  
Kenny
Worked on functions to allow the user to join the listening party.  Also worked on web design through the css files.  Created an outline for the final report.  
Ezra
 Worked on UI functionality and styling so that each component looks as intended. Worked on cleaning up code in documents. 


Milestone 3: 
Kenny: During this milestone, I worked with the group to make progress on the
back end.  We had many meetings to move forward and get on the same page.  
These meetings were productive and I tried to take the lead on keeping notes.
There were multiple problems with the environment during the past couple
weeks.  When we had to switch the git website we were using, I went to
office hours to clarify an issue, as well as create a cheat sheet for 
git commands.  I think this knowledge helped the team as a whole.  Finally, 
my environment with XAMPP was giving me trouble.  Despite me working 
with the team to try and fix, as well as going to office hours, the problem
could not be fixed.  I wrote drafts of database sql calls, but they are 
untested.  Going forward I am going to be helping more with the front end.

Chris: I have made a lot of progress since milestone 2. I have taken our figma 
designs and now have impleneted not only their design but also all the functioning 
API calls that interact with the backend. I have been teaming up with Clara to 
make sure our server and frontend are getting all the information that they 
both need. We now have a functioning frontend for a lot of the host user view. 
I will now be getting Kenny's help to work on the voting block portion of the
frontend and then also focus more on making a normal listeners view work properly.

Clara:  I finished all of the necessary backend HTTP requests with the Spotify
API and worked with Chris in order to integrate the API calls with the frontend. 
I unit tested the Spotify API calls with Postman. Finally, Preston, Kenny, and 
I set up the mysql database on the backend. We discussed and wrote out all of 
the necessary queries database queries; I began translating the queries to
node.js/mysql code. 

Preston: Since milestone 2 I have continued to work in the sql file. 
As we have progressed in the project we have made many design decisions
that changed both our schemes and which triggers would be necessary.
I have written triggers that make sure inputs have the correct information, 
update the currently playing and queued song, remove songs from the voting 
block based on different criteria and ensure users can only vote in a song once 

Ezra: personal absence.


Milestone 2: 

Ezra: This week, I worked on setting up the React file for our project and populating everything in Git to lay the foundation for the project. I also connected our app with the Spotify developers tool so that we can begin using their preexisting APIs. In addition, I paired up with Chris to begin sketching out the frontend design and components. 

Chris: This week, I worked on creating our Git Repo for the team, as well as organizing team meetings. Aside from administrative tasks, I began working on mock-ups for frontend design ideas with Ezra. We started working together on Figma to create possible layouts for how we envision the app working on the frontend and paired it with notes that we can consider when working with the backend team as well as the frontend code.

Clara/Preston/Kenny: This week we worked as a group on the backend database setup for our project. We created an E/R diagram, translated it into schema, and implemented in SQL. In the process of creating the SQL script, we discussed and documented many constraints and edge cases. Specifically, Preston and Clara worked on writing the SQL script while Kenny wrote the proposal. 

