-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: project_yellowmemo
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  `x` int NOT NULL,
  `y` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `postId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_e44ddaaa6d058cb4092f83ad61f` (`postId`),
  KEY `FK_7e8d7c49f218ebb14314fdb3749` (`userId`),
  CONSTRAINT `FK_7e8d7c49f218ebb14314fdb3749` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_e44ddaaa6d058cb4092f83ad61f` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `introduction` text NOT NULL,
  `imageUrl` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (1,'박효진','₍ˆ..̮ˆ₎','/uploads/1765708049934-ed88rj.png'),(2,'남우준','잘 부탁드립니다','/uploads/1765708053416-3cv3rn.png'),(3,'최한슬','くコ:彡','/uploads/1765708056293-6ubopl.png');
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,1764004443895,'InitialSetup1764004443895'),(2,1765000000000,'AddUserIdToSemesters1765000000000');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `contents` json NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ae05faaa55c866130abef6e1fee` (`userId`),
  CONSTRAINT `FK_ae05faaa55c866130abef6e1fee` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'포스트잇','[{\"x\": 621.9714149633623, \"y\": 65, \"id\": 1, \"type\": \"text\", \"value\": \"포스트잇\"}, {\"x\": 482.336811306214, \"y\": 325, \"id\": 2, \"type\": \"text\", \"value\": \"안녕하세요! 저희 프로젝트는 포스트잇에서 영감을 받아 시작된, \\n아이디어를 빠르게 기록하고 정리할 수 있는 서비스입니다.\"}, {\"x\": 481.15964544797225, \"y\": 431, \"id\": 3, \"type\": \"text\", \"value\": \"작은 메모 하나가 큰 아이디어가 될 수 있도록, 누구나 부담 없이 \\n기록하고 정리할 수 있는 공간을 만들었습니다. \"}, {\"x\": 492.6193191462154, \"y\": 533, \"id\": 4, \"type\": \"text\", \"value\": \"아래의 댓글 적기 버튼으로 포스트잇을 붙여보세요!\"}, {\"x\": 616, \"y\": 95, \"id\": 5, \"url\": \"/uploads/1765708074352-pkjkp6.jpg\", \"type\": \"image\"}, {\"x\": 844, \"y\": 74, \"id\": 6, \"url\": \"/uploads/1765708082504-in1bri.jpg\", \"type\": \"image\"}, {\"x\": 349, \"y\": 71, \"id\": 7, \"url\": \"/uploads/1765708086536-5fru5b.jpg\", \"type\": \"image\"}]','2025-12-14 10:28:57.887703','2025-12-14 12:17:28.432745',1);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `semesters`
--

DROP TABLE IF EXISTS `semesters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `semesters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL DEFAULT 'semester_info',
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `imageUrl` longtext,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `userId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `semesters`
--

LOCK TABLES `semesters` WRITE;
/*!40000 ALTER TABLE `semesters` DISABLE KEYS */;
INSERT INTO `semesters` VALUES (1,'semester_info','현지학기제','영진전문대학교 일본IT학과에서는 2학년 여름 한 달간 현지의 문화를 체험하고 일본어 능력을 실질적으로 향상시킬 수 있는 ‘현지학기제’ 프로그램을 운영하고 있습니다.\n','/uploads/1765708012336-qkztrj.jpg','2025-12-14 10:25:31.221558',1),(2,'semester_info','2025년 오사카 현지학기제','2025년 8월 한 달간 오사카에서 진행된 현지학기제는 일본어학교 수업과 조별 문화체험 활동을 중심으로 운영되었습니다.\n학생들은 다양한 현지 체험을 통해 실용적인 일본어 실력을 쌓을 수 있었습니다.','/uploads/1765708014713-0lueyp.jpg','2025-12-14 10:25:31.781062',1),(3,'semester_info','오사카 어학교 수업 소개 ','大阪外語学院에서 진행된 수업은 두 개의 레벨로 나뉘어 진행되었으며, 요일마다 수업 내용과 담당 선생님이 달라 한자, 일상 회화, 비즈니스 일본어, 시사 일본어 등 폭넓은 분야를 학습할 수 있었습니다.','/uploads/1765708016239-zzz983.jpg','2025-12-14 10:25:32.552221',1),(4,'semester_info','방과후 조별 문화체험','어학교의 수업이 끝난 후는 조별 활동을 통해 현지 문화를 습득하고 현지인과 회화를 연습하는 기회를 늘렸습니다. 오사카뿐만 아니라 나라, 고베, 교토 등 다양한 지역을 방문해 지역 특유의 분위기를 느끼고 현지인과의 교류 기회를 넓힐 수 있었습니다. 오사카 EXPO또한 방문 하였습니다.','/uploads/1765708019259-1ss9w3.jpg','2025-12-14 10:25:32.698844',1),(5,'osaka_review','오사카 현지학기제 후기','오사카 현지학기제 다녀왔어요. 엄청 더웠지만, 힘들지 않을 만큼 뜻깊은 시간이였습니다~',NULL,'2025-12-14 10:29:14.446853',1),(6,'osaka_review','오사카 최고!','일본어 수업 해주신 하시모토 선생님 그리워요ㅠㅠ 즐거운 회화 수업 해주셔서 감사했습니다~',NULL,'2025-12-14 10:29:22.377817',1),(7,'osaka_review','현지학기제 하루 일정','오전에는 일본어학교 가고 오후에는 주로 팀원들과 문화체험 다녔어요. 숙소도 지하철이랑 가깝고 지하철 패스도 주셔서 너무 좋았어요~!',NULL,'2025-12-14 10:29:30.855258',1);
/*!40000 ALTER TABLE `semesters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_fe0bb3f6520ee0469504521e71` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$10$4Syp9gjLotxMAr9AXZKrROUklXqqGgDRwMCXkTmw1qAPNaQFZwdDK','관리자','/uploads/1765707914953-kogeai.jpg','admin','2025-12-14 10:20:09.347398'),(2,'user','$2b$10$SvS2n0c4.aIDitbL5j56v.XFoGuhG/fOQRMHLsZPMbYMMu8WyAC4u','계란',NULL,'user','2025-12-14 10:29:59.929377');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-14 12:17:32
