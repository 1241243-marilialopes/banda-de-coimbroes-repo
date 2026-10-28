<?php
include('../config.php');
if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

if(isset($_GET['op'])){
  $selected = $_GET['op'];

  $sql="SELECT * FROM tb_partituras WHERE nome = ".$selected;
  $result=$link->query($sql);
  
  if ($result->num_rows > 0) {
    echo("<div class='container2'>");
    echo("<div class='row'>");
    echo("<div class='col-md-12'>");
    echo('<div class="form-group">
      <input type="text" class="form-control" id="pesquisa" onkeyup="filtrarCards()" placeholder="Pesquisar...">
    </div>');
    echo("</div>");
    echo("</div>");
    echo("<div class='row'>");
    while($row=$result->fetch_assoc()){
      
      $sql_instrumentos="SELECT * FROM tb_instrumentos WHERE id_instrumento =".$row['instrumento'];
      $resultado=$link->query($sql_instrumentos);
      if($resultado->num_rows>0){
        while($row_instrumento=$resultado->fetch_assoc()){
          $nome = $row_instrumento["nome_instrumento"];
          $imagem = $row["imagem_partitura"];
          echo("<div class='col-md-4'>");
          echo("<div class='card-body' style='align-items: center; text-align: center;'>");
          echo "<h4 class='card-title'>".$nome."</h4>";
          echo "<img src='data:image/jpeg;base64,".base64_encode($imagem)."' class='imagem img-fluid'>";
          echo "<br>";
          echo "<br>";
          echo("<a class='btn btn-outline-warning mb-3 mr-1 ml-1' href='atualizar_partituras.php?id=".$row['id_partitura']."&op=".$selected."'><i class='fas fa-pen'></i></a>");
          echo" ";
          echo" ";
          echo "<a href='#' class='btn btn-outline-danger mb-3 mr-1 ml-1' onclick='confirmarEliminacao(".$row['id_partitura'].")'><i class='fas fa-trash'></i></a>";
          echo" ";
          echo" ";
          echo("<a class='btn btn-outline-success mb-3 mr-1 ml-1' href='./download_partitura_admin.php?id=".$row['id_partitura']."' target='_blank'><i class='fas fa-download'></i></a>");
          echo("</div>");
          echo("</div>");
        }
      }
    }
    echo("</div>");
    echo("</div>");
  } 
  else {
    echo "<p style='margin-left: 1%; margin-top: 3%;'>Nenhuma partitura encontrada.</p>";
  }
}
else{
  echo "erro";
}