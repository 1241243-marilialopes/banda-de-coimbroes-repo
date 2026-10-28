<?php
include('../config.php');
if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

if(isset($_GET['op'])){
  $selected = $_GET['op'];
  
  $sql="SELECT * FROM tb_cota_mes
  INNER JOIN tb_utilizadores on tb_cota_mes.socio_id=tb_utilizadores.id_utilizador
  INNER JOIN tb_ano on tb_cota_mes.ano=tb_ano.id_ano
  WHERE (cargo_id = 0 OR cargo_id = 1 OR cargo_id = 2 OR cargo_id = 3) AND id_ano = ".$selected."
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
      echo("<th>janeiro</th>");
      echo("<th>fevereiro</th>");
      echo("<th>março</th>");
      echo("<th>abril</th>");
      echo("<th>maio</th>");
      echo("<th>junho</th>");
      echo("<th>julho</th>");
      echo("<th>agosto</th>");
      echo("<th>setembro</th>");
      echo("<th>outubro</th>");
      echo("<th>novembro</th>");
      echo("<th>dezembro</th>");
      echo("<th>Ano</th>");
      echo("</tr>");
      echo("</thead>");

      echo("<tbody>");

      while($row = $result->fetch_assoc()){
        echo("<tr>");
        echo("<td>".$row['nome_utilizador']."</td>");
        echo("<td class='center-align'><input type='checkbox' onclick='cota(".$row['id_pagamento'].", \"janeiro\", this)' id='chk".$row['id_pagamento']."' ".($row['janeiro'] == 1 ? "checked" : "")." class='form-check-input custom-checkbox chk".$row['id_pagamento']."'></td>");
        echo("<td class='center-align'><input type='checkbox' onclick='cota(".$row['id_pagamento'].", \"fevereiro\", this)' id='chk".$row['id_pagamento']."' ".($row['fevereiro'] == 1 ? "checked" : "")." class='form-check-input custom-checkbox chk".$row['id_pagamento']."'></td>");
        echo("<td class='center-align'><input type='checkbox' onclick='cota(".$row['id_pagamento'].", \"marco\", this)' id='chk".$row['id_pagamento']."' ".($row['marco'] == 1 ? "checked" : "")." class='form-check-input custom-checkbox chk".$row['id_pagamento']."'></td>");
        echo("<td class='center-align'><input type='checkbox' onclick='cota(".$row['id_pagamento'].", \"abril\", this)' id='chk".$row['id_pagamento']."' ".($row['abril'] == 1 ? "checked" : "")." class='form-check-input custom-checkbox chk".$row['id_pagamento']."'></td>");
        echo("<td class='center-align'><input type='checkbox' onclick='cota(".$row['id_pagamento'].", \"maio\", this)' id='chk".$row['id_pagamento']."' ".($row['maio'] == 1 ? "checked" : "")." class='form-check-input custom-checkbox chk".$row['id_pagamento']."'></td>");
        echo("<td class='center-align'><input type='checkbox' onclick='cota(".$row['id_pagamento'].", \"junho\", this)' id='chk".$row['id_pagamento']."' ".($row['junho'] == 1 ? "checked" : "")." class='form-check-input custom-checkbox chk".$row['id_pagamento']."'></td>");
        echo("<td class='center-align'><input type='checkbox' onclick='cota(".$row['id_pagamento'].", \"julho\", this)' id='chk".$row['id_pagamento']."' ".($row['julho'] == 1 ? "checked" : "")." class='form-check-input custom-checkbox chk".$row['id_pagamento']."'></td>");
        echo("<td class='center-align'><input type='checkbox' onclick='cota(".$row['id_pagamento'].", \"agosto\", this)' id='chk".$row['id_pagamento']."' ".($row['agosto'] == 1 ? "checked" : "")." class='form-check-input custom-checkbox chk".$row['id_pagamento']."'></td>");
        echo("<td class='center-align'><input type='checkbox' onclick='cota(".$row['id_pagamento'].", \"setembro\", this)' id='chk".$row['id_pagamento']."' ".($row['setembro'] == 1 ? "checked" : "")." class='form-check-input custom-checkbox chk".$row['id_pagamento']."'></td>");
        echo("<td class='center-align'><input type='checkbox' onclick='cota(".$row['id_pagamento'].", \"outubro\", this)' id='chk".$row['id_pagamento']."' ".($row['outubro'] == 1 ? "checked" : "")." class='form-check-input custom-checkbox chk".$row['id_pagamento']."'></td>");
        echo("<td class='center-align'><input type='checkbox' onclick='cota(".$row['id_pagamento'].", \"novembro\", this)' id='chk".$row['id_pagamento']."' ".($row['novembro'] == 1 ? "checked" : "")." class='form-check-input custom-checkbox chk".$row['id_pagamento']."'></td>");
        echo("<td class='center-align'><input type='checkbox' onclick='cota(".$row['id_pagamento'].", \"dezembro\", this)' id='chk".$row['id_pagamento']."' ".($row['dezembro'] == 1 ? "checked" : "")." class='form-check-input custom-checkbox chk".$row['id_pagamento']."'></td>");
        echo("<td class='center-align'><input type='checkbox' onclick='cota(".$row['id_pagamento'].", \"ano_completo\", this)' id='ano_completo_".$row['id_pagamento']."' ".($row['ano_completo'] == 1 ? "checked" : "")." class='form-check-input custom-checkbox chk".$row['id_pagamento']."'></td>");
        echo("</tr>");
      }
      echo("</tbody>");
      echo("</table>");
  } 
  else {
    echo "<p style='margin-left: 1%;'>Ainda não há cotas pagas/por pagar.</p>";
  }
}
else{
  echo "erro";
}
?>