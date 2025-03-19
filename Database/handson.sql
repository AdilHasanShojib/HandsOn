-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 19, 2025 at 07:32 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `handson`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `location` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `date`, `time`, `location`, `category`, `created_by`, `created_at`) VALUES
(15, 'Tree Plantation Campaign', 'Plant trees to support environmental sustainability.', '2025-03-06', '18:49:00', 'Savar', 'Environment', 1, '2025-03-09 12:50:10'),
(16, 'Food Distribution for Homeless', 'Help distribute free meals to those in need', '2025-03-28', '10:53:00', 'Dhaka', 'Community', 2, '2025-03-19 16:53:37'),
(17, 'Beach Cleanup Drive', 'Join us in cleaning up the city beach and preserving marine life.', '2025-04-10', '10:56:00', 'Coxs Bazar', 'Environment', 2, '2025-03-19 16:56:27'),
(18, 'Education for Underprivileged Kids', 'Volunteer to teach kids basic subjects.', '2025-03-20', '00:00:00', 'Savar', 'Education', 1, '2025-03-19 17:54:28'),
(19, 'Blood Donation Camp', 'Donate blood and save lives.', '2025-03-25', '12:55:00', 'Savar', 'Healthcare', 1, '2025-03-19 17:56:02');

-- --------------------------------------------------------

--
-- Table structure for table `event_attendees`
--

CREATE TABLE `event_attendees` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `event_attendees`
--

INSERT INTO `event_attendees` (`id`, `event_id`, `user_id`) VALUES
(2, 15, 1),
(3, 15, 2),
(5, 17, 1),
(6, 19, 1);

-- --------------------------------------------------------

--
-- Table structure for table `help_requests`
--

CREATE TABLE `help_requests` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` enum('Education','Health','Food','Shelter','Other') NOT NULL,
  `urgency` enum('Low','Medium','High') NOT NULL,
  `status` enum('Open','In Progress','Resolved') DEFAULT 'Open',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `help_requests`
--

INSERT INTO `help_requests` (`id`, `title`, `description`, `category`, `urgency`, `status`, `created_by`, `created_at`) VALUES
(2, 'Blood Donation Camp', 'Donate blood and save lives.', 'Health', 'Medium', 'Open', 1, '2025-03-09 17:39:11'),
(3, 'Beach Cleanup Drive', 'Join us in cleaning up the city beach and preserving marine life.', 'Shelter', 'Medium', 'Open', 2, '2025-03-09 18:17:49');

-- --------------------------------------------------------

--
-- Table structure for table `help_responses`
--

CREATE TABLE `help_responses` (
  `id` int(11) NOT NULL,
  `help_request_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `response` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `help_responses`
--

INSERT INTO `help_responses` (`id`, `help_request_id`, `user_id`, `response`, `created_at`) VALUES
(2, 3, 1, ' Great Initiative', '2025-03-09 19:17:47'),
(4, 2, 2, 'I want to join this event.', '2025-03-19 17:38:53');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `help_request_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `help_request_id`, `message`, `timestamp`) VALUES
(1, 1, 2, 2, 'Hi sunny', '2025-03-09 19:06:55'),
(2, 1, 2, 2, 'Can you help me?', '2025-03-09 19:08:03'),
(3, 2, 1, 3, 'Hi', '2025-03-15 17:57:27'),
(4, 2, 1, 3, 'How Are you?', '2025-03-15 18:53:12'),
(5, 2, 1, 3, 'pew', '2025-03-15 19:13:33'),
(6, 1, 2, 2, 'yo', '2025-03-15 19:13:46'),
(7, 1, 2, 2, 'Hi', '2025-03-16 04:26:45'),
(8, 2, 1, 3, 'bro', '2025-03-16 05:00:35'),
(9, 1, 2, 2, 'hlw', '2025-03-16 05:03:14'),
(10, 2, 1, 3, 'sent by anamul', '2025-03-16 05:06:08'),
(11, 1, 2, 2, 'bye', '2025-03-16 05:21:37');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_private` tinyint(1) DEFAULT 0,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `description`, `is_private`, `created_by`, `created_at`) VALUES
(11, 'Green Warriors', 'A team dedicated to environmental conservation.', 0, 1, '2025-03-17 06:39:51'),
(12, 'Code Masters', 'A group of passionate developers solving real-world problems.', 0, 2, '2025-03-17 06:39:51'),
(13, 'Helping Hands', 'Community-driven volunteers for social causes.', 1, 1, '2025-03-17 06:39:51'),
(14, 'Tech Titans', 'Innovating through technology and teamwork.', 0, 2, '2025-03-17 06:39:51'),
(15, 'Charity Champs', 'Dedicated to fundraising and supporting nonprofits.', 1, 1, '2025-03-17 06:39:51'),
(16, 'Sports Squad', 'A team for sports lovers and fitness enthusiasts.', 0, 2, '2025-03-17 06:39:51'),
(17, 'AI Innovators', 'Exploring artificial intelligence and machine learning.', 1, 2, '2025-03-17 06:39:51');

