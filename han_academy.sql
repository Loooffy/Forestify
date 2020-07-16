CREATE TABLE `quiz` (
  `id` int PRIMARY KEY,
  `title` varchar(255),
  `code` varchar(255),
  `grade` int,
  `question` varchar(255),
  `images` varchar(255),
  `options` varchar(255),
  `answer` varchar(255)
);

CREATE TABLE `category` (
  `id` int PRIMARY KEY,
  `level` varchar(255),
  `code` varchar(255),
  `name` varchar(255)
);

CREATE TABLE `quiz_solving` (
  `id` int PRIMARY KEY,
  `quiz_id` int,
  `student_id` int,
  `time` datetime,
  `time_cost` int,
  `pass` boolean
);

CREATE TABLE `student` (
  `id` int PRIMARY KEY,
  `name` varchar(255),
  `email` varchar(255),
  `password` varchar(255),
  `avatar_id` int(255)
);

CREATE TABLE `avatar` (
  `id` int PRIMARY KEY,
  `name` varchar(255),
  `image` varchar(255)
);

CREATE TABLE `question` (
  `id` int PRIMARY KEY,
  `content` varchar(255),
  `quiz_id` int,
  `student_id` int,
  `time` datetime
);

CREATE TABLE `answer` (
  `id` int PRIMARY KEY,
  `content` varchar(255),
  `question_id` int,
  `student_id` int,
  `time` datetime
);

CREATE TABLE `points` (
  `id` int PRIMARY KEY,
  `quiz_id` int,
  `student_id` int
);

CREATE TABLE `votes` (
  `id` int PRIMARY KEY,
  `giver_id` int,
  `getter_id` int,
  `question_id` int,
  `answer_id` int
);

CREATE TABLE `discussion` (
  `id` int PRIMARY KEY,
  `content` varchar(255),
  `question_id` int,
  `answer_id` int,
  `student_id` int,
  `head_id` int,
  `time` datetime
);

ALTER TABLE `quiz_solving` ADD FOREIGN KEY (`student_id`) REFERENCES `student` (`id`);

ALTER TABLE `quiz_solving` ADD FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`);

ALTER TABLE `student` ADD FOREIGN KEY (`avatar_id`) REFERENCES `avatar` (`id`);

ALTER TABLE `question` ADD FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`);

ALTER TABLE `question` ADD FOREIGN KEY (`student_id`) REFERENCES `student` (`id`);

ALTER TABLE `answer` ADD FOREIGN KEY (`question_id`) REFERENCES `question` (`id`);

ALTER TABLE `answer` ADD FOREIGN KEY (`student_id`) REFERENCES `student` (`id`);

ALTER TABLE `points` ADD FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`);

ALTER TABLE `points` ADD FOREIGN KEY (`student_id`) REFERENCES `student` (`id`);

ALTER TABLE `votes` ADD FOREIGN KEY (`giver_id`) REFERENCES `student` (`id`);

ALTER TABLE `votes` ADD FOREIGN KEY (`getter_id`) REFERENCES `student` (`id`);

ALTER TABLE `votes` ADD FOREIGN KEY (`question_id`) REFERENCES `question` (`id`);

ALTER TABLE `votes` ADD FOREIGN KEY (`answer_id`) REFERENCES `answer` (`id`);

ALTER TABLE `discussion` ADD FOREIGN KEY (`question_id`) REFERENCES `question` (`id`);

ALTER TABLE `discussion` ADD FOREIGN KEY (`answer_id`) REFERENCES `answer` (`id`);

ALTER TABLE `discussion` ADD FOREIGN KEY (`student_id`) REFERENCES `student` (`id`);
