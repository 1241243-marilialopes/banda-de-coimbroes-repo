<?php

    require_once("../config.php");

    $id_instrumento=$_GET["id"];

    $sql="DELETE FROM tb_instrumentos WHERE id_instrumento=?";

    if($stmt=$link->prepare($sql)){
        $stmt->bind_param("i", $id_instrumento);
        $stmt->execute();

        $sql_partituras = "DELETE FROM tb_partituras WHERE instrumento =?";
        if($stmt_partituras=$link->prepare($sql_partituras)){
            $stmt_partituras->bind_param("i",$id_instrumento);
            $stmt_partituras->execute();

        }

        $sql_atualizar_utilizadores = "UPDATE tb_utilizadores SET instrumento = 21 WHERE instrumento = ?";
        if ($stmt_utilizadores = $link->prepare($sql_atualizar_utilizadores)) {
            $stmt_utilizadores->bind_param("i", $id_instrumento);
            $stmt_utilizadores->execute();
        }
        
        if ($stmt->error){
            echo "Erro!".$stmt->error;
            exit();
        }
        else{     
        echo"
        <script>
            localStorage.setItem('sucesso2', 'sucesso2');
            setTimeout(function() {
                window.location.href = 'instrumentos.php';
            }, 100);
        </script>";

            exit();
        }
        $stmt->close();
    }
    else{
        echo"
        <script>
            localStorage.setItem('erro', 'erro');
            setTimeout(function() {
                window.location.href = 'instrumentos.php';
            }, 100);
        </script>";
    }

    $link->close();
        
?>