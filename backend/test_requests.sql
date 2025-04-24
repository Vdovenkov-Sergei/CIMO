-- Вставка данных в таблицу users
INSERT INTO users (user_name, email, hashed_password) VALUES
('alex123', 'alex.johnson@example.com', '$2b$12$ZJdMxvhX5ZTjNRQG5LgF2eHl6MfD1g7HfY5r07E/Kx7f7BfpLdQnq'),
('sarah_m', 'sarah.miller@example.com', '$2b$12$8Gg9fjXFxEbTntzIZ6oAQOdXpyMyNhy8pU8L5AoW/vTk1jFHwZK1a'),
('john_d', 'john.doe@example.com', '$2b$12$5MK3dS9UjMPqTFA27xFJvO23uoxh1C1U2JxkFYyD0Lksk/Eh6cbyK'),
('linda_w', 'linda.watson@example.com', '$2b$12$d5eQrFO6mJo/Xz7nKwq4o.8t2FveHHp6H9UjK.8sN1.Kbl5Sy/W.i'),
('michael_b', 'michael.brown@example.com', '$2b$12$8SzJz9lYOvD3FtXIjRTZTu1B5rMytJHfHqT62uWc5MZz.bm6V8VCC'),
('emma_t', 'emma.taylor@example.com', '$2b$12$Duy8ZfT60v5h69A9f9OsmO3Zbl7R9N9M6OvMHTm1PUH2RghK.wS22'),
('chris_p', 'chris.parker@example.com', '$2b$12$3sUwMUB8HvMPVzQPLmXt6.RtTVEeqf2y/q/Y6pXnWcq45.qmb.qWi');

