<?php 

require_once("../config.php");

$id_partitura=$_POST["id_partitura"];
$partitura=$_POST['partitura'];

$sql="UPDATE tb_nome_partituras SET nome_partitura = ? where id_nome_partitura=?";
if($stmt=$link->prepare($sql)){
    $stmt->bind_param("si", $partitura,$id_partitura);
    if($stmt->execute()){
        echo"
        <script>
            localStorage.setItem('sucesso', 'sucesso');
            setTimeout(function() {
                window.location.href = 'partituras.php';
            }, 100);
        </script>";
    }
    else{
        echo"
        <script>
            localStorage.setItem('erro', 'erro');
            setTimeout(function() {
                window.location.href = 'partituras.php';
            });
        </script>";
    }
    $stmt->close();
    $link->close();

}
else{
    echo"
    <script>
        localStorage.setItem('erro', 'erro');
        setTimeout(function() {
            window.location.href = 'partituras.php';
        });
    </script>";
}
?>