<?
session_start();
$ip = $_SERVER['SERVER_ADDR'];
if (!$_SESSION["games"]) $_SESSION["games"] = array();
if (!$_SESSION["games"][$ip]) $_SESSION["games"][$ip] = array();
?>
