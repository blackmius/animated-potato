-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: apteka
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adresa`
--
CREATE DATABASE IF NOT EXISTS apteka;
USE apteka;

DROP TABLE IF EXISTS `adresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adresa` (
  `kladr` char(20) NOT NULL,
  `region` varchar(256) NOT NULL,
  `gorod` varchar(256) NOT NULL,
  `raion` varchar(256) NOT NULL,
  `ulitsa` varchar(256) NOT NULL,
  `dom` varchar(256) NOT NULL,
  `stroenie` varchar(256) NOT NULL,
  `korpus` varchar(256) NOT NULL,
  `ofis` varchar(256) NOT NULL,
  PRIMARY KEY (`kladr`),
  CONSTRAINT `postavschik_adres` FOREIGN KEY (`kladr`) REFERENCES `postavschik` (`kladr`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='Содержит полный адрес поставщика';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adresa`
--

LOCK TABLES `adresa` WRITE;
/*!40000 ALTER TABLE `adresa` DISABLE KEYS */;
INSERT INTO `adresa` VALUES ('3200000000000','nizhegorodsk','belaya_berezka','patrioticheskiy','lenina','9','1','2','12'),('3600000000000','voronezhskaya_obl','voronezh','vtoroy','minina','1','1','1','17'),('5200000000000','bryanskaya_obl','bryansk','perviy','chkalova','2','1','2','3'),('6300000000000','samarskaya_obl','samara','pushkinskiy','chapaeva','2','1','1','50'),('7700000000000','moskva','moskva','basmaniy','radio','1','2','3','15');
/*!40000 ALTER TABLE `adresa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `check`
--

DROP TABLE IF EXISTS `check`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `check` (
  `kod_checka` int NOT NULL AUTO_INCREMENT,
  `kod_sotrudnika` int NOT NULL,
  `data_prodazhi` datetime NOT NULL,
  `summa_checka` decimal(15,2) NOT NULL,
  PRIMARY KEY (`kod_checka`),
  KEY `sotrudnik_idx` (`kod_sotrudnika`),
  CONSTRAINT `sotrudnik` FOREIGN KEY (`kod_sotrudnika`) REFERENCES `sotrudnik` (`kod_sotrudnika`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COMMENT='Содержит информацию из кассовых чеков';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `check`
--

LOCK TABLES `check` WRITE;
/*!40000 ALTER TABLE `check` DISABLE KEYS */;
INSERT INTO `check` VALUES (1,1,'2021-11-06 09:00:00',479.00),(2,1,'2021-11-06 09:15:00',350.00),(3,1,'2021-11-06 11:10:00',500.00),(4,1,'2021-11-06 12:45:00',100.00),(5,1,'2021-11-06 15:00:00',237.00);
/*!40000 ALTER TABLE `check` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dolzhnost`
--

DROP TABLE IF EXISTS `dolzhnost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dolzhnost` (
  `kod_dolzhnosti` int NOT NULL AUTO_INCREMENT,
  `naimenovanie` varchar(256) NOT NULL,
  PRIMARY KEY (`kod_dolzhnosti`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COMMENT='Содержит информацию о должности';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dolzhnost`
--

LOCK TABLES `dolzhnost` WRITE;
/*!40000 ALTER TABLE `dolzhnost` DISABLE KEYS */;
INSERT INTO `dolzhnost` VALUES (1,'Провизор'),(2,'Менеджер'),(3,'Управляющий');
/*!40000 ALTER TABLE `dolzhnost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `konakti_postavschika`
--

DROP TABLE IF EXISTS `konakti_postavschika`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `konakti_postavschika` (
  `kod_kontakta_postavschika` int NOT NULL AUTO_INCREMENT,
  `kod_postavschika` int NOT NULL,
  `kod_tipa_kontakta` int NOT NULL,
  `znachenie` varchar(256) NOT NULL,
  PRIMARY KEY (`kod_kontakta_postavschika`),
  KEY `postavschik2_idx` (`kod_postavschika`),
  KEY `tip_kontakta_idx` (`kod_tipa_kontakta`),
  CONSTRAINT `postavschik2` FOREIGN KEY (`kod_postavschika`) REFERENCES `postavschik` (`kod_postavschika`) ON DELETE CASCADE,
  CONSTRAINT `tip_kontakta` FOREIGN KEY (`kod_tipa_kontakta`) REFERENCES `tip_kontakta` (`kod_tipa_kontakta`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COMMENT='Контакты поставщика';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `konakti_postavschika`
--

LOCK TABLES `konakti_postavschika` WRITE;
/*!40000 ALTER TABLE `konakti_postavschika` DISABLE KEYS */;
INSERT INTO `konakti_postavschika` VALUES (1,1,1,'buisness@farma.one'),(2,1,2,'88005553535'),(3,2,1,'zakupki@post.opt'),(4,2,2,'79182011931'),(5,3,1,'farmaopt@mail.ru'),(6,3,2,'79802005428'),(7,4,1,'lekar@gmail.com'),(8,4,2,'79801236547'),(9,5,1,'lazar@yandex.ru'),(10,5,2,'798567548712');
/*!40000 ALTER TABLE `konakti_postavschika` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nakladnaya`
--

DROP TABLE IF EXISTS `nakladnaya`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nakladnaya` (
  `kod_preparata` int NOT NULL,
  `kod_postavki` int NOT NULL,
  `data_proizvodstva` date NOT NULL,
  `srok_godnosti` date NOT NULL,
  `cena_zakupki` decimal(15,2) NOT NULL,
  `kolichestvo` int NOT NULL,
  `summa` decimal(15,2) NOT NULL,
  PRIMARY KEY (`kod_preparata`,`kod_postavki`),
  KEY `postavka_idx` (`kod_postavki`),
  CONSTRAINT `postavki` FOREIGN KEY (`kod_postavki`) REFERENCES `postavka` (`kod_postavki`) ON DELETE CASCADE,
  CONSTRAINT `preparatik` FOREIGN KEY (`kod_preparata`) REFERENCES `preparat` (`kod_preparata`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='Содержит информацию из накладных';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nakladnaya`
--

LOCK TABLES `nakladnaya` WRITE;
/*!40000 ALTER TABLE `nakladnaya` DISABLE KEYS */;
INSERT INTO `nakladnaya` VALUES (1,1,'2021-10-01','2023-10-01',300.00,500,239500.00),(1,6,'2021-10-01','2023-10-01',300.00,300,90000.00),(2,2,'2021-10-10','2022-10-10',250.00,500,125000.00),(2,7,'2021-10-10','2022-10-10',250.00,300,75000.00),(3,3,'2021-09-28','2023-09-28',350.00,500,175000.00),(3,8,'2021-09-28','2023-09-28',350.00,300,105000.00),(4,4,'2021-10-02','2023-10-02',35.00,500,17500.00),(4,9,'2021-10-02','2023-10-02',35.00,300,10500.00),(5,5,'2021-10-15','2023-10-15',137.00,500,68500.00),(5,10,'2021-10-15','2023-10-15',137.00,300,41100.00);
/*!40000 ALTER TABLE `nakladnaya` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postavka`
--

DROP TABLE IF EXISTS `postavka`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `postavka` (
  `kod_postavki` int NOT NULL AUTO_INCREMENT,
  `data_postavki` datetime NOT NULL,
  `kod_postavschika` int NOT NULL,
  `summa` decimal(15,2) NOT NULL,
  PRIMARY KEY (`kod_postavki`),
  KEY `postavschik_idx` (`kod_postavschika`),
  CONSTRAINT `postavschik` FOREIGN KEY (`kod_postavschika`) REFERENCES `postavschik` (`kod_postavschika`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postavka`
--

LOCK TABLES `postavka` WRITE;
/*!40000 ALTER TABLE `postavka` DISABLE KEYS */;
INSERT INTO `postavka` VALUES (1,'2021-11-01 10:00:00',1,239500.00),(2,'2021-11-02 11:00:00',2,125000.00),(3,'2021-10-30 09:00:00',3,175000.00),(4,'2021-11-03 10:29:00',4,17500.00),(5,'2021-11-04 15:38:00',5,68500.00),(6,'2021-11-05 09:00:00',1,90000.00),(7,'2021-11-05 11:00:00',2,75000.00),(8,'2021-11-05 12:00:00',3,105000.00),(9,'2021-11-05 13:00:00',4,10500.00),(10,'2021-11-05 14:00:00',5,41100.00);
/*!40000 ALTER TABLE `postavka` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postavschik`
--

DROP TABLE IF EXISTS `postavschik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `postavschik` (
  `kod_postavschika` int NOT NULL AUTO_INCREMENT,
  `naimenovanie` varchar(256) NOT NULL,
  `inn` char(11) NOT NULL,
  `kladr` char(20) DEFAULT NULL,
  PRIMARY KEY (`kod_postavschika`),
  KEY `adres_idx` (`kladr`),
  CONSTRAINT `adres` FOREIGN KEY (`kladr`) REFERENCES `adresa` (`kladr`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COMMENT='Содержит информацию о поставщиках';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postavschik`
--

LOCK TABLES `postavschik` WRITE;
/*!40000 ALTER TABLE `postavschik` DISABLE KEYS */;
INSERT INTO `postavschik` VALUES (1,'Фарма-1','5905066328','7700000000000'),(2,'Пост апт','5826107349','6300000000000'),(3,'Фарма опт','5031108236','3200000000000'),(4,'Лекарь','7731472210','5200000000000'),(5,'Лазарь','9721031770','3600000000000');
/*!40000 ALTER TABLE `postavschik` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preparat`
--

DROP TABLE IF EXISTS `preparat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preparat` (
  `kod_preparata` int NOT NULL AUTO_INCREMENT,
  `nazvanie` varchar(256) NOT NULL,
  `otpuskaetsa_po_receptu` tinyint NOT NULL,
  `cena_v_prodazhe` decimal(15,2) NOT NULL,
  PRIMARY KEY (`kod_preparata`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COMMENT='Содержит основную информацию о препарате';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preparat`
--

LOCK TABLES `preparat` WRITE;
/*!40000 ALTER TABLE `preparat` DISABLE KEYS */;
INSERT INTO `preparat` VALUES (1,'Новопасит',0,479.00),(2,'Триганде',0,350.00),(3,'Галоперидол',1,500.00),(4,'Мезим',0,100.00),(5,'Ношпа',0,237.00);
/*!40000 ALTER TABLE `preparat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prodazha`
--

DROP TABLE IF EXISTS `prodazha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prodazha` (
  `kod_checka` int NOT NULL,
  `kod_preparata` int NOT NULL,
  `kolichestvo_upakovok` int NOT NULL,
  `summa` decimal(15,2) NOT NULL,
  PRIMARY KEY (`kod_checka`,`kod_preparata`),
  KEY `preparat_idx` (`kod_preparata`),
  CONSTRAINT `check` FOREIGN KEY (`kod_checka`) REFERENCES `check` (`kod_checka`) ON DELETE CASCADE,
  CONSTRAINT `preparat` FOREIGN KEY (`kod_preparata`) REFERENCES `preparat` (`kod_preparata`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='Таблица для хранения информации о продажах';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prodazha`
--

LOCK TABLES `prodazha` WRITE;
/*!40000 ALTER TABLE `prodazha` DISABLE KEYS */;
INSERT INTO `prodazha` VALUES (1,1,1,479.00),(2,2,1,350.00),(3,3,1,500.00),(4,4,1,100.00),(5,5,1,237.00);
/*!40000 ALTER TABLE `prodazha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sotrudnik`
--

DROP TABLE IF EXISTS `sotrudnik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sotrudnik` (
  `kod_sotrudnika` int NOT NULL AUTO_INCREMENT,
  `familya` varchar(256) NOT NULL,
  `imya` varchar(256) NOT NULL,
  `otchestvo` varchar(256) NOT NULL,
  `telefon` char(11) NOT NULL,
  `seriya_pasporta` char(4) NOT NULL,
  `nomer_pasporta` char(6) NOT NULL,
  `data_rozhdeniya` date NOT NULL,
  `pol` tinyint NOT NULL,
  `kod_dolzhnosti` int NOT NULL,
  `zarplata` decimal(15,2) NOT NULL,
  `data_naima` date NOT NULL,
  `data_uvolneniya` date DEFAULT NULL,
  `kod_avtorizacii` varchar(32) NOT NULL,
  PRIMARY KEY (`kod_sotrudnika`),
  KEY `dolzhnost_idx` (`kod_dolzhnosti`),
  CONSTRAINT `dolzhnost` FOREIGN KEY (`kod_dolzhnosti`) REFERENCES `dolzhnost` (`kod_dolzhnosti`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COMMENT='Содержит информацию о сотрудниках';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sotrudnik`
--

LOCK TABLES `sotrudnik` WRITE;
/*!40000 ALTER TABLE `sotrudnik` DISABLE KEYS */;
INSERT INTO `sotrudnik` VALUES (1,'Иванов','Иван','Иванович','8999000000','4515','163759','1995-05-01',1,1,35000.00,'2021-08-01',NULL,'Lku52NoKG53Gex+ByF2E0rhUh/bc9+XHPm1ulRBat1s='),(2,'Сидоров','Петр','Иванович','8903111333','4516','999888','1986-09-28',1,1,35000.00,'2021-08-02',NULL,'s5RCPiQSAEtewj+EIv0F3TP6gJo6uHmsoAkh18NdtBc='),(3,'Павлова','Полина','Петровна','8906709643','4513','333444','1999-06-12',0,2,40000.00,'2021-08-05',NULL,'OcjateMI7om8yzwsi5m+YFNX/HJZNJq6j51/psLyRD0='),(4,'Комаров','Илья','Денисович','89645432343','1213','098675','1993-12-31',1,2,45000.00,'2021-08-10',NULL,'VMk9F97qbwlNHUQ2TJX+gPdvM2onFudHUud6Oh79dyQ='),(5,'Галкина','Алла','Борисовна','89996438911','9876','123321','1987-09-07',0,3,60000.00,'2021-08-21',NULL,'EijNOj//JCJHaBAuGtmzE7rd88DWN8iyn0+qKDG9KE4=');
/*!40000 ALTER TABLE `sotrudnik` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tip_kontakta`
--

DROP TABLE IF EXISTS `tip_kontakta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tip_kontakta` (
  `kod_tipa_kontakta` int NOT NULL AUTO_INCREMENT,
  `naimenovanie` varchar(256) NOT NULL,
  PRIMARY KEY (`kod_tipa_kontakta`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tip_kontakta`
--

LOCK TABLES `tip_kontakta` WRITE;
/*!40000 ALTER TABLE `tip_kontakta` DISABLE KEYS */;
INSERT INTO `tip_kontakta` VALUES (1,'Элетронная почта'),(2,'Телефон');
/*!40000 ALTER TABLE `tip_kontakta` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-01 14:31:14
