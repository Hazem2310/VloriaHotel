-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 11, 2026 at 01:06 AM
-- Server version: 8.0.44
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `veloria_grand_hotel`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `booking_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('PENDING','CONFIRMED','CANCELLED') COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking_meals`
--

CREATE TABLE `booking_meals` (
  `id` int NOT NULL,
  `booking_id` int NOT NULL,
  `meal_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employee_id` int NOT NULL,
  `user_id` int NOT NULL,
  `employee_level` enum('MANAGER','REGULAR') COLLATE utf8mb4_general_ci NOT NULL,
  `department` enum('HOTEL','RESTAURANT','RECEPTION','GYM','POOL','HOUSEKEEPING') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `job_title` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `hire_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`employee_id`, `user_id`, `employee_level`, `department`, `job_title`, `salary`, `hire_date`) VALUES
(2, 2, 'MANAGER', 'RECEPTION', 'Reception Manager', 8500.00, '2026-05-08'),
(4, 3, 'REGULAR', 'RECEPTION', 'Reception Staff', 400.00, '2026-05-08');

-- --------------------------------------------------------

--
-- Table structure for table `employee_attendance`
--

CREATE TABLE `employee_attendance` (
  `attendance_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `work_date` date NOT NULL,
  `clock_in` datetime DEFAULT NULL,
  `clock_out` datetime DEFAULT NULL,
  `total_hours` decimal(6,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `employee_attendance`
--

INSERT INTO `employee_attendance` (`attendance_id`, `employee_id`, `work_date`, `clock_in`, `clock_out`, `total_hours`, `created_at`) VALUES
(1, 2, '2026-05-11', '2026-05-11 03:57:08', '2026-05-11 03:57:14', 0.00, '2026-05-11 00:57:08');

-- --------------------------------------------------------

--
-- Table structure for table `employee_messages`
--

CREATE TABLE `employee_messages` (
  `message_id` int NOT NULL,
  `sender_id` int DEFAULT NULL,
  `receiver_id` int DEFAULT NULL,
  `type` enum('VACATION','SHIFT_CHANGE','GENERAL') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_general_ci,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_general_ci DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_salaries`
--

CREATE TABLE `employee_salaries` (
  `salary_id` int NOT NULL,
  `employee_id` int DEFAULT NULL,
  `base_salary` decimal(10,2) DEFAULT NULL,
  `bonus` decimal(10,2) DEFAULT '0.00',
  `month` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_schedules`
--

CREATE TABLE `employee_schedules` (
  `schedule_id` int NOT NULL,
  `employee_id` int DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `work_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_schedules`
--

INSERT INTO `employee_schedules` (`schedule_id`, `employee_id`, `start_time`, `end_time`, `work_date`) VALUES
(1, 2, '10:00:00', '07:00:00', '2026-06-12');

-- --------------------------------------------------------

--
-- Table structure for table `employee_tasks`
--

CREATE TABLE `employee_tasks` (
  `task_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `status` enum('PENDING','DONE') COLLATE utf8mb4_general_ci DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_tasks`
--

INSERT INTO `employee_tasks` (`task_id`, `employee_id`, `title`, `description`, `status`, `created_at`) VALUES
(3, 2, 'Clean Room 205', 'Make sure room is fully cleaned', 'PENDING', '2026-05-08 15:02:29'),
(4, 2, 'Check-in Guest', 'Assist guest at reception desk', 'PENDING', '2026-05-08 15:02:29');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `expense_id` int NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `expense_date` date DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  `department` enum('HOTEL','RESTAURANT','RECEPTION','GYM','POOL','HOUSEKEEPING') COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `halls`
--

CREATE TABLE `halls` (
  `hall_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `hall_type` enum('Indoor','Outdoor') COLLATE utf8mb4_general_ci NOT NULL,
  `capacity` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `status` enum('AVAILABLE','BOOKED') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image_gallery` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `halls`
--

INSERT INTO `halls` (`hall_id`, `name`, `description`, `hall_type`, `capacity`, `price`, `status`, `image_url`, `image_gallery`) VALUES
(1, 'Indoor Grand Hall', 'Our Indoor Grand Hall offers a luxurious setting with elegant chandeliers, marble floors, and sophisticated lighting. This premium venue is ideal for weddings, large celebrations, and corporate events. The hall features state-of-the-art audio-visual equipment, climate control, and customizable lighting to create the perfect ambiance for your special occasion.', 'Indoor', 500, 2500.00, 'AVAILABLE', 'http://localhost:5000/uploads/halls/halls1.jpeg', '[\"http://localhost:5000/uploads/halls1.jpeg\",\"https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?w=800&q=80\",\"https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80\",\"https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80\"]'),
(2, 'Poolside Outdoor Venue', 'For those seeking a more scenic and open-air experience, our Poolside Outdoor Venue provides a stunning backdrop for memorable occasions. Surrounded by lush gardens and featuring a beautiful pool view, this venue is perfect for outdoor weddings, cocktail receptions, and sunset celebrations. The space includes covered areas for dining and a spacious open area for ceremonies.', 'Outdoor', 350, 2000.00, 'AVAILABLE', 'http://localhost:5000/uploads/halls/halls2.jpeg', '[\"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80\",\"https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80\",\"https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?w=800&q=80\",\"https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80\"]'),
(3, 'Executive Meeting Room', 'Our Executive Meeting Room is designed for business professionals, offering a modern and elegant space equipped with advanced technology, comfortable seating, and a quiet atmosphere ideal for meetings, presentations, and corporate events.', 'Indoor', 50, 800.00, 'AVAILABLE', 'http://localhost:5000/uploads/halls/meeting1.jpeg', '[\"http://localhost:5000/uploads/halls/meeting1.jpeg\", \"http://localhost:5000/uploads/halls/meeting2.jpeg\", \"http://localhost:5000/uploads/halls/meeting3.jpeg\"]');

-- --------------------------------------------------------

--
-- Table structure for table `hall_bookings`
--

CREATE TABLE `hall_bookings` (
  `booking_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `hall_id` int DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `guests` int DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` enum('PENDING','CONFIRMED','CANCELLED') COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `invoice_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `vat_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leave_requests`
--

CREATE TABLE `leave_requests` (
  `request_id` int NOT NULL,
  `employee_id` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meals`
--

CREATE TABLE `meals` (
  `meal_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `meal_type` enum('Breakfast','Lunch','Dinner') COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meals`
--

INSERT INTO `meals` (`meal_id`, `name`, `description`, `meal_type`, `price`, `is_available`, `created_at`, `updated_at`) VALUES
(9, 'Grilled Chicken', 'Succulent grilled chicken with herbs', 'Lunch', 15.50, 1, '2026-02-19 18:16:28', '2026-02-19 18:16:28'),
(10, 'Caesar Salad', 'Fresh romaine lettuce with Caesar dressing', 'Lunch', 9.99, 1, '2026-02-19 18:16:28', '2026-02-19 18:16:28'),
(11, 'Pancakes with Syrup', 'Fluffy pancakes served with maple syrup', 'Breakfast', 7.50, 1, '2026-02-19 18:16:28', '2026-02-19 18:16:28'),
(12, 'Spaghetti Bolognese', 'Classic Italian pasta with meat sauce', 'Dinner', 14.99, 1, '2026-02-19 18:16:28', '2026-02-19 18:16:28'),
(13, 'Continental Breakfast', 'Continental breakfast with pastries and juice', 'Breakfast', 12.00, 1, '2026-02-19 18:16:28', '2026-02-19 18:16:28'),
(14, 'Club Sandwich', 'Club sandwich with fries', 'Lunch', 10.50, 1, '2026-02-19 18:16:28', '2026-02-19 18:16:28'),
(15, 'Grilled Salmon', 'Grilled salmon with vegetables', 'Dinner', 18.00, 1, '2026-02-19 18:16:28', '2026-02-19 18:16:28'),
(16, 'Late Night Snack', 'Cheese platter and fruits', 'Dinner', 8.50, 1, '2026-02-19 18:16:28', '2026-02-19 18:16:28');

-- --------------------------------------------------------

--
-- Table structure for table `meal_packages`
--

CREATE TABLE `meal_packages` (
  `package_id` int NOT NULL,
  `package_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `package_type` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `price_per_day` decimal(10,2) NOT NULL,
  `includes_breakfast` tinyint(1) DEFAULT '0',
  `includes_lunch` tinyint(1) DEFAULT '0',
  `includes_dinner` tinyint(1) DEFAULT '0',
  `is_available` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meal_packages`
--

INSERT INTO `meal_packages` (`package_id`, `package_name`, `package_type`, `description`, `price_per_day`, `includes_breakfast`, `includes_lunch`, `includes_dinner`, `is_available`, `created_at`, `updated_at`) VALUES
(8, 'Breakfast Only', 'breakfast', 'Start your day with a delicious breakfast', 15.00, 1, 0, 0, 1, '2026-02-19 18:23:30', '2026-02-19 18:23:30'),
(9, 'Lunch Only', 'lunch', 'Enjoy a satisfying lunch', 20.00, 0, 1, 0, 1, '2026-02-19 18:23:30', '2026-02-19 18:23:30'),
(10, 'Dinner Only', 'dinner', 'Savor an elegant dinner', 25.00, 0, 0, 1, 1, '2026-02-19 18:23:30', '2026-02-19 18:23:30'),
(11, 'Breakfast & Lunch', 'breakfast_lunch', 'Breakfast and lunch included', 32.00, 1, 1, 0, 1, '2026-02-19 18:23:30', '2026-02-19 18:23:30'),
(12, 'Breakfast & Dinner', 'breakfast_dinner', 'Breakfast and dinner included', 37.00, 1, 0, 1, 1, '2026-02-19 18:23:30', '2026-02-19 18:23:30'),
(13, 'Lunch & Dinner', 'lunch_dinner', 'Lunch and dinner included', 42.00, 0, 1, 1, 1, '2026-02-19 18:23:30', '2026-02-19 18:23:30'),
(14, 'All Meals (Full Board)', 'full_board', 'All three meals included - best value!', 50.00, 1, 1, 1, 1, '2026-02-19 18:23:30', '2026-02-19 18:23:30');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int NOT NULL,
  `invoice_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `method` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payroll`
--

CREATE TABLE `payroll` (
  `payroll_id` int NOT NULL,
  `employee_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `pay_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `restaurant`
--

CREATE TABLE `restaurant` (
  `restaurant_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `location` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `opening_hours` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `restaurant`
--

INSERT INTO `restaurant` (`restaurant_id`, `name`, `location`, `opening_hours`) VALUES
(1, 'Veloria Main Restaurant', 'Floor 1', '07:00-22:00'),
(2, 'Veloria Breakfast Corner', 'Floor 2', '06:00-12:00');

-- --------------------------------------------------------

--
-- Table structure for table `restaurant_orders`
--

CREATE TABLE `restaurant_orders` (
  `order_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `meal_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `target_type` enum('ROOM','HALL','RESTAURANT','MEAL','HOTEL') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `target_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `comment` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ;

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `room_id` int NOT NULL,
  `room_number` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `room_type` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `capacity` int DEFAULT '2',
  `price` decimal(10,2) DEFAULT NULL,
  `status` enum('AVAILABLE','BOOKED','MAINTENANCE') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `wifi` tinyint(1) DEFAULT '1',
  `room_service` tinyint(1) DEFAULT '1',
  `air_conditioning` tinyint(1) DEFAULT '1',
  `tv` tinyint(1) DEFAULT '1',
  `mini_bar` tinyint(1) DEFAULT '0',
  `coffee_machine` tinyint(1) DEFAULT '0',
  `balcony` tinyint(1) DEFAULT '0',
  `sea_view` tinyint(1) DEFAULT '0',
  `pool_view` tinyint(1) DEFAULT '0',
  `breakfast_included` tinyint(1) DEFAULT '0',
  `parking` tinyint(1) DEFAULT '1',
  `safe_box` tinyint(1) DEFAULT '1',
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`room_id`, `room_number`, `room_type`, `capacity`, `price`, `status`, `wifi`, `room_service`, `air_conditioning`, `tv`, `mini_bar`, `coffee_machine`, `balcony`, `sea_view`, `pool_view`, `breakfast_included`, `parking`, `safe_box`, `images`) VALUES
(1, '101', 'Pool View Room - Double', 2, 150.00, 'AVAILABLE', 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, '[\"/uploads/rooms/Pool View Room - Double1.jpeg\", \"/uploads/rooms/Pool View Room - Double2.jpeg\", \"/uploads/rooms/Pool View Room - Double3.jpeg\"]'),
(2, '102', 'Garden View Room - Double', 2, 130.00, 'AVAILABLE', 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, '[\"/uploads/rooms/Garden View Room - Double1.jpeg\", \"/uploads/rooms/Garden View Room - Double2.jpeg\", \"/uploads/rooms/Garden View Room - Double3.jpeg\"]'),
(3, '103', 'Room with Balcony - Double', 2, 180.00, 'AVAILABLE', 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, '[\"/uploads/rooms/Room with Balcony - Double1.jpeg\", \"/uploads/rooms/Room with Balcony - Double2.jpeg\", \"/uploads/rooms/Room with Balcony - Double3.jpeg\", \"/uploads/rooms/Room with Balcony - Double4.jpeg\"]'),
(4, '104', 'Standard Room (No Balcony) - Double', 2, 100.00, 'AVAILABLE', 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, '[\"/uploads/rooms/Standard Room1.jpeg\", \"/uploads/rooms/Standard Room2.jpeg\", \"/uploads/rooms/Standard Room3.jpeg \", \"/uploads/rooms/Standard Room4.jpeg\",\"/uploads/rooms/Standard Room5.jpeg \"]'),
(5, '105', 'Triple Room', 3, 200.00, 'AVAILABLE', 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, '[\"/uploads/rooms/Triple Room1.jpeg\", \"/uploads/rooms/Triple Room2.jpeg\", \"/uploads/rooms/Triple Room3.jpeg\", \"/uploads/rooms/Triple Room4.jpeg\", \"/uploads/rooms/Triple Room5.jpeg\"]'),
(6, '201', 'Junior Suite', 4, 280.00, 'AVAILABLE', 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, '[\"/uploads/rooms/Junior Suite1.jpeg\", \"/uploads/rooms/Junior Suite2.jpeg\", \"/uploads/rooms/Junior Suite3.jpeg\", \"/uploads/rooms/Junior Suite4.jpeg\", \"/uploads/rooms/Junior Suite5.jpeg\",  \"/uploads/rooms/Junior Suite6.jpeg\", \"/uploads/rooms/Junior Suite7.jpeg\"]'),
(7, '301', 'Executive Suite', 4, 450.00, 'AVAILABLE', 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, '[\"/uploads/rooms/Executive Suite1.jpeg\", \"/uploads/rooms/Executive Suite2.jpeg\", \"/uploads/rooms/Executive Suite3.jpeg\", \"/uploads/rooms/Executive Suite4.jpeg\", \"/uploads/rooms/Executive Suite5.jpeg\",  \"/uploads/rooms/Executive Suite6.jpeg\", \"/uploads/rooms/Executive Suite7.jpeg\"]');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int NOT NULL,
  `type` enum('ROOM','HALL','RESTAURANT','EXPENSE','SALARY') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `related_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `failed_attempts` int DEFAULT '0',
  `reset_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','BLOCKED') COLLATE utf8mb4_general_ci DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role` enum('OWNER','CUSTOMER','EMPLOYEE') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'CUSTOMER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `phone_number`, `failed_attempts`, `reset_token`, `reset_token_expiry`, `status`, `created_at`, `role`) VALUES
(2, 'danya', 'swaed', 'daniaswaed4@gmail.com', '$2b$10$XMvFQnMgE5jRl69auz.ow.gK8cMQFLzSX6Qvh6YiRyWf7hc3rCOoO', '0505179503', 0, NULL, NULL, 'ACTIVE', '2026-05-08 14:25:51', 'EMPLOYEE'),
(3, 'yara', 'swaed', 'yarswa.1234@gmail.com', '$2b$10$v2ABjpmPF3DPihbLay3rbO2OMrWN0j9/3abvct295G2hM721y18wa', '0525052195', 0, NULL, NULL, 'ACTIVE', '2026-05-08 18:44:10', 'EMPLOYEE'),
(5, 'Jana', 'Shaban', 'JanaSh123@gmail.com', '$2b$10$tRyJoUZpCXkgaOgFdAfiM.Rw.eaEctCLTTIlVDukWHeXqz0pt80UK', '0505179506', 0, NULL, NULL, 'ACTIVE', '2026-05-09 10:17:22', 'EMPLOYEE'),
(6, 'Hazem', 'Habarat', 'Hazem123@gmail.com', '$2b$10$0pA9h6JZpVypmUe99WRV6.H9SMLZwioCzmfutj0kCmBaZKJdvUqda', '0505179508', 0, NULL, NULL, 'ACTIVE', '2026-05-09 10:18:09', 'EMPLOYEE'),
(7, 'Haz', 'hb', 'Hazemhb@gmail.com', '$2b$10$3giijxNGwPf4sqCS2VMMrepLv.ViPdmq16dRStYJHIGzfv/9d.WSW', '0546876987', 0, NULL, NULL, 'ACTIVE', '2026-05-10 21:17:20', 'OWNER');

-- --------------------------------------------------------

--
-- Table structure for table `vat`
--

CREATE TABLE `vat` (
  `vat_id` int NOT NULL,
  `percentage` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `booking_meals`
--
ALTER TABLE `booking_meals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `meal_id` (`meal_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `employee_attendance`
--
ALTER TABLE `employee_attendance`
  ADD PRIMARY KEY (`attendance_id`);

--
-- Indexes for table `employee_messages`
--
ALTER TABLE `employee_messages`
  ADD PRIMARY KEY (`message_id`);

--
-- Indexes for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  ADD PRIMARY KEY (`salary_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `employee_schedules`
--
ALTER TABLE `employee_schedules`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `employee_tasks`
--
ALTER TABLE `employee_tasks`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`expense_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `halls`
--
ALTER TABLE `halls`
  ADD PRIMARY KEY (`hall_id`);

--
-- Indexes for table `hall_bookings`
--
ALTER TABLE `hall_bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `hall_id` (`hall_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`invoice_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `vat_id` (`vat_id`);

--
-- Indexes for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `user_id` (`employee_id`);

--
-- Indexes for table `meals`
--
ALTER TABLE `meals`
  ADD PRIMARY KEY (`meal_id`);

--
-- Indexes for table `meal_packages`
--
ALTER TABLE `meal_packages`
  ADD PRIMARY KEY (`package_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `payroll`
--
ALTER TABLE `payroll`
  ADD PRIMARY KEY (`payroll_id`),
  ADD KEY `user_id` (`employee_id`);

--
-- Indexes for table `restaurant`
--
ALTER TABLE `restaurant`
  ADD PRIMARY KEY (`restaurant_id`);

--
-- Indexes for table `restaurant_orders`
--
ALTER TABLE `restaurant_orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `meal_id` (`meal_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`) USING BTREE,
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vat`
--
ALTER TABLE `vat`
  ADD PRIMARY KEY (`vat_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `booking_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `booking_meals`
--
ALTER TABLE `booking_meals`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `employee_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `employee_attendance`
--
ALTER TABLE `employee_attendance`
  MODIFY `attendance_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `employee_messages`
--
ALTER TABLE `employee_messages`
  MODIFY `message_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  MODIFY `salary_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_schedules`
--
ALTER TABLE `employee_schedules`
  MODIFY `schedule_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `employee_tasks`
--
ALTER TABLE `employee_tasks`
  MODIFY `task_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expense_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `halls`
--
ALTER TABLE `halls`
  MODIFY `hall_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `hall_bookings`
--
ALTER TABLE `hall_bookings`
  MODIFY `booking_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `invoice_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leave_requests`
--
ALTER TABLE `leave_requests`
  MODIFY `request_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meals`
--
ALTER TABLE `meals`
  MODIFY `meal_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `meal_packages`
--
ALTER TABLE `meal_packages`
  MODIFY `package_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payroll`
--
ALTER TABLE `payroll`
  MODIFY `payroll_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `restaurant`
--
ALTER TABLE `restaurant`
  MODIFY `restaurant_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `restaurant_orders`
--
ALTER TABLE `restaurant_orders`
  MODIFY `order_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `room_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `vat`
--
ALTER TABLE `vat`
  MODIFY `vat_id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);

--
-- Constraints for table `booking_meals`
--
ALTER TABLE `booking_meals`
  ADD CONSTRAINT `booking_meals_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`),
  ADD CONSTRAINT `booking_meals_ibfk_2` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`meal_id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  ADD CONSTRAINT `employee_salaries_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `employee_schedules`
--
ALTER TABLE `employee_schedules`
  ADD CONSTRAINT `employee_schedules_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `employee_tasks`
--
ALTER TABLE `employee_tasks`
  ADD CONSTRAINT `employee_tasks_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `hall_bookings`
--
ALTER TABLE `hall_bookings`
  ADD CONSTRAINT `hall_bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `hall_bookings_ibfk_2` FOREIGN KEY (`hall_id`) REFERENCES `halls` (`hall_id`);

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`vat_id`) REFERENCES `vat` (`vat_id`);

--
-- Constraints for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`);

--
-- Constraints for table `payroll`
--
ALTER TABLE `payroll`
  ADD CONSTRAINT `payroll_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `restaurant_orders`
--
ALTER TABLE `restaurant_orders`
  ADD CONSTRAINT `restaurant_orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `restaurant_orders_ibfk_2` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`meal_id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