-- Вставка данных в таблицу movies
INSERT INTO movies (type, name, release_year, description, rating_kp, rating_imdb, runtime, age_rating, poster_url, genres, countries) VALUES
('MOVIE', 'Интерстеллар', 2014, 'Фантастический фильм Кристофера Нолана о путешествиях сквозь время и пространство.', 8.6, 8.8, 169, 12, 'https://example.com/interstellar.jpg', '{"фантастика", "драма", "приключения"}', '{"США", "Великобритания", "Канада"}'),
('MOVIE', 'Начало', 2010, 'Фильм о воровстве идей из снов с Леонардо ДиКаприо.', 8.2, 8.7, 148, 12, 'https://example.com/inception.jpg', '{"фантастика", "боевик", "триллер"}', '{"США", "Великобритания"}'),
('MOVIE', 'Темный рыцарь', 2008, NULL, 9.0, 9.0, 152, 16, 'https://example.com/dark_knight.jpg', '{"боевик", "триллер"}', '{"США", "Великобритания"}'),
('MOVIE', 'Матрица', 1999, 'Фильм про мир, управляемый машинным разумом.', 8.7, 8.5, NULL, NULL, 'https://example.com/matrix.jpg', '{"фантастика", "боевик"}', '{"США", "Австралия"}'),
('MOVIE', 'Гравитация', 2013, NULL, 7.7, 7.6, 91, 12, 'https://example.com/gravity.jpg', '{"фантастика", "драма"}', '{"США", "Великобритания"}'),
('MOVIE', 'Оно', 2017, 'Фильм ужасов о зловещем клоуне Пеннивайзе.', 7.3, 7.2, NULL, NULL, 'https://example.com/it.jpg', '{"ужасы", "триллер"}', '{"США", "Канада"}'),
('MOVIE', 'Джон Уик', 2014, 'История наемного убийцы, который выходит из тени ради мести.', 7.9, 7.8, 101, 18, 'https://example.com/john_wick.jpg', '{"боевик", "триллер"}', '{"США"}'),
('CARTOON', 'ВАЛЛ-И', 2008, 'Трогательная история робота, который очищает Землю.', 8.0, 7.9, 98, 0, 'https://example.com/walle.jpg', '{"анимация", "семейный", "фантастика"}', '{"США"}'),
('ANIME', 'Твоё имя', 2016, NULL, 8.4, 8.3, 106, 6, 'https://example.com/your_name.jpg', '{"аниме", "фэнтези", "мелодрама"}', '{"Япония"}'),
('MOVIE', 'Побег из Шоушенка', 1994, 'История побега из самой строгой тюрьмы.', 9.3, 9.3, 142, 16, 'https://example.com/shawshank.jpg', '{"драма"}', '{"США"}'),
('MOVIE', 'Бойцовский клуб', 1999, 'Мужчина, страдающий бессонницей, открывает подпольный клуб боев.', 8.5, 8.7, 139, 18, 'https://example.com/fight_club.jpg', '{"триллер", "драма"}', '{"США", "Германия"}'),
('MOVIE', 'Аватар', 2009, NULL, 7.8, 7.9, NULL, NULL, 'https://example.com/avatar.jpg', '{"фантастика", "боевик", "приключения"}', '{"США"}'),
('MOVIE', 'Достать ножи', 2019, NULL, 7.9, 8.0, NULL, 16, 'https://example.com/knives_out.jpg', '{"детектив", "триллер", "комедия"}', '{"США"}'),
('MOVIE', 'Искусственный интеллект', 2001, NULL, 7.2, 7.5, 146, NULL, 'https://example.com/artificial_intelligence.jpg', '{"фантастика", "драма"}', '{"США"}'),
('MOVIE', 'Терминатор 2: Судный день', 1991, NULL, 8.5, 8.6, 137, NULL, 'https://example.com/terminator2.jpg', '{"фантастика", "боевик"}', '{"США"}'),
('MOVIE', 'Доктор Стрэндж', 2016, NULL, 7.5, 7.4, 115, NULL, 'https://example.com/doctor_strange.jpg', '{"фантастика", "боевик", "приключения"}', '{"США"}'),
('MOVIE', 'Сияние', 1980, 'Культовый фильм ужасов про отель с призраками.', 8.4, 8.3, NULL, NULL, 'https://example.com/shining.jpg', '{"ужасы", "триллер"}', '{"США", "Великобритания"}'),
('MOVIE', 'Космическая одиссея 2001', 1968, 'Один из величайших фильмов о космосе и будущем человечества.', 8.3, 8.5, 149, NULL, 'https://example.com/2001_space_odyssey.jpg', '{"фантастика", "драма"}', '{"США", "Великобритания"}'),
('MOVIE', 'Не смотрите вверх', 2021, NULL, 6.7, 6.5, NULL, 16, 'https://example.com/dont_look_up.jpg', '{"комедия", "драма", "фантастика"}', '{"США"}'),
('MOVIE', 'Остров проклятых', 2010, NULL, 8.1, 8.2, NULL, 16, 'https://example.com/shutter_island.jpg', '{"детектив", "триллер", "драма"}', '{"США"}'),
('MOVIE', 'Заклятие', 2013, NULL, 7.5, 7.3, 112, 18, 'https://example.com/conjuring.jpg', '{"ужасы", "триллер"}', '{"США"}'),
('MOVIE', 'Синистер', 2012, 'Фильм ужасов о жуткой видеопленке и демоне Багул.', 6.8, 6.7, 110, NULL, 'https://example.com/sinister.jpg', '{"ужасы", "триллер"}', '{"США", "Канада"}'),
('MOVIE', 'Робот по имени Чаппи', 2015, 'История о роботе, который научился чувствовать.', 6.8, 6.9, 120, 12, 'https://example.com/chappie.jpg', '{"фантастика", "боевик"}', '{"США", "ЮАР"}');

-- Вставка данных в таблицу people
INSERT INTO people (name, photo_url) VALUES
('Кристиан Бейл', 'https://example.com/christian_bale.jpg'),
('Леонардо ДиКаприо', 'https://example.com/leonardo_dicaprio.jpg'),
('Хит Леджер', 'https://example.com/health_ledger.jpg'),
('Киану Ривз', NULL),
('Мэтт Деймон', 'https://example.com/matt_damon.jpg'),
('Вуди Харельсон', NULL),
('Роберт Дауни-младший', 'https://example.com/robert_downey_jr.jpg'),
('Том Хэнкс', 'https://example.com/tom_hanks.jpg'),
('Николь Кидман', NULL),
('Морган Фриман', 'https://example.com/morgan_freeman.jpg'),
('Джек Николсон', NULL),
('Эмма Стоун', 'https://example.com/emma_stone.jpg'),
('Джеймс Кэмерон', NULL),
('Кристофер Нолан', NULL),
('Фрэнсис Лоуренс', NULL);
