file structure of backend

entry point: server.js, backend server actually started from this file
    -server.js imports the functions created within the /routes folder (desribed below)
    
http requests (either to database, spotify api, or authentication): actually
within the /routes folders
    -/routes folders    
        -authentication.js, spotify authentication code
        -database.js, http requests to database
        -spotify_api.js, calls to spotify api for various info


general tips:

-in order to update dependencies in backend make sure you run:
'npm install' in the terminal at the folder level where
server/package.json file is located

to run server:
-run 'npm start' from same folder level as server/package.json