<?
include("rtc.php");
if ($_POST["offer"]) {
    $_SESSION["games"][$ip]["offer"] = $_POST["offer"];
    $_SESSION["games"][$ip]["answers"] = array();
    echo("");
} else if ($_POST["exit"]) {
    $_SESSION["games"][$ip] = null;
    echo("");
} else if ($_GET["answers"]) echo(json_encode($_SESSION["games"][$ip]["answers"]));
?>