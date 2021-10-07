-- Modify the CREATE TABLE statements as needed to add constraints.
-- Do not otherwise change the column names or types.
CREATE TABLE Users
(spotify_username VARCHAR(256) NOT NULL,
 fun_name VARCHAR(256) NOT NULL,
 -- profile_picture VARBINARY
 id VARCHAR(256) NOT NULL REFERENCES Listening_Party(id)
 PRIMARY KEY (spotify_username, id)
);
 
CREATE TABLE Host
(id INTEGER NOT NULL
  PRIMARY KEY REFERENCES User(id)
);
 
CREATE TABLE Attendee
(id INTEGER NOT NULL
  PRIMARY KEY REFERENCES User(id)
);
 
CREATE TABLE Listening_Party
(spotify_playlist_name VARCHAR(32) NOT NULL,
 id INTEGER NOT NULL PRIMARY KEY,
 time_created TIMESTAMP NOT NULL,
);
 
CREATE TABLE Song
(spotify_id VARCHAR(32) NOT NULL,
 time_added TIMESTAMP NOT NULL,,
 time_removed TIMESTAMP,
 playlist_position INTEGER, 
PRIMARY KEY(spotify_id, time_added),
 CONSTRAINT deed_check CHECK((description LIKE 'Arriving late,%' AND points <=-10) OR (description NOT LIKE 'Arriving late,%'))
);
 
CREATE TABLE Settings
(id INTEGER NOT NULL PRIMARY KEY REFERENCES Listening_Party(id),
 vote_type VARCHAR(32) NOT NULL CHECK(vote_type IN(‘MAJORITY RULES’, 'NO DOWN VOTES', ''))
);
 
 
CREATE TABLE Voting_Record
(spotify_username VARCHAR(256) NOT NULL REFERENCES Users(spotify_username),
 id INTEGER NOT NULL REFERENCES Listening_Party(id),
 vote INTEGER NOT NULL CHECK (vote >= -1 AND vote != 0 AND vote <= 1),
 spotify_id VARCHAR(32) NOT NULL REFERENCES Song(spotify_id),
 time_added TIMESTAMP NOT NULL REFERENCES Song(time_added),
 PRIMARY KEY(spotify_username, id, spotify_id, time_added)
);
 
 
-- Define a view that lists, for each song on the voting block, the total -- number of votes it currently has.
CREATE VIEW Voting_Block(spotify_uid, total_votes) AS
SELECT Song.spotify_uid, SUM(Voting_Record.vote) AS total_votes
FROM (SELECT * FROM Voting_Record, Song
WHERE (Voting_Record.time_added = Song.time_added AND Voting_Record.spotify_id = Song.spotify_id AND Song.time_removed IS NULL)) 
AS V,
GROUP BY V.spotify_id, V.time_added;
