-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 29, 2025 at 05:39 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shopdg_godshop-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_us`
--

DROP TABLE IF EXISTS `about_us`;
CREATE TABLE IF NOT EXISTS `about_us` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `work_experience` int NOT NULL DEFAULT '0',
  `completed_projects` int NOT NULL DEFAULT '0',
  `happy_clients` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `about_us`
--

INSERT INTO `about_us` (`id`, `description`, `work_experience`, `completed_projects`, `happy_clients`) VALUES
(1, 'ما در تیم شاپ دیجی دو بیش از ۵ سال است که با عشق به فناوری و تعهد به کیفیت، در کنار کسب‌وکارها ایستاده‌ایم. اعتماد شما، سرمایه‌ی ارزشمند ماست و این اعتماد را با تخصص، صداقت و پشتیبانی بی‌وقفه جبران می‌کنیم.\r\n\r\nچرا ما؟\r\n✅ تیمی باتجربه و متخصص – با ده‌ها پروژه موفق در حوزه‌های طراحی سایت، سئو، دیجیتال مارکتینگ و امنیت.\r\n✅ راهکارهای سفارشی – هر کسب‌وکار منحصر به فرد است؛ ما برای شما استراتژی شخصی‌سازی‌شده طراحی می‌کنیم.\r\n✅ پشتیبانی واقعی – بعد از تحویل پروژه، تنها نیستید! تیم پشتیبانی ما همیشه در دسترس شماست.\r\n✅ شفافیت و گزارش‌دهی – از ابتدا تا پایان پروژه، شما قدم به قدم در جریان روند کار قرار می‌گیرید.', 10, 500, 200);

-- --------------------------------------------------------

--
-- Table structure for table `admin-users`
--

DROP TABLE IF EXISTS `admin-users`;
CREATE TABLE IF NOT EXISTS `admin-users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin-users`
--

INSERT INTO `admin-users` (`id`, `username`, `password`, `created_at`) VALUES
(3, 'sharhanship', '$2y$10$SS60IS3WR9nRKdm5ZytajuueWSZksgvimvh4s2.9jMTAZDoQog6kG', '2025-06-18 08:10:57');

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
CREATE TABLE IF NOT EXISTS `articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('programming','technology','design','ai','business') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `key_point` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `views` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `created_at`) VALUES
(11, 'علی شرحان', 'abmtim1@gmail.com', '09920352936', '/skdjhflosg;oushd;ofouhsdl', 'من خدام', '2025-06-29 05:08:21');

-- --------------------------------------------------------

--
-- Table structure for table `portfolio`
--

DROP TABLE IF EXISTS `portfolio`;
CREATE TABLE IF NOT EXISTS `portfolio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL,
  `images` text,
  `video` varchar(255) DEFAULT NULL,
  `technologies` text,
  `client` varchar(255) DEFAULT NULL,
  `delivery_time` varchar(100) DEFAULT NULL,
  `project_link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `portfolio`
--

INSERT INTO `portfolio` (`id`, `name`, `category`, `images`, `video`, `technologies`, `client`, `delivery_time`, `project_link`, `created_at`) VALUES
(23, 'تکنو بای', 'fullstack', '[\"img_6860c9db6f5ef_029c9bb9.png\",\"img_6860c9db6fbc0_970908fd.png\",\"img_6860c9db6ff03_d86d6909.png\",\"img_6860c9db719dc_2f330d37.png\",\"img_6860c9db72c48_69e51a96.png\"]', 'video_6860c9db74657_90508fc6.mp4', 'کمشستیدزختدذیکخمتذیرخگتدیخمتیسیبسیب', 'شسیشسی', 'ثصص4فثقلثل', 'https://chat.deepseek.com/a/chat/s/bda82a1e-fdc9-4c6d-b5a7-23afc0d312c8', '2025-06-29 05:06:35');

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

DROP TABLE IF EXISTS `team_members`;
CREATE TABLE IF NOT EXISTS `team_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resume_file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `about` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `projects` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `role` enum('frontend','backend','designer','editor','manager') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `social_links` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `team_members`
--

INSERT INTO `team_members` (`id`, `first_name`, `last_name`, `avatar`, `resume_file`, `phone`, `email`, `about`, `projects`, `role`, `social_links`, `created_at`) VALUES
(22, 'علی', 'شرحان', 'avatar_6860ca137dd8c_263fa21c.jpg', '6860ca137e1a7_AlisharhanResume.pdf', '09920352936', 'abmtime1@gmail.com', 'من خدام', '2000000000000 پروژه بهتر از ستیز', 'backend', NULL, '2025-06-29 05:07:31');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
