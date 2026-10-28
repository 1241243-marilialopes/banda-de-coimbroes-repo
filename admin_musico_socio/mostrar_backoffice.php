<?php
include('../config.php');
if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

if(isset($_GET['op'])){
  $selected = $_GET['op'];

  if($selected == '6'){
    $sql1="SELECT * FROM tb_backoffice_imagens
    INNER JOIN tb_tipos_elementos on tb_backoffice_imagens.conteudo_tipo=tb_tipos_elementos.id_tipo";
    $result1=$link->query($sql1);
    
    if ($result1->num_rows > 0) {
      echo('<div class="form-group">
          <input type="text" class="form-control" id="pesquisa" onkeyup="filtrarTabela()" placeholder="Pesquisar...">
      </div>');
        echo("<table class='table' id='table'>");
        echo("<thead>");  
        echo("<tr>");
        echo("<th>Nome</th>");
        echo("<th>Imagem</th>");
        echo("</tr>");
        echo("</thead>");

        echo("<tbody>");

        while($row1 = $result1->fetch_assoc()){
          echo("<tr>");
          echo("<td>".$row1['designacao_imagem']."</td>");
          echo("<td>".$row1['nome_imagem']."<a style='float: right;' class='btn btn-outline-warning mb-3 mr-1 ml-1' href='atualizar_elemento.php?id=".$row1['id_imagem']."&op=".$selected."'><i class='fas fa-pen'></i></a></td>");
          echo("</tr>");
        }
        echo("</tbody>");
        echo("</table>");
    } 
    else {
      echo "<p style='margin-left: 1%;'>Ocorreu um erro.</p>";
    }
  }
  else{
    $sql="SELECT * FROM tb_backoffice
    INNER JOIN tb_tipos_elementos on tb_backoffice.elemento_tipo=tb_tipos_elementos.id_tipo
    WHERE elemento_tipo = ".$selected;
    $result=$link->query($sql);
    
    if ($result->num_rows > 0) {
      echo('<div class="form-group">
          <input type="text" class="form-control" id="pesquisa" onkeyup="filtrarTabela()" placeholder="Pesquisar...">
      </div>');
      echo("<table class='table' id='table'>");
      echo("<thead>");  
      echo("<tr>");
      echo("<th>Nome</th>");
      echo("<th>Conteúdo</th>");
      echo("</tr>");
      echo("</thead>");

      echo("<tbody>");

      while($row = $result->fetch_assoc()){
        echo("<tr>");
        echo("<td>".$row['designacao_conteudo']."</td>");
        echo("<td>".$row['conteudo']."<a style='float: right;' class='btn btn-outline-warning mb-3 mr-1 ml-1' href='atualizar_elemento.php?id=".$row['id_elemento']."&op=".$selected."'><i class='fas fa-pen'></i></a></td>");
        echo("</tr>");
      }
      echo("</tbody>");
      echo("</table>");
    } 
    else {
      echo "<p style='margin-left: 1%;'>Ocorreu um erro.</p>";
    }
  }
}
else{
  echo "erro";
}
?>