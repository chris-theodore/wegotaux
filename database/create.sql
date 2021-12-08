CREATE TABLE Users
(fun_name VARCHAR(64) NOT NULL,
 user_type VARCHAR(32) NOT NULL CHECK(user_type IN ('host', 'attendee')),
 id VARCHAR(5) NOT NULL REFERENCES Listening_Party(id) ON DELETE CASCADE,
 PRIMARY KEY (fun_name, id)
);

 
CREATE TABLE Listening_Party
(spotify_playlist_name VARCHAR(32),
 id VARCHAR(5) NOT NULL PRIMARY KEY,
 time_created TIMESTAMP NOT NULL,
 device_id VARCHAR(64),
 spotify_user_id VARCHAR(64),
 playlist_id VARCHAR(64)
);
 
CREATE TABLE Song
(spotify_id VARCHAR(32) NOT NULL,
 party_id VARCHAR(5) NOT NULL REFERENCES Listening_Party(id) ON DELETE CASCADE,
--  song_id VARCHAR(40) DEFAULT uuid(),
 is_removed INTEGER NOT NULL CHECK (is_removed >= 0 AND is_removed <= 1),
 time_added TIMESTAMP NOT NULL,
 on_queue INTEGER NOT NULL CHECK (is_removed >= 0 AND is_removed <= 1),
 img VARCHAR(128) NOT NULL,
 title VARCHAR(128) NOT NULL,
 PRIMARY KEY(spotify_id, party_id)
);


CREATE TABLE Voting_Record
(fun_name VARCHAR(64) NOT NULL REFERENCES Users(fun_name) ON DELETE CASCADE,
 id VARCHAR(5) NOT NULL REFERENCES Listening_Party(id) ON DELETE CASCADE,
 vote INTEGER NOT NULL CHECK (vote >= -1 AND vote <= 1),
 vote_time TIMESTAMP NOT NULL, 
--  spotify_id VARCHAR(32) REFERENCES Song(spotify_id), WE NEED TO RE LOOK AT THIS
 spotify_id VARCHAR(32) NOT NULL REFERENCES Song(spotify_id) ON DELETE CASCADE,
 PRIMARY KEY(fun_name, id, spotify_id)
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
CREATE VIEW Voting_Block(spotify_uid, song_id, total_votes) AS
SELECT Song.spotify_id AS spotify_uid, Song.song_id AS song_id, SUM(Voting_Record.vote) AS total_votes, Song.img AS img, Song.title AS title, 
FROM Voting_Record, Song
WHERE (Voting_Record.song_id = Song.song_id AND Song.is_removed = 0)
GROUP BY Voting_Record.song_id;
ORDER BY total_votes DESC;

 
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



-- user can only vote on a song once (this might be covered by key constraints)



DELIMITER //

CREATE TRIGGER TG_One_Vote
  BEFORE INSERT ON Voting_Record
  FOR EACH ROW
  BEGIN
   IF EXISTS (SELECT * FROM Voting_Record
    WHERE Voting_Record.fun_name = NEW.fun_name AND 
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

