CREATE TABLE Users
(fun_name VARCHAR(64) NOT NULL,
 user_type VARCHAR(32) NOT NULL CHECK(user_type IN ('host', 'attendee')),
 id INTEGER NOT NULL REFERENCES Listening_Party(id),
 PRIMARY KEY (fun_name, id)
);

 
CREATE TABLE Listening_Party
(spotify_playlist_name VARCHAR(32) NOT NULL,
 id INTEGER NOT NULL PRIMARY KEY,
 time_created TIMESTAMP NOT NULL,
 currently_playing INTEGER,
 device_id VARCHAR(64) NOT NULL,
 spotify_user_id VARCHAR(64) NOT NULL
);
 
CREATE TABLE Song
(spotify_id VARCHAR(32) NOT NULL,
 song_length INTEGER NOT NULL,
 time_added TIMESTAMP NOT NULL,
 time_removed TIMESTAMP,
 playlist_position INTEGER, 
PRIMARY KEY(spotify_id, time_added)
);


CREATE TABLE Voting_Record
(spotify_username VARCHAR(64) NOT NULL REFERENCES Users(spotify_username),
 id INTEGER NOT NULL REFERENCES Listening_Party(id),
 vote INTEGER NOT NULL CHECK (vote >= -1 AND vote != 0 AND vote <= 1),
 vote_time TIMESTAMP NOT NULL, 
 spotify_id VARCHAR(32) NOT NULL REFERENCES Song(spotify_id),
 time_added TIMESTAMP NOT NULL REFERENCES Song(time_added),
 PRIMARY KEY(spotify_username, id, spotify_id, time_added)
);

/*
CREATE TABLE Host
(id INTEGER NOT NULL
  PRIMARY KEY REFERENCES User(id)
);
 
CREATE TABLE Attendee
(id INTEGER NOT NULL
  PRIMARY KEY REFERENCES User(id)
);

CREATE TABLE Settings
(id INTEGER NOT NULL PRIMARY KEY REFERENCES Listening_Party(id),
 vote_type VARCHAR(32) NOT NULL CHECK(vote_type IN(‘MAJORITY RULES’, 'NO DOWN VOTES', ''))
);
*/

-- Define a view that lists, for each song on the voting block, the total -- number of votes it currently has.
CREATE VIEW Voting_Block(spotify_uid, time_added, total_votes) AS
SELECT Song.spotify_id, Song.time_added, SUM(Voting_Record.vote) AS total_votes
FROM Voting_Record, Song
WHERE (Voting_Record.time_added = Song.time_added AND Voting_Record.spotify_id = Song.spotify_id AND Song.time_removed IS NULL)
GROUP BY Voting_Record.spotify_id, Voting_Record.time_added
ORDER BY SUM(Voting_Record.vote) DESC;

 
-- Ensure songs added have null time removed and null playlist position when first added 




DELIMITER //

CREATE TRIGGER TG_Invalid_Song_Input
  BEFORE INSERT ON Song
  FOR EACH ROW

    BEGIN
    IF ((NEW.playlist_position IS NOT NULL) 
    AND (NEW.time_removed IS NOT NULL)) THEN
     SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO=30001,         MESSAGE_TEXT='Invalid input: Playlist_position and time_removed must be NULL for newly added songs';

    END IF;

    END
 

  //
  
  DELIMITER ;





-- A song can only be in the voting block once


DELIMITER //

CREATE TRIGGER TG_Stop_Add_to_Voting_Block
  BEFORE INSERT ON Song
  FOR EACH ROW
    BEGIN 
        IF (EXISTS (SELECT * FROM Song
    WHERE Song.spotify_id = NEW.spotify_id AND Song.time_added) IS NOT NULL 
    AND Song.time_removed IS NULL) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO=30001,         MESSAGE_TEXT='Song is currently on the voting block';

    END IF;

    END

    //





-- Ensure 10 minute song cooldown time



DELIMITER //
CREATE TRIGGER TG_Song_Cooldown
  BEFORE INSERT ON Song
  FOR EACH ROW
  BEGIN
    IF EXISTS (SELECT * FROM Song
    WHERE Song.spotify_id = NEW.spotify_id AND 
    NEW.time_added() < 10 + (SELECT DISTINCT time_removed FROM Song
    WHERE s1.spotify_id = NEW.spotify_id ORDER BY time_removed DESC)) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO=30001,         MESSAGE_TEXT='This song was recently removed from the voting block';

    END IF;
  END
  
  //

/*
-- Remove song from voting block after it is added to the queue 
-- This is in progress 
CREATE FUNCTION TF_Remove_From_Voting_Block() RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT * FROM Song
    WHERE 
    THEN
    UPDATE Song SET time_removed = current_timestamp WHERE spotify_id = NEW.spotify_id AND time_added = NEW.time_added;
  END IF;
  RETURN NEW;
END;

$$ LANGUAGE plpgsql;
CREATE TRIGGER TG_Remove_From_Voting_Block
  AFTER UPDATE ON Listening_Party
  FOR EACH ROW
  EXECUTE PROCEDURE TF_Remove_From_Voting_Block();
*/

-- Update song playlist position and time removed after it begins playing  

-- prevent blacklisted users from joining listening party


DELIMITER //
CREATE TRIGGER TG_Enforce_Blacklist
  BEFORE INSERT ON Users
  FOR EACH ROW
  BEGIN
     IF EXISTS (SELECT * FROM Blacklist
    WHERE Blacklist.spotify_username = NEW.spotify_username AND 
    Blacklist.id = New.id) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO=30001,         MESSAGE_TEXT='This user is blacklisted';
 
  END IF;
  END

//
-- user can only vote on a song once (this might be covered by key constraints)



DELIMITER //

CREATE TRIGGER TG_One_Vote
  BEFORE INSERT ON Voting_Record
  FOR EACH ROW
  BEGIN
   IF EXISTS (SELECT * FROM Voting_Record
    WHERE Voting_Record.spotify_username = NEW.spotify_username AND 
    Voting_Record.id = New.id AND Voting_Record.spotify_id = NEW.spotify_id
    AND Voting_Record.time_added = NEW.time_added) THEN
      SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO=30001,         MESSAGE_TEXT='This user has already voted on this song';
  END IF;
  END

  //


-- Remove song from voting block after receiving downvotes (majority downvotes)



DELIMITER //

CREATE TRIGGER TG_Majority_Dislikes
  AFTER INSERT ON Voting_Record
  FOR EACH ROW
  BEGIN
     IF EXISTS (SELECT * FROM Voting_Block
    WHERE Voting_Block.spotify_id = NEW.spotify_id AND Voting_Block.time_added = NEW.time_added
    AND Voting_Block.total_votes <= (SELECT -1 * FLOOR(COUNT(*)/2) FROM USER)) THEN
    UPDATE Song SET time_removed = current_timestamp WHERE spotify_id = NEW.spotify_id AND time_added = NEW.time_added;

    END IF;

  END
 //




