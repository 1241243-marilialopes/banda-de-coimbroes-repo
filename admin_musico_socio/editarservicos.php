<?php 

    require_once("../config.php");

    $id_servico=$_POST["id_servico"];
    $nome_servico=$_POST['nome'];
    $descricao=$_POST["descricao"];
    $tipo=$_POST["tipo"];
    $data_inicio=$_POST["data_inicial"];
    $data_final= $_POST["data_final"];
    $local=$_POST["local"];
    $tele=$_POST["tele"];
    $nome_resp=$_POST["nome_resp"];

    $sql="UPDATE tb_servicos SET nome_servico=?,descricao_servico=?, tipo=?, data_inicial=?, data_final=?, localizacao=?, contacto_comissao=?, nome_comissao=? where id_servico=?";

    if($stmt=$link->prepare($sql)){
        $stmt->bind_param("ssisssisi", $nome_servico, $descricao, $tipo, $data_inicio,$data_final,$local,$tele,$nome_resp,$id_servico);
        if($stmt->execute()){
            echo"
            <script>
                localStorage.setItem('sucesso', 'sucesso');
                setTimeout(function() {
                    window.location.href = 'gerir_servicos.php';
                }, 100);
            </script>";
        }
        else{
            echo"
            <script>
                localStorage.setItem('erro', 'erro');
                setTimeout(function() {
                    window.location.href = 'gerir_servicos.php';
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
                window.location.href = 'gerir_servicos.php';
            }, 100);
        </script>";
    }
?>