-- --------------------------------------------------------

--
-- Table structure for table `team_invites`
--

CREATE TABLE `team_invites` (
  `id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `status` enum('pending','accepted','declined') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `team_invites`
--

INSERT INTO `team_invites` (`id`, `team_id`, `sender_id`, `receiver_id`, `status`, `created_at`) VALUES
(3, 17, 2, 1, 'accepted', '2025-03-18 13:49:05'),
(6, 15, 1, 2, 'accepted', '2025-03-18 17:45:13'),
(8, 13, 1, 2, 'declined', '2025-03-19 04:28:29'),
(11, 17, 2, 1, 'pending', '2025-03-19 05:31:18'),
(12, 17, 2, 2, 'accepted', '2025-03-19 05:33:29'),
(13, 15, 1, 2, 'pending', '2025-03-19 17:58:28'),
(14, 13, 1, 2, 'pending', '2025-03-19 17:58:34');

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` enum('admin','member') DEFAULT 'member',
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `team_members`
--

INSERT INTO `team_members` (`id`, `team_id`, `user_id`, `role`, `joined_at`) VALUES
(3, 16, 2, 'member', '2025-03-17 06:47:58'),
(9, 11, 2, 'member', '2025-03-17 16:59:50'),
(10, 17, 1, 'member', '2025-03-19 05:03:44'),
(11, 15, 2, 'member', '2025-03-19 05:24:58'),
(13, 17, 2, 'member', '2025-03-19 05:33:44'),
(14, 16, 1, 'member', '2025-03-19 17:58:39'),
(15, 11, 1, 'member', '2025-03-19 17:58:42'),
(17, 12, 1, 'member', '2025-03-19 17:58:51');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `skills` text DEFAULT NULL,
  `causes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `skills`, `causes`, `created_at`) VALUES
(1, 'Shojib Talukder', 'shojib@gmail.com', '$2b$10$G1HpJRdPd8o1n.VSWcSk.upQCJV/bMXOrM9EqWY8FhlkUhwZslKzy', 'Teaching, Fundraising', 'Education, Healthcare', '2025-03-07 06:26:46'),
(2, 'Anamul Haque Sunny', 'anamul@gmail.com', '$2b$10$oE2pmAYLQE37pWKc66K17.AbXKojGzxhYA..VcQ7jVgY7NOMuduUW', 'TeamWork', 'Environment', '2025-03-08 05:40:26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `event_attendees`
--
ALTER TABLE `event_attendees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `event_id` (`event_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `help_requests`
--
ALTER TABLE `help_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `help_responses`
--
ALTER TABLE `help_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `help_request_id` (`help_request_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`),
  ADD KEY `help_request_id` (`help_request_id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `team_invites`
--
ALTER TABLE `team_invites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `team_id` (`team_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `team_id` (`team_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `event_attendees`
--
ALTER TABLE `event_attendees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `help_requests`
--
ALTER TABLE `help_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `help_responses`
--
ALTER TABLE `help_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `team_invites`
--
ALTER TABLE `team_invites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_attendees`
--
ALTER TABLE `event_attendees`
  ADD CONSTRAINT `event_attendees_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_attendees_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `help_requests`
--
ALTER TABLE `help_requests`
  ADD CONSTRAINT `help_requests_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `help_responses`
--
ALTER TABLE `help_responses`
  ADD CONSTRAINT `help_responses_ibfk_1` FOREIGN KEY (`help_request_id`) REFERENCES `help_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `help_responses_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`help_request_id`) REFERENCES `help_requests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `team_invites`
--
ALTER TABLE `team_invites`
  ADD CONSTRAINT `team_invites_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `team_invites_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `team_invites_ibfk_3` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `team_members`
--
ALTER TABLE `team_members`
  ADD CONSTRAINT `team_members_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `team_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
