<?php

include './config.php';

$query_events = "SELECT id_servico, nome_servico, descricao_servico, color, data_inicial, data_final, localizacao FROM tb_servicos";
$resultado_events = $link->query($query_events);

$eventos = [];

while($row_events = $resultado_events->fetch_assoc()){
    $title = $row_events['nome_servico'].' - '.$row_events['localizacao'];
    $color = $row_events['color'];
    $start = $row_events['data_inicial'];
    $end = $row_events['data_final'];
  
    $eventos[] = [
        'title' => $title, 
        'color' => $color, 
        'start' => $start, 
        'end' => $end, 
        ];
}
echo json_encode($eventos);