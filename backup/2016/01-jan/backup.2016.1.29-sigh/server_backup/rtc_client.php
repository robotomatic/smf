<?
include("rtc.php");
if ($_POST["answer"]) {
    if (!$_SESSION["games"][$ip]["answers"]) $_SESSION["games"][$ip]["answers"] = array();
    $_SESSION["games"][$ip]["answers"][] = $_POST["answer"];
    echo("");
} else if ($_POST["exit"]) {
//    for ($i = 0; i < $_SESSION["games"][$ip]["answers"].length; i++) {
//        // todo: identify somehow...likely subnet
//    }
    echo("");
} else if ($_GET) {
    if ($_GET["offer"]) {
        echo(json_encode($_SESSION["games"][$ip]["offer"]));    
    }
}
?>