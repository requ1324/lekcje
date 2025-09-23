-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: sql305.byetcluster.com
-- Czas generowania: 22 Wrz 2025, 05:25
-- Wersja serwera: 11.4.7-MariaDB
-- Wersja PHP: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `mseet_39944377_kraje`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `zbior`
--

CREATE TABLE `zbior` (
  `id` int(11) NOT NULL,
  `id_kraj` int(11) NOT NULL,
  `nominal` mediumtext NOT NULL,
  `nr_kat` int(11) NOT NULL,
  `id_stop` int(11) NOT NULL,
  `rok` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Zrzut danych tabeli `zbior`
--

INSERT INTO `zbior` (`id`, `id_kraj`, `nominal`, `nr_kat`, `id_stop`, `rok`) VALUES
(1, 1, 'cent', 1, 2, 2010),
(2, 2, 'cent', 1, 1, 2000);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `zbior`
--
ALTER TABLE `zbior`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT dla tabeli `zbior`
--
ALTER TABLE `zbior`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
