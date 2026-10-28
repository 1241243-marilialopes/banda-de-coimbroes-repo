<?php

    require_once("../config.php");

    $id_utilizador=$_GET["id"];

    $sql="DELETE FROM tb_utilizadores WHERE id_utilizador=?";

    if($stmt=$link->prepare($sql)){
        $stmt->bind_param("i", $id_utilizador);
        $stmt->execute();

        $sql_presencas = "DELETE FROM tb_presencas WHERE musico_id =?";
        if($stmt_presencas=$link->prepare($sql_presencas)){
            $stmt_presencas->bind_param("i",$id_utilizador);
            $stmt_presencas->execute();

            $sql_cotas = "DELETE FROM tb_cota_mes WHERE socio_id =?";
            if($stmt_cotas=$link->prepare($sql_cotas)){
                $stmt_cotas->bind_param("i",$id_utilizador);
                $stmt_cotas->execute();
                if ($stmt_cotas->error){
                    echo"
                    <script>
                        localStorage.setItem('erro', 'erro');
                        setTimeout(function() {
                            window.location.href = 'utilizadores.php';
                        }, 100);
                    </script>";
                    exit();
                }
                else{
                    echo"
                    <script>
                        localStorage.setItem('sucesso2', 'sucesso2');
                        setTimeout(function() {
                            window.location.href = 'utilizadores.php';
                        }, 100);
                    </script>";
                    exit();
                }
            }
            if ($stmt_presencas->error){
                echo"
                <script>
                    localStorage.setItem('erro', 'erro');
                    setTimeout(function() {
                        window.location.href = 'utilizadores.php';
                    }, 100);
                </script>";
                exit();
            }
            else{
                echo"
                <script>
                    localStorage.setItem('sucesso2', 'sucesso2');
                    setTimeout(function() {
                        window.location.href = 'utilizadores.php';
                    });
                </script>";
                exit();
            }
        }
        if ($stmt->error){
            echo"
            <script>
                localStorage.setItem('erro', 'erro');
                setTimeout(function() {
                    window.location.href = 'utilizadores.php';
                }, 100);
            </script>";
            exit();
        }
        else{
            echo"
            <script>
                localStorage.setItem('sucesso2', 'sucesso2');
                setTimeout(function() {
                    window.location.href = 'utilizadores.php';
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
                window.location.href = 'utilizadores.php';
            }, 100);
        </script>";
    }

    $link->close();
        
?>