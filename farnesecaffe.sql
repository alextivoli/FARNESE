-- MySQL dump 10.13  Distrib 8.0.31, for Linux (x86_64)
--
-- Host: localhost    Database: caffefarnese
-- ------------------------------------------------------
-- Server version	8.0.31-0ubuntu0.20.04.1

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
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `idemployee` int NOT NULL AUTO_INCREMENT,
  `cf` char(16) NOT NULL,
  `name` varchar(20) NOT NULL,
  `surname` varchar(20) NOT NULL,
  `mail` varchar(30) NOT NULL,
  `phone` varchar(13) DEFAULT NULL,
  `password` varchar(80) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `address` varchar(40) DEFAULT NULL,
  `hiring` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `forgotpsw` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`idemployee`),
  UNIQUE KEY `cf` (`cf`),
  UNIQUE KEY `mail` (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `formato`
--

DROP TABLE IF EXISTS `formato`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formato` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descr` varchar(50) NOT NULL,
  `nameImg` varchar(30) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `glbtype` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formato`
--

LOCK TABLES `formato` WRITE;
/*!40000 ALTER TABLE `formato` DISABLE KEYS */;
INSERT INTO `formato` VALUES (1,'cialda 38','cialda','CIALDA CARTA FILTRO 38','cialda'),(2,'capsula fap','fap','COMPATIBILI LAVAZZA (FAP)','capsula'),(3,'sacco 1kg','sacco','SACCO 1 KG','sacco'),(4,'cialda 44','cialda','CIALDA CARTA FILTRO 44','cialda'),(5,'capsula nespresso','nespresso','COMPATIBILI NESPRESSO','capsula'),(6,'capsula a modo mio','amodomio','COMPATIBILI A MODO MIO','capsula');
/*!40000 ALTER TABLE `formato` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listino`
--

DROP TABLE IF EXISTS `listino`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listino` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codice` varchar(15) NOT NULL DEFAULT '',
  `disponibile` int NOT NULL DEFAULT '0',
  `prezzoU` float NOT NULL DEFAULT '0',
  `idusoFk` int NOT NULL,
  `idformatoFk` int NOT NULL,
  `idmiscelaFk` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idusoFk` (`idusoFk`),
  KEY `idformatoFk` (`idformatoFk`),
  KEY `idmiscelaFk` (`idmiscelaFk`),
  CONSTRAINT `listino_ibfk_1` FOREIGN KEY (`idusoFk`) REFERENCES `uso` (`id`),
  CONSTRAINT `listino_ibfk_3` FOREIGN KEY (`idformatoFk`) REFERENCES `formato` (`id`),
  CONSTRAINT `listino_ibfk_4` FOREIGN KEY (`idmiscelaFk`) REFERENCES `miscela` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listino`
--

LOCK TABLES `listino` WRITE;
/*!40000 ALTER TABLE `listino` DISABLE KEYS */;
INSERT INTO `listino` VALUES (1,'',0,0,1,5,2),(2,'',0,0,1,5,4),(3,'',0,0,1,5,5),(4,'',0,0,1,5,6),(5,'',0,0,1,1,2),(6,'',0,0,1,1,4),(7,'',0,0,1,1,5),(8,'',0,0,1,6,2),(9,'',0,0,1,2,2),(10,'',0,0,1,2,4),(11,'',0,0,1,2,5),(12,'',0,0,1,2,6),(13,'',0,0,2,3,1),(14,'',0,0,2,3,2),(15,'',0,0,2,3,3),(16,'',0,0,2,3,4),(17,'',0,0,1,4,2),(18,'',0,0,1,4,4),(19,'',0,0,1,4,5);
/*!40000 ALTER TABLE `listino` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `macchina`
--

DROP TABLE IF EXISTS `macchina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `macchina` (
  `id` int NOT NULL AUTO_INCREMENT,
  `modello` varchar(50) NOT NULL,
  `idformatoFk` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_formato` (`idformatoFk`),
  CONSTRAINT `fk_formato` FOREIGN KEY (`idformatoFk`) REFERENCES `formato` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `macchina`
--

LOCK TABLES `macchina` WRITE;
/*!40000 ALTER TABLE `macchina` DISABLE KEYS */;
INSERT INTO `macchina` VALUES (1,'tube cialde',1),(2,'my space capsule',2),(3,'faber slot cialde',1),(4,'my caps capsule',2),(5,'rdl maxi cap capsule',2),(6,'rdl mini cap capsule',2);
/*!40000 ALTER TABLE `macchina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `miscela`
--

DROP TABLE IF EXISTS `miscela`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `miscela` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `descr` varchar(300) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `miscela`
--

LOCK TABLES `miscela` WRITE;
/*!40000 ALTER TABLE `miscela` DISABLE KEYS */;
INSERT INTO `miscela` VALUES (1,'giglio d\'oro 100% arabica','Espresso dolce, bilanciato aromatico con piacevole acidità.<br> Note di cioccolato fondente, retrogusto con finale liquoroso.'),(2,'royal blend','Caffè dolce con note di liquore e frutta matura. Acidità bilanciata, corpo vellutato, retrogusto con sentori di cacao.'),(3,'granduca blend','Espresso deciso, intenso bilanciato nei suoi aromi sciropposi con note di cacao <br> e punta di caramello, retrogusto prolungato con sentori di tostato e biscotto.'),(4,'decaffeinato',''),(5,'orzo',''),(6,'ginseng','');
/*!40000 ALTER TABLE `miscela` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipomacchina`
--

DROP TABLE IF EXISTS `tipomacchina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipomacchina` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idmacchinaFk` int NOT NULL,
  `idformatoFk` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idmacchinaFk` (`idmacchinaFk`),
  KEY `idformatoFk` (`idformatoFk`),
  CONSTRAINT `tipomacchina_ibfk_1` FOREIGN KEY (`idmacchinaFk`) REFERENCES `macchina` (`id`),
  CONSTRAINT `tipomacchina_ibfk_2` FOREIGN KEY (`idformatoFk`) REFERENCES `formato` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipomacchina`
--

LOCK TABLES `tipomacchina` WRITE;
/*!40000 ALTER TABLE `tipomacchina` DISABLE KEYS */;
INSERT INTO `tipomacchina` VALUES (1,3,4),(2,1,1),(3,2,2),(4,4,2),(5,5,2),(6,6,2),(7,3,1),(8,1,4);
/*!40000 ALTER TABLE `tipomacchina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uso`
--

DROP TABLE IF EXISTS `uso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descr` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uso`
--

LOCK TABLES `uso` WRITE;
/*!40000 ALTER TABLE `uso` DISABLE KEYS */;
INSERT INTO `uso` VALUES (1,'casa/ufficio'),(2,'bar');
/*!40000 ALTER TABLE `uso` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-01 15:55:58
