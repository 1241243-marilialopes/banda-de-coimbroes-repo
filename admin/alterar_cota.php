<?php
include('../config.php');
if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

if(isset($_GET['id'])) {
    $id_cota = $_GET['id'];
    $value = isset($_GET['value']) ? $_GET['value'] : 0;

    $mes = isset($_GET['mes']) ? $_GET['mes'] : '';

    
    if($mes === 'ano_completo'){
        $sql_mes = "UPDATE tb_cota_mes SET janeiro = ?, fevereiro = ?, marco = ?, abril = ?, maio = ?, junho = ?, julho = ?, agosto = ?, setembro = ?, outubro = ?, novembro = ?, dezembro = ? WHERE id_pagamento = ?";
        $stmt_mes = $link->prepare($sql_mes);
        $stmt_mes -> bind_param("iiiiiiiiiiiii", $value, $value, $value,$value, $value, $value, $value, $value, $value, $value, $value, $value, $id_cota);
    }
    else{
        $sql_mes = "UPDATE tb_cota_mes SET $mes = ? WHERE id_pagamento = ?";
        $stmt_mes = $link->prepare($sql_mes);
        $stmt_mes -> bind_param("ii", $value, $id_cota);
    }

    if($stmt_mes->execute()){
        if($mes === 'ano_completo'){
            $sql_ano = "UPDATE tb_cota_mes SET ano_completo = ? WHERE id_pagamento = ?";
            $stmt_ano = $link->prepare($sql_ano);
            $stmt_ano->bind_param("ii",$value, $id_cota);
            $stmt_ano->execute();
            $stmt_ano->close();
        }
        echo json_encode(["success" => true]);
        exit();
    }
    else{
        echo json_encode(["error" => "Erro na execução do SQL"]);
    }
    $stmt_mes->close();
}

$link->close();
?>