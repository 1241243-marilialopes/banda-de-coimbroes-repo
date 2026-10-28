<?php 

require_once("../config.php");

$id_partitura=$_POST["id_partitura"];
$nome_partitura=$_POST['partitura'];
$instrumento=$_POST['instrumento'];

if(isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
    $nome_imagem = $_FILES["imagem"]["name"];
    $foto = file_get_contents($_FILES['imagem']['tmp_name']);
} else {
    $query = "SELECT nome_imagem,imagem_partitura FROM tb_partituras WHERE id_partitura=?";
    if($stmt = $link ->prepare($query)){
        $stmt->bind_param("i",$id_partitura);
        $stmt->execute();
        $stmt->bind_result($nome_musica,$foto_partitura);
        $stmt->fetch();
        $nome_imagem = $nome_musica;
        $foto = $foto_partitura;
        $stmt->close();
    } 
}

if(isset($_FILES['pdf']) && $_FILES['pdf']['error'] === UPLOAD_ERR_OK) {
    $nome_ficheiro = $_FILES["pdf"]["name"];
    $pdf = file_get_contents($_FILES['pdf']['tmp_name']);
} else {
    $query_pdf = "SELECT nome_ficheiro,ficheiro_partitura FROM tb_partituras WHERE id_partitura=?";
    if($stmt = $link ->prepare($query_pdf)){
        $stmt->bind_param("i",$id_partitura);
        $stmt->execute();
        $stmt->bind_result($nome_pdf,$ficheiro);
        $stmt->fetch();
        $nome_ficheiro = $nome_pdf;
        $pdf = $ficheiro;
        $stmt->close();
    } 
}

$sql="UPDATE tb_partituras SET nome=?, nome_ficheiro=?, instrumento=?, imagem_partitura=?, nome_imagem=?, ficheiro_partitura=? where id_partitura=?";
if($stmt=$link->prepare($sql)){
    $stmt->bind_param("isisssi", $nome_partitura,$nome_ficheiro,$instrumento,$foto,$nome_imagem,$pdf,$id_partitura);
    if($stmt->execute()){
        echo"
        <script>
            localStorage.setItem('sucesso', 'sucesso');
            setTimeout(function() {
                window.location.href = 'caderneta.php';
            }, 100);
        </script>";
    }
    else{
        echo"
        <script>
            localStorage.setItem('erro', 'erro');
            setTimeout(function() {
                window.location.href = 'caderneta.php';
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
            window.location.href = 'caderneta.php';
        });
    </script>";
}
?>