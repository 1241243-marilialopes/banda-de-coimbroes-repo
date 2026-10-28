<?php

    require_once("../config.php");

    $id_partitura=$_GET["id"];

    $sql="DELETE FROM tb_nome_partituras WHERE id_nome_partitura=?";

    if($stmt=$link->prepare($sql)){
        $stmt->bind_param("i", $id_partitura);
        $stmt->execute();

        $sql_partituras = "DELETE FROM tb_partituras WHERE nome =?";
        if($stmt_partituras=$link->prepare($sql_partituras)){
            $stmt_partituras->bind_param("i",$id_partitura);
            $stmt_partituras->execute();

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
                    window.location.href = 'partituras.php';
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
                window.location.href = 'partituras.php';
            }, 100);
        </script>";
    }

    $link->close();
        
?>