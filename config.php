<?php

if(session_status() == PHP_SESSION_NONE){
    session_start();
}


if ($_SERVER['SERVER_NAME']=="localhost") 
{
// Servidor local/desenvolvimento
    $bd_host="localhost";
    $bd_user="root";
    $bd_password="";
    $bd_database="bd_pap";

    $link = new mysqli($bd_host,$bd_user,$bd_password,$bd_database); 
    $link->set_charset('utf8');
    if($link->connect_errno){ 
     printf("Ocorreu um Erro - Ligação Falhou; %s\n", $link->connect_error); 
     exit(); 
    } 

}
else {
  
    // Servidor produção
    
    define('DB_SERVER','185.240.248.86:3306'); 

    define('DB_USERNAME','boavist2_marilia');
    define('DB_PASSWORD','PAP#marilia'); 
    define('DB_NAME','boavist2_marilia'); 
    $link = new mysqli(DB_SERVER,DB_USERNAME,DB_PASSWORD,DB_NAME); 
    $link->set_charset('utf8');
    if($link->connect_errno){ 
     printf("Ocorreu um Erro - Ligação Falhou; %s\n", $link->connect_error); 
     exit(); 
    } 
    $host = $_SERVER['HTTP_HOST'];
  
    
}

if( $link -> connect_errno){
    //se acontecer um erro informa qual é o erro
    echo "Ocorreu um erro - Ligação falhou: %s\n", $link -> connect_errno;
    exit();
}

?>