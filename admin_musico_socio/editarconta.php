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
    $instrumento = $_POST['instrumento'];
    $data = $_POST['data'];
    $genero = $_POST['genero'];
    $cargo = $_POST['cargo'];

    $sql="UPDATE tb_utilizadores SET nome_utilizador=?, email=?, telemovel=?, data_nascimento=?, instrumento=?, genero_id=?, cargo_id=? where id_utilizador=?";
    if($stmt=$link->prepare($sql)){
        $stmt->bind_param("ssissiii", $nome, $email, $tele, $data, $instrumento, $genero, $cargo, $id_utilizador);
        if($stmt->execute()){
            echo"
            <script>
                localStorage.setItem('sucesso', 'sucesso');
                setTimeout(function() {
                    window.location.href = 'conta.php';
                }, 100);
            </script>";
        }
        else{
            echo"
            <script>
                localStorage.setItem('erro', 'erro');
                setTimeout(function() {
                    window.location.href = 'conta.php';
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
                window.location.href = 'conta.php';
            });
        </script>";
    }
    
}
?>