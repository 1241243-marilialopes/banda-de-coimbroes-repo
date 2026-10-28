<?php
include('../config.php');

if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

$id = $_GET['id'];
$sql="SELECT nome_partitura, ficheiro_partitura FROM tb_partituras
INNER JOIN tb_nome_partituras ON tb_partituras.nome=tb_nome_partituras.id_nome_partitura
WHERE id_partitura=$id";
$result=$link->query($sql);

if($result->num_rows>0){
    $row = $result-> fetch_assoc();
    $nome_ficheiro = $row['nome_partitura'];
    $ficheiro = $row['ficheiro_partitura'];

    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="'.$nome_ficheiro.'.pdf"');

    echo $ficheiro;
}
else{
    echo "Partitura não encontrada.";
}
?>