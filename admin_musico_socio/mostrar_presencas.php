<?php

include('../config.php');
if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}


if(isset($_GET['op'])){
  $selected = $_GET['op'];

  $sql="SELECT * FROM tb_presencas 
  INNER JOIN tb_utilizadores on tb_presencas.musico_id=tb_utilizadores.id_utilizador
  INNER JOIN tb_servicos on tb_presencas.servico_id = tb_servicos.id_servico
  WHERE servico_id = ".$selected. "
  ORDER BY nome_utilizador";
  $result=$link->query($sql);
  
  if ($result->num_rows > 0) {
     echo('<div class="form-group">
     <input type="text" class="form-control" id="pesquisa" onkeyup="filtrarTabela()" placeholder="Pesquisar...">
   </div>');
      echo("<table class='table' id='table'>");
      echo("<thead>");  
      echo("<tr>");
      echo("<th>Nome</th>");
      echo("<th>Confirmação</th>");
      echo("<th>Pago</th>");
      echo("</tr>");
      echo("</thead>");

      echo("<tbody>");

      while($row = $result->fetch_assoc()){
        echo("<tr>");
        echo("<td>".$row['nome_utilizador']."</td>");
        echo("<td style='color: ".$row['cor_musico_confirmado'].";'>".$row['confirmado']."</td>");
        echo("<td><button type='button' id='btnpagar".$row['id_presenca']."' class='btn btn-".$row['cor_botao_pagar']."' onclick='pagamento(".$row['id_presenca'].")'>".$row['texto_pagar']."</button></td>");
        echo("</tr>");
      }
      echo("</tbody>");
      echo("</table>");
  } 
  else {
    echo "<p style='margin-left: 1%;'>Ainda não há presenças.</p>";
  }
}
else{
  echo "erro";
}
?>