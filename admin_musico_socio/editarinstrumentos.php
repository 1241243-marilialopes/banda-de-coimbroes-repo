<?php 

require_once("../config.php");

$id_instrumento=$_POST["id_instrumento"];
$instrumento=$_POST['instrumento'];

$sql="UPDATE tb_instrumentos SET nome_instrumento=? where id_instrumento=?";
if($stmt=$link->prepare($sql)){
    $stmt->bind_param("si", $instrumento,$id_instrumento);
    if($stmt->execute()){
        echo"
        <script>
            localStorage.setItem('sucesso', 'sucesso');
            setTimeout(function() {
                window.location.href = 'instrumentos.php';
            }, 100);
        </script>";
    }
    else{
        echo"
        <script>
            localStorage.setItem('erro', 'erro');
            setTimeout(function() {
                window.location.href = 'instrumentos.php';
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
            window.location.href = 'instrumentos.php';
        });
    </script>";
}
?>