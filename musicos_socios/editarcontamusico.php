<?php
include('../config.php');

if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

if($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["submit"])){

    $id_utilizador = $_SESSION["id"];
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $tele = $_POST["tele"];
    $data = $_POST['data'];
    $genero = $_POST['genero'];

    $sql="UPDATE tb_utilizadores SET nome_utilizador=?, email=?, telemovel=?, data_nascimento=?, genero_id=? where id_utilizador=?";
    if($stmt=$link->prepare($sql)){
        $stmt->bind_param("ssisii", $nome, $email, $tele, $data, $genero, $id_utilizador);
        if($stmt->execute()){
            echo"
            <script>
                localStorage.setItem('sucesso', 'sucesso');
                setTimeout(function() {
                    window.location.href = 'conta_musico.php';
                }, 100);
            </script>";
        }
        else{
            echo"
            <script>
                localStorage.setItem('erro', 'erro');
                setTimeout(function() {
                    window.location.href = 'conta_musico.php';
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
                window.location.href = 'conta_musico.php';
            });
        </script>";
    }
    
}
?>