<?php
include('../config.php');
if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

$id_presenca = $_GET['id'];

$sql_marcar ="SELECT * FROM tb_presencas
            INNER JOIN tb_servicos ON tb_servicos.id_servico=tb_presencas.servico_id
            WHERE id_presenca = ? AND confirmado = 'Não confirmada'";
$stmt_marcar = $link->prepare($sql_marcar);
$stmt_marcar->bind_param("i",$id_presenca);
$stmt_marcar->execute();
$result_marcar = $stmt_marcar->get_result();

if($result_marcar->num_rows>0){
    if($row = $result_marcar->fetch_assoc()){

        $data_atual = time();
        $data_final = strtotime($row['data_final']);
        if($data_final > $data_atual){
            $sql1 = "UPDATE tb_presencas SET confirmado = 'Confirmada', cor_botao_confirma_musico = 'success', cor_musico_confirmado = 'green' WHERE id_presenca = ?";
            $stmt1 = $link -> prepare($sql1);
            $stmt1->bind_param("i",$id_presenca);
            $marcar = 1;
        
            if($stmt1->execute()){
                echo json_encode($marcar);
                exit();
            http_response_code(200); //deu certo
            }
            else{
            http_response_code(500); //deu errado
            }
            $stmt1->close();
        }
        else{
            $response = array(
                'error' => false,
                'message' => '1'
            );
            echo json_encode($response);
            exit();
        }
        
    }
    
}
else{

    $sql_marcada ="SELECT * FROM tb_presencas
                INNER JOIN tb_servicos ON tb_servicos.id_servico=tb_presencas.servico_id
                WHERE id_presenca = ? AND confirmado = 'Confirmada'";
    $stmt_marcada = $link -> prepare($sql_marcada);
    $stmt_marcada->bind_param("i",$id_presenca);
    $stmt_marcada->execute();
    $result_marcada = $stmt_marcada->get_result();

    if($result_marcada->num_rows>0){
        if($row = $result_marcada->fetch_assoc()){

            $data_atual = time();
            $data_final = strtotime($row['data_final']);
            if($data_final > $data_atual){
                $sql2 = "UPDATE tb_presencas SET confirmado = 'Não confirmada', cor_botao_confirma_musico = 'warning', cor_musico_confirmado = 'red' WHERE id_presenca = ?";
                $stmt2 = $link -> prepare($sql2);
                $stmt2->bind_param("i",$id_presenca);
                $marcar = 0;

                if($stmt2->execute()){
                    echo json_encode($marcar);
                    exit(); 
                    http_response_code(200); //deu certo
                }
                else{
                    http_response_code(500); //deu errado
                }
                $stmt2->close();
            }
            else{
                $response = array(
                    'error' => false,
                    'message' => '2'
                );
                echo json_encode($response);
                exit();
            }
        }
    }
}
$stmt_marcar->close();
$stmt_marcada->close();
$link->close();
?>