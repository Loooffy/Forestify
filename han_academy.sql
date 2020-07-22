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
-- MySQL dump 10.13  Distrib 5.7.30, for Linux (x86_64)
--
-- Host: localhost    Database: han_academy
-- ------------------------------------------------------
-- Server version	5.7.30-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `QA`
--

DROP TABLE IF EXISTS `QA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QA` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `quiz_id` int(11) DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `post_time` datetime DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `head_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QA`
--

LOCK TABLES `QA` WRITE;
/*!40000 ALTER TABLE `QA` DISABLE KEYS */;
INSERT INTO `QA` VALUES (1,'hello world',1,1,'2020-07-12 12:13:14','first post',NULL),(2,'foobar',2,1,'2020-07-12 00:00:00','second post',NULL),(14,'ok?',1,1,'2020-07-20 18:51:00','test',NULL),(22,'done',1,1,'2020-07-20 21:55:00','done?',0),(23,'done',1,1,'2020-07-20 22:05:00','done?',0),(24,'done',1,1,'2020-07-20 22:07:00','done?',0),(25,'done',1,1,'2020-07-20 22:16:00','done?',0),(26,'done',1,1,'2020-07-20 22:17:00','done?',0),(27,'finish',1,1,'2020-07-20 22:20:00','finish?',0),(28,'finish',1,1,'2020-07-20 22:22:00','finish?',0);
/*!40000 ALTER TABLE `QA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avatar`
--

DROP TABLE IF EXISTS `avatar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `avatar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avatar`
--

LOCK TABLES `avatar` WRITE;
/*!40000 ALTER TABLE `avatar` DISABLE KEYS */;
/*!40000 ALTER TABLE `avatar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quiz` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `grade` int(11) DEFAULT NULL,
  `question` varchar(255) DEFAULT NULL,
  `images` varchar(255) DEFAULT NULL,
  `options` varchar(255) DEFAULT NULL,
  `answer` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz`
--

LOCK TABLES `quiz` WRITE;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
INSERT INTO `quiz` VALUES (1,'1','1',1,'將一元二次方程式  $x^{2} - 6x - 5 = 0$ 化成  $(x+a)^{2} = b$ 的型式，則  $b = $ ？','1','[{\"content\":\"(A) $-4$\\n\"}, {\"content\":\"(B) $4$\\n\\n\"}, {\"content\":\"(C) $-14$\\n\"}, {\"content\":\"(D) $14$\" }]','A'),(2,'2','2',2,'將一元二次方程式  $x^{2} - 6x - 5 = 0$ 化成  $(x+a)^{2} = b$ 的型式，則  $b = $ ？','1','[{content:\'(A) $-4$\\n\'}, {content:\'(B) $4$\\n\\n\'}, {content:\'(C) $-14$\\n\'}, {content:\'(D) $14$\' }]','2'),(3,'3','3',3,'如果二元一次聯立方程式 $\\left\\{\\begin{array}{l} 4x+3y=10\\\\ 3x-y=1 \\end{array}\\right.$的解能滿足 $2x+y+k=0$，則 $k=$？','1','[{\"content\":\"$\\\\mbox{(A)}\\\\ 4$\",\"correct\":false},{\"content\":\"$\\\\mbox{(B)}\\\\ 5$\",\"correct\":false},{\"content\":\"$\\\\mbox{(C)}-4$\",\"correct\":true},{\"content\":\"$\\\\mbox{(D)}-5$\",\"correct\":false}]',NULL);
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_solving`
--

DROP TABLE IF EXISTS `quiz_solving`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quiz_solving` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quiz_id` int(11) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `time_cost` int(11) DEFAULT NULL,
  `pass` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_quiz_solving_1_idx` (`quiz_id`),
  CONSTRAINT `fk_quiz_solving_1` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_solving`
--

LOCK TABLES `quiz_solving` WRITE;
/*!40000 ALTER TABLE `quiz_solving` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_solving` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `avatar_id` int(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `fk_student_1_idx` (`avatar_id`),
  CONSTRAINT `fk_student_1` FOREIGN KEY (`avatar_id`) REFERENCES `avatar` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,'foo','bar','123',NULL),(27,'foo1','bar1','123',NULL);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `votes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `giver_id` int(11) DEFAULT NULL,
  `QA_id` int(11) DEFAULT NULL,
  `vote` int(11) DEFAULT '0',
  `quiz_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_votes_1_idx` (`QA_id`),
  KEY `fk_votes_4_idx` (`quiz_id`),
  CONSTRAINT `fk_votes_1` FOREIGN KEY (`QA_id`) REFERENCES `QA` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_votes_4` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votes`
--

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;
INSERT INTO `votes` VALUES (2,0,1,0,1),(124,0,14,1,1),(136,0,24,1,1),(139,0,28,0,1),(140,1,28,1,1),(141,1,1,0,1),(142,1,24,1,1),(143,1,14,1,1);
/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-07-21  9:33:45
