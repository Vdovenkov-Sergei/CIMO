-- Добавление тестовых данных для таблицы users
INSERT INTO users (id, user_name, email, hashed_password) VALUES
(1, 'Alice', 'alice@example.com', 'hashed_password_1'),
(2, 'Bob', 'bob@example.com', 'hashed_password_2'),
(3, 'Charlie', 'charlie@example.com', 'hashed_password_3'),
(4, 'David', 'david@example.com', 'hashed_password_4'),
(5, 'Eve', 'eve@example.com', 'hashed_password_5');

-- Добавление тестовых данных для таблицы movies
INSERT INTO movies (id, title, release_date, age_restriction, runtime, poster_id, imdb_id, kinopoisk_id, overview, genres, countries) VALUES
(1, 'Inception', '2010-07-16', 13, 148, 101, 1375666, 447301, 'A mind-bending thriller', '["Sci-Fi", "Action"]', '["USA"]'),
(2, 'The Matrix', '1999-03-31', 16, 136, 102, 133093, 301, 'A hacker discovers reality', '["Sci-Fi", "Action"]', '["USA"]'),
(3, 'Interstellar', '2014-11-07', 13, 169, 103, 816692, 258687, 'A journey beyond stars', '["Sci-Fi", "Adventure"]', '["USA", "UK"]'),
(4, 'The Dark Knight', '2008-07-18', 13, 152, 104, 468569, 111543, 'Batman vs Joker', '["Action", "Crime"]', '["USA"]'),
(5, 'Fight Club', '1999-10-15', 18, 139, 105, 137523, 395573, 'An underground fight club', '["Drama", "Thriller"]', '["USA"]');

-- Добавление тестовых данных для таблицы viewed_movies
INSERT INTO viewed_movies (id, user_id, movie_id, review) VALUES
(1, 1, 1, 9),
(2, 1, 2, 8),
(3, 2, 3, 10),
(4, 3, 4, 7),
(5, 4, 5, 9);

-- Добавление тестовых данных для таблицы chats
INSERT INTO chats (id, user_id, bot_name, created_at) VALUES
(1, 1, 'MovieBot', '2024-02-20 12:00:00'),
(2, 2, 'FilmHelper', '2024-02-20 12:30:00'),
(3, 3, 'CineGuide', '2024-02-20 13:00:00'),
(4, 4, 'MovieMate', '2024-02-20 14:00:00'),
(5, 5, 'FilmBuddy', '2024-02-20 15:00:00');

-- Добавление тестовых данных для таблицы messages
INSERT INTO messages (id, chat_id, created_at, sender, content) VALUES
(1, 1, '2024-02-20 12:05:00', 'USER', 'Hello!'),
(2, 1, '2024-02-20 12:06:00', 'BOT', 'Hi! How can I assist you?'),
(3, 2, '2024-02-20 12:35:00', 'USER', 'Recommend me a movie'),
(4, 3, '2024-02-20 13:10:00', 'BOT', 'How about Inception?'),
(5, 4, '2024-02-20 14:20:00', 'USER', 'Tell me about The Matrix');

-- Добавление тестовых данных для таблицы sessions
INSERT INTO sessions (id, user_1_id, user_2_id, session_type) VALUES
(1, 1, 2, 'WATCH_TOGETHER'),
(2, 2, 3, 'CHAT'),
(3, 3, 4, 'WATCH_TOGETHER'),
(4, 4, 5, 'CHAT'),
(5, 5, 1, 'WATCH_TOGETHER');

-- Добавление тестовых данных для таблицы connection_requests
INSERT INTO connection_requests (id, sender_id, receiver_id, created_at) VALUES
(1, 1, 2, '2024-02-20 10:00:00'),
(2, 2, 3, '2024-02-20 10:30:00'),
(3, 3, 4, '2024-02-20 11:00:00'),
(4, 4, 5, '2024-02-20 11:30:00'),
(5, 5, 1, '2024-02-20 12:00:00');

-- Добавление тестовых данных для таблицы session_movies
INSERT INTO session_movies (id, user_id, movie_id) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5);

-- Добавление тестовых данных для таблицы watch_later_movies
INSERT INTO watch_later_movies (id, user_id, movie_id) VALUES
(1, 1, 3),
(2, 2, 4),
(3, 3, 5),
(4, 4, 1),
(5, 5, 2);
