<?php

    require_once("../config.php");

    $id_inscricao=$_GET["id"];

    $sql="DELETE FROM tb_inscricoes WHERE id_inscricao=?";

    if($stmt=$link->prepare($sql)){
        $stmt->bind_param("i", $id_inscricao);
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
                    window.location.href = 'ver_inscricoes.php';
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
                window.location.href = 'ver_inscricoes.php';
            }, 100);
        </script>";
    }

    $link->close();
        
?>