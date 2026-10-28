<?php

    require_once("../config.php");

    $id_servico=$_GET["id"];

    $sql="DELETE FROM tb_servicos WHERE id_servico=?";

    if($stmt=$link->prepare($sql)){
        $stmt->bind_param("i", $id_servico);
        $stmt->execute();

        $sql_presencas="DELETE FROM tb_presencas WHERE servico_id = ?";

        if($stmt_presencas=$link->prepare($sql_presencas)){
            $stmt_presencas->bind_param("i",$id_servico);
            $stmt_presencas->execute();

            if($stmt_presencas->error){
                echo "Erro 1".$stmt_presencas->error;
                exit();
            }
        }
        if ($stmt->error){
            echo"
            <script>
                localStorage.setItem('erro', 'erro');
                setTimeout(function() {
                    window.location.href = 'gerir_servicos.php';
                }, 100);
            </script>";
            exit();
        }
        else{
            echo"
            <script>
                localStorage.setItem('sucesso2', 'sucesso2');
                setTimeout(function() {
                    window.location.href = 'gerir_servicos.php';
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
                    window.location.href = 'gerir_servicos.php';
                }, 100);
            </script>";
    }

    $link->close();
        
?>