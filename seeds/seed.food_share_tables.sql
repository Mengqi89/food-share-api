BEGIN;

TRUNCATE
list,
users
RESTART IDENTITY CASCADE;

INSERT INTO users (username, first_name, last_name, password, email)
VALUES
('dunder1', 'Dundera', 'Mifflina', 'password', 'dunder1@dunder.net'),
('dunder2', 'Dunderb', 'Mifflinb', 'password', 'dunder2@dunder.net'),
('dunder3', 'Dunderc', 'Mifflinc', 'password', 'dunder3@dunder.net'),
('dunder4', 'Dunderd', 'Mifflind', 'password', 'dunder4@dunder.net'),
('dunder5', 'Dundere', 'Miffline', 'password', 'dunder5@dunder.net'),
('dunder6', 'Dunderf', 'Mifflinf', 'password', 'dunder6@dunder.net'),
('dunder7', 'Dunderg', 'Miffling', 'password', 'dunder7@dunder.net');

INSERT INTO list (title, summary, address, contact, type, zip, username)
VALUES
('title 1', 'summary 1', 'Address 1', 'email1@email.com', 'vegetable', '84103', 1),
('title 2', 'summary 2', 'Address 2', 'email2@email.com', 'vegetable', '84103', 2),
('title 3', 'summary 3', 'Address 3', 'email3@email.com', 'vegetable', '84103', 3),
('title 4', 'summary 4', 'Address 4', 'email4@email.com', 'vegetable', '84102', 4),
('title 5', 'summary 5', 'Address 5', 'email5@email.com', 'fruit', '84102', 5),
('title 6', 'summary 6', 'Address 6', 'email6@email.com', 'fruit', '84102', 6),
('title 7', 'summary 7', 'Address 7', 'email7@email.com', 'fruit', '84102', 7);

COMMIT;