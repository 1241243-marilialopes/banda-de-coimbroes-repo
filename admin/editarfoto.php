<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.min.js"></script>
</head>
<body>
    
<?php 

include('../config.php');

if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

$id_utilizador=$_SESSION['id'];

if(isset($_FILES['imagem']) && $_FILES['imagem']['error'] == UPLOAD_ERR_OK){
    $foto = file_get_contents($_FILES['imagem']['tmp_name']);

    $sql="UPDATE tb_utilizadores SET foto_perfil =? where id_utilizador = ?";
    if($stmt=$link->prepare($sql)){
        $stmt->bind_param("si", $foto,$id_utilizador);
        if($stmt->execute()){
            echo"
            <script>
                localStorage.setItem('sucesso', 'sucesso');
                setTimeout(function() {
                    window.location.href = 'conta.php';
                }, 100);
            </script>";
            exit();
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
?>
</body>
</html>