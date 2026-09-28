-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 27, 2026 at 01:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `melodiva_skincare`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `generate_order_number` (OUT `new_order_number` TEXT)   BEGIN
  DECLARE new_number TEXT;
  DECLARE exists_check INT DEFAULT 1;

  order_loop: LOOP
    SET new_number = CONCAT('ORD-', LPAD(FLOOR(RAND() * 999999), 6, '0'));
    SELECT COUNT(*) INTO exists_check FROM orders WHERE order_number = new_number;
    IF exists_check = 0 THEN
      SET new_order_number = new_number;
      LEAVE order_loop;
    END IF;
  END LOOP;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `affiliates`
--

CREATE TABLE `affiliates` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `affiliate_code` text NOT NULL,
  `commission_rate` decimal(10,2) NOT NULL DEFAULT 10.00,
  `total_commission` decimal(10,2) NOT NULL DEFAULT 0.00,
  `current_balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_withdrawn` decimal(10,2) NOT NULL DEFAULT 0.00,
  `rules_agreed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `affiliates`
--

INSERT INTO `affiliates` (`id`, `user_id`, `affiliate_code`, `commission_rate`, `total_commission`, `current_balance`, `total_withdrawn`, `rules_agreed_at`, `created_at`, `updated_at`, `is_active`) VALUES
('643ce0e5-0247-11f1-b7e0-f01faf3658ef', 'd521c6dc-7626-4d17-8df0-5a89b2d6e521', 'XFMD', 10.00, 42.50, 42.50, 0.00, '2026-02-05 04:01:47', '2026-02-05 04:01:47', '2026-05-16 11:28:15', 1);

--
-- Triggers `affiliates`
--
DELIMITER $$
CREATE TRIGGER `trg_affiliates_before_insert` BEFORE INSERT ON `affiliates` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `affiliate_referrals`
--

CREATE TABLE `affiliate_referrals` (
  `id` char(36) NOT NULL,
  `affiliate_id` char(36) NOT NULL,
  `referred_user_id` char(36) DEFAULT NULL,
  `order_id` text DEFAULT NULL,
  `commission_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` text NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `affiliate_referrals`
--

INSERT INTO `affiliate_referrals` (`id`, `affiliate_id`, `referred_user_id`, `order_id`, `commission_amount`, `status`, `created_at`) VALUES
('54640f8c-511a-11f1-8e46-f01faf3658ef', '643ce0e5-0247-11f1-b7e0-f01faf3658ef', 'd521c6dc-7626-4d17-8df0-5a89b2d6e521', 'MEL-1778930894364-917', 20.00, 'completed', '2026-05-16 11:28:15'),
('7226acaf-024e-11f1-b7e0-f01faf3658ef', '643ce0e5-0247-11f1-b7e0-f01faf3658ef', 'd521c6dc-7626-4d17-8df0-5a89b2d6e521', 'MEL-1770267134007-912', 12.50, 'completed', '2026-02-05 04:52:17'),
('7e6f589d-452c-11f1-97f8-f01faf3658ef', '643ce0e5-0247-11f1-b7e0-f01faf3658ef', 'd521c6dc-7626-4d17-8df0-5a89b2d6e521', 'MEL-1777619281991-975', 10.00, 'completed', '2026-05-01 07:08:02');

--
-- Triggers `affiliate_referrals`
--
DELIMITER $$
CREATE TRIGGER `trg_affiliate_referrals_before_insert` BEFORE INSERT ON `affiliate_referrals` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `affiliate_withdrawals`
--

CREATE TABLE `affiliate_withdrawals` (
  `id` char(36) NOT NULL,
  `affiliate_id` char(36) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `bank_name` text NOT NULL,
  `account_number` text NOT NULL,
  `account_name` text NOT NULL,
  `status` text NOT NULL DEFAULT 'pending',
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `affiliate_withdrawals`
--
DELIMITER $$
CREATE TRIGGER `trg_affiliate_withdrawals_before_insert` BEFORE INSERT ON `affiliate_withdrawals` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` char(36) NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `contact_messages`
--
DELIMITER $$
CREATE TRIGGER `trg_contact_messages_before_insert` BEFORE INSERT ON `contact_messages` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` char(36) NOT NULL,
  `code` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('active','used') NOT NULL DEFAULT 'active',
  `user_id` char(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `used_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `order_number` text NOT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`items`)),
  `subtotal` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `delivery_fee` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `affiliate_code` text DEFAULT NULL,
  `affiliate_id` char(36) DEFAULT NULL,
  `delivery_address` text NOT NULL,
  `delivery_state` text NOT NULL,
  `delivery_city` text NOT NULL,
  `phone_number` text NOT NULL,
  `whatsapp_number` text DEFAULT NULL,
  `payment_status` text NOT NULL DEFAULT 'pending',
  `payment_reference` text DEFAULT NULL,
  `status` text NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_number`, `items`, `subtotal`, `discount`, `delivery_fee`, `total`, `affiliate_code`, `affiliate_id`, `delivery_address`, `delivery_state`, `delivery_city`, `phone_number`, `whatsapp_number`, `payment_status`, `payment_reference`, `status`, `created_at`, `updated_at`) VALUES
('92d84db4-75ed-4c69-a0ef-aa4e11576196', 'd521c6dc-7626-4d17-8df0-5a89b2d6e521', 'MEL-1770267134007-912', '[{\"product_id\":\"black-soap-exquisite-250g\",\"name\":\"Black Soap - Exquisite (250g)\",\"variant\":\"exquisite\",\"size\":\"250g\",\"price\":2500,\"quantity\":1,\"image\":\"/src/assets/bs_et-250.jpg\"}]', 2500.00, 125.00, 1500.00, 3875.00, 'XFMD', '643ce0e5-0247-11f1-b7e0-f01faf3658ef', '651 N Broad Street', 'Lagos', 'Ikorodu', '0802 632 2742', '0802 632 2742', 'paid', 'PSK_d521c6dc-7626-4d17-8df0-5a89b2d6e521_1770267097040', 'delivered', '2026-02-05 04:52:16', '2026-05-01 07:06:04'),
('bfe66738-c733-4fe9-bca4-183ad2251dfd', 'd521c6dc-7626-4d17-8df0-5a89b2d6e521', 'MEL-1778930894364-917', '[{\"product_id\":\"black-soap-natural-250g\",\"name\":\"Black Soap - Natural (250g)\",\"variant\":\"natural\",\"size\":\"250g\",\"price\":2000,\"quantity\":2,\"image\":\"/src/assets/bs_nf-250.jpg\"}]', 4000.00, 200.00, 1500.00, 5300.00, 'XFMD', '643ce0e5-0247-11f1-b7e0-f01faf3658ef', '651 N Broad Street', 'Lagos', 'Ikorodu', '0802 632 2742', '0802 632 2742', 'paid', 'PSK_d521c6dc-7626-4d17-8df0-5a89b2d6e521_1778930837011', 'packaged', '2026-05-16 11:28:14', '2026-05-16 11:29:24'),
('f40f264c-dce0-4e26-9253-f6d13fab2133', 'd521c6dc-7626-4d17-8df0-5a89b2d6e521', 'MEL-1777619281991-975', '[{\"product_id\":\"black-soap-exquisite-250g\",\"name\":\"Black Soap - Exquisite (250g)\",\"variant\":\"exquisite\",\"size\":\"250g\",\"price\":2000,\"quantity\":1,\"image\":\"/src/assets/bs_et-250.jpg\"}]', 2000.00, 100.00, 1500.00, 3400.00, 'XFMD', '643ce0e5-0247-11f1-b7e0-f01faf3658ef', '651 N Broad Street', 'Lagos', 'Ikorodu', '0802 632 2742', '0802 632 2742', 'paid', 'PSK_d521c6dc-7626-4d17-8df0-5a89b2d6e521_1777619258614', 'packaged', '2026-05-01 07:08:02', '2026-05-01 07:08:50');

--
-- Triggers `orders`
--
DELIMITER $$
CREATE TRIGGER `trg_orders_before_insert` BEFORE INSERT ON `orders` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `order_status_history`
--

CREATE TABLE `order_status_history` (
  `id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `status` text NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_status_history`
--

INSERT INTO `order_status_history` (`id`, `order_id`, `status`, `notes`, `created_at`) VALUES
('22032bd5-0251-11f1-b7e0-f01faf3658ef', '92d84db4-75ed-4c69-a0ef-aa4e11576196', 'processing', 'Updated by mosesbakare48@gmail.com', '2026-02-05 05:11:31'),
('28a2a74d-0251-11f1-b7e0-f01faf3658ef', '92d84db4-75ed-4c69-a0ef-aa4e11576196', 'shipped', 'Updated by mosesbakare48@gmail.com', '2026-02-05 05:11:42'),
('3848b4f7-452c-11f1-97f8-f01faf3658ef', '92d84db4-75ed-4c69-a0ef-aa4e11576196', 'delivered', 'Updated by mosesbakare48@gmail.com', '2026-05-01 07:06:05'),
('542f2232-511a-11f1-8e46-f01faf3658ef', 'bfe66738-c733-4fe9-bca4-183ad2251dfd', 'processing', 'Order created', '2026-05-16 11:28:14'),
('720ff5ce-024e-11f1-b7e0-f01faf3658ef', '92d84db4-75ed-4c69-a0ef-aa4e11576196', 'pending', 'Order created', '2026-02-05 04:52:16'),
('7e1b9991-511a-11f1-8e46-f01faf3658ef', 'bfe66738-c733-4fe9-bca4-183ad2251dfd', 'packaged', 'Updated by mosesbakare48@gmail.com', '2026-05-16 11:29:25'),
('7e3ef25f-452c-11f1-97f8-f01faf3658ef', 'f40f264c-dce0-4e26-9253-f6d13fab2133', 'processing', 'Order created', '2026-05-01 07:08:02'),
('9acf65dc-452c-11f1-97f8-f01faf3658ef', 'f40f264c-dce0-4e26-9253-f6d13fab2133', 'packaged', 'Updated by mosesbakare48@gmail.com', '2026-05-01 07:08:50'),
('ce630b20-024e-11f1-b7e0-f01faf3658ef', '92d84db4-75ed-4c69-a0ef-aa4e11576196', 'packaged', 'Updated by mosesbakare48@gmail.com', '2026-02-05 04:54:51');

--
-- Triggers `order_status_history`
--
DELIMITER $$
CREATE TRIGGER `trg_order_status_history_before_insert` BEFORE INSERT ON `order_status_history` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` char(36) NOT NULL,
  `name` text NOT NULL,
  `type` text NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `stock` int(11) NOT NULL DEFAULT 0,
  `image_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `type`, `description`, `price`, `stock`, `image_url`, `created_at`, `updated_at`) VALUES
('01369d7a-0fad-487e-aab9-9b282d377e79', 'Black Soap - Natural (500g)', 'black-soap', 'Pure natural African black soap with no added fragrances. Perfect for sensitive skin and those who prefer unscented products.', 4000.00, 40, '/assets/bs_nf-500.jpg', '2026-02-05 04:30:32', '2026-02-05 05:17:08'),
('187936f5-89ed-4879-b66e-8d63fbbbe707', 'Black Soap - Perfume (500g)', 'black-soap', 'African black soap infused with natural fragrances. Perfect for those who love a gentle scent with their skincare routine.', 4000.00, 25, '/assets/bs_p-500.jpg', '2026-02-05 04:30:31', '2026-02-05 04:30:31'),
('1dc45da4-9b76-4f10-8ea8-2e3bfc221be5', 'Black Soap - Exquisite (250g)', 'black-soap', 'Natural African black soap made with traditional methods. Exquisite variant with premium ingredients for luxury skincare.', 2500.00, 50, '/assets/bs_et-250.jpg', '2026-02-05 04:30:31', '2026-02-05 04:30:31'),
('2958fd16-3a02-4930-9d1f-18295c979245', 'Black Soap - Natural (250g)', 'black-soap', 'Pure natural African black soap with no added fragrances. Perfect for sensitive skin and those who prefer unscented products.', 2000.00, 60, '/assets/bs_nf-250.jpg', '2026-02-05 04:30:31', '2026-02-05 04:30:31'),
('3f60267b-1cb2-4cce-ba18-034c3af8f953', 'Pure Kernel Oil', 'kernel-oil', '100% pure natural kernel oil extracted from premium palm kernels. Rich in essential fatty acids, perfect for hair and skin moisturizing.', 1500.00, 100, '/assets/kernel-oil.jpg', '2026-02-05 04:30:30', '2026-02-05 04:30:30'),
('5f84f266-da16-4551-892d-070d5fe2ca98', 'Pure Kernel Oil (500ml)', 'kernel-oil', '100% pure natural kernel oil extracted from premium palm kernels. Rich in essential fatty acids, perfect for hair and skin moisturizing.', 2800.00, 50, '/assets/ke_500.jpg', '2026-02-05 04:30:32', '2026-02-05 04:30:32'),
('73e4bb8f-f413-45ac-af4a-829ba2c20eac', 'Natural Black Soap', 'black-soap', 'Natural African black soap made with traditional methods. Rich in vitamins and antioxidants, perfect for deep cleansing and nourishing your skin naturally.', 2000.00, 100, '/assets/black-soap.jpg', '2026-02-05 04:30:30', '2026-02-05 04:30:30'),
('9d1fb293-5db2-4b8a-bc58-d52d0c1055ab', 'Pure Kernel Oil (250ml)', 'kernel-oil', '100% pure natural kernel oil extracted from premium palm kernels. Rich in essential fatty acids, perfect for hair and skin moisturizing.', 1500.00, 70, '/assets/ke_250.jpg', '2026-02-05 04:30:32', '2026-02-05 04:30:32'),
('be7cbd79-be10-4ac9-8117-9b33cc395199', 'Black Soap - Perfume (250g)', 'black-soap', 'African black soap infused with natural fragrances. Perfect for those who love a gentle scent with their skincare routine.', 2200.00, 45, '/assets/bs_p-250.jpg', '2026-02-05 04:30:31', '2026-02-05 04:30:31'),
('ce73b09f-3d05-4667-b4cf-dc034eaffe40', 'Pure Kernel Oil (1000ml)', 'kernel-oil', '100% pure natural kernel oil extracted from premium palm kernels. Rich in essential fatty acids, perfect for hair and skin moisturizing.', 5000.00, 30, '/assets/ke_1000.jpg', '2026-02-05 04:30:32', '2026-02-05 04:30:32'),
('ed5564d6-bb0d-479a-9afd-5a80ffef31a0', 'Black Soap - Exquisite (500g)', 'black-soap', 'Natural African black soap made with traditional methods. Exquisite variant with premium ingredients for luxury skincare.', 4500.00, 30, '/assets/bs_et-500.jpg', '2026-02-05 04:30:31', '2026-02-05 04:30:31');

--
-- Triggers `products`
--
DELIMITER $$
CREATE TRIGGER `trg_products_before_insert` BEFORE INSERT ON `products` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` char(36) NOT NULL,
  `name` text NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text NOT NULL,
  `is_anonymous` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ;

--
-- Triggers `reviews`
--
DELIMITER $$
CREATE TRIGGER `trg_reviews_before_insert` BEFORE INSERT ON `reviews` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `full_name` text NOT NULL,
  `phone_number` text NOT NULL,
  `whatsapp_number` text DEFAULT NULL,
  `address` text NOT NULL,
  `state` text NOT NULL,
  `city` text NOT NULL,
  `security_question` text NOT NULL,
  `security_answer` text NOT NULL,
  `raw_user_meta_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`raw_user_meta_data`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone_number`, `whatsapp_number`, `address`, `state`, `city`, `security_question`, `security_answer`, `raw_user_meta_data`, `created_at`, `updated_at`) VALUES
('d521c6dc-7626-4d17-8df0-5a89b2d6e521', 'mosesbakare48@gmail.com', '$2a$10$ks0iH2/h2vapUmY9.NVcNuWhkFOYIpsHg0jRcE87Ib2.vid9FecO6', 'Toluwani Bakare', '0802 632 2742', '0802 632 2742', '651 N Broad Street', 'Lagos', 'Ikorodu', 'What is your mother\'s maiden state?', 'mosesbakare48@gmail.com', NULL, '2026-02-05 03:48:42', '2026-02-05 03:48:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `affiliates`
--
ALTER TABLE `affiliates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_id` (`user_id`),
  ADD UNIQUE KEY `affiliate_code` (`affiliate_code`) USING HASH,
  ADD KEY `idx_affiliates_user_id` (`user_id`),
  ADD KEY `idx_affiliates_affiliate_code` (`affiliate_code`(255));

--
-- Indexes for table `affiliate_referrals`
--
ALTER TABLE `affiliate_referrals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_affiliate_referrals_affiliate_id` (`affiliate_id`),
  ADD KEY `idx_affiliate_referrals_referred_user_id` (`referred_user_id`);

--
-- Indexes for table `affiliate_withdrawals`
--
ALTER TABLE `affiliate_withdrawals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_affiliate_withdrawals_affiliate_id` (`affiliate_id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_coupons_code` (`code`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`) USING HASH,
  ADD KEY `idx_orders_user_id` (`user_id`),
  ADD KEY `idx_orders_order_number` (`order_number`(255)),
  ADD KEY `idx_orders_affiliate_id` (`affiliate_id`);

--
-- Indexes for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_status_history_order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_users_email` (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `affiliates`
--
ALTER TABLE `affiliates`
  ADD CONSTRAINT `affiliates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `affiliate_referrals`
--
ALTER TABLE `affiliate_referrals`
  ADD CONSTRAINT `affiliate_referrals_ibfk_1` FOREIGN KEY (`affiliate_id`) REFERENCES `affiliates` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `affiliate_referrals_ibfk_2` FOREIGN KEY (`referred_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `affiliate_withdrawals`
--
ALTER TABLE `affiliate_withdrawals`
  ADD CONSTRAINT `affiliate_withdrawals_ibfk_1` FOREIGN KEY (`affiliate_id`) REFERENCES `affiliates` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coupons`
--
ALTER TABLE `coupons`
  ADD CONSTRAINT `coupons_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`affiliate_id`) REFERENCES `affiliates` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
