<?php 
    require_once("config.php");
    
    $_SESSION["log-in"]=false;
    session_destroy();

    header("LOCATION: index.php");

?>