<?php

    require_once("../config.php");

    $id_partitura=$_GET["id"];
    $sql="DELETE FROM tb_partituras WHERE id_partitura=?";

    if($stmt=$link->prepare($sql)){
        $stmt->bind_param("i", $id_partitura);
        $stmt->execute();
        if ($stmt->error){
            echo "Erro!".$stmt->error;
            exit();
        }
        else{
            echo"
            <script>
                localStorage.setItem('sucesso2', 'sucesso2');
                setTimeout(function() {
                    window.location.href = 'caderneta.php';
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
                window.location.href = 'caderneta.php';
            }, 100);
        </script>";
    }

    $link->close();
        