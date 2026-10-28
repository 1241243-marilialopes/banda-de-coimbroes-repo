<?php
include('../config.php');

if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

$id=$_SESSION['id'];

$sq="SELECT * FROM tb_utilizadores 
INNER JOIN tb_instrumentos ON tb_utilizadores.instrumento=tb_instrumentos.id_instrumento
WHERE id_utilizador=$id";
$resultado=$link->query($sq);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Caderneta</title>
    <link rel="icon" type="image/x-icon" href="../assets/banda.png" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.17.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

    <link href="../vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link
        href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
        rel="stylesheet">
    <link href="../css/sb-admin-2.min.css" rel="stylesheet">
    <style>
      .container1{
        width: 95%;
        margin-top: 25px !important;
        margin: auto;
      }
      .imagem{
        transition: filter 0.3s ease;
      }
      .imagem:hover{
        filter: brightness(0.7);
      }
    </style>
</head>
<body>
<?php include("navbar_musicos.php")?>
<div class="container1">
  <div class="col">
    
<?php 
  if($resultado->num_rows>0){
    while($row=$resultado->fetch_assoc()){
        $instrumento1 = $row['instrumento'];
        echo('<h3 style="margin-top: 3%; margin-bottom: 3%;">Partitutas de '.$row['nome_instrumento'].'</h3> <br>');
    }
  }
  ?>
  <div class="form-group">
      <input type="text" class="form-control" id="pesquisa" onkeyup="filtrarCards()" placeholder="Pesquisar...">
    </div>
    <div class="row">
    <?php 
        $sql="SELECT * FROM tb_partituras
        INNER JOIN tb_instrumentos ON tb_partituras.instrumento=tb_instrumentos.id_instrumento 
        INNER JOIN tb_nome_partituras ON tb_partituras.nome=tb_nome_partituras.id_nome_partitura
        WHERE instrumento = '$instrumento1'";
        $result=$link->query($sql);
        if ($result->num_rows > 0) {
          while($row=$result->fetch_assoc()){
            $nome = $row["nome_partitura"];
            $imagem = $row["imagem_partitura"];
            echo("<div class='col-md-3'>");
            echo("<div class='card-body' style='align-items: center; text-align: center;'>");
            echo "<h4 class='card-title'>".$nome."</h4>";
            echo "<img src='data:image/jpeg;base64,".base64_encode($imagem)."' class='imagem img-fluid'>";
            echo "<br>";
            echo "<br>";
            echo("<a class='btn btn-outline-success mb-3 mr-1 ml-1' href='./download_partitura_musicos.php?id=".$row['id_partitura']."' target='_blank'><i class='fas fa-download'></i></a>");
            echo("</div>");
            echo("</div>");
          }
        } 
        else {
          echo "<p style='margin-left: 2%;'>Nenhuma partitura encontrada.</p>";
        }
    ?>
     </div>
     </div>
</div>

<script>
  function filtrarCards(){
    var input, filtro, cards, card, titulo, textValue;
    input = document.getElementById("pesquisa");
    filtro = input.value.toUpperCase();
    cards = document.getElementsByClassName("col-md-3");

    for( var i = 0; i < cards.length; i++ ){
      card = cards[i];
      titulo = card.getElementsByTagName("h4")[0];
      textValue = titulo.textContent || titulo.innerText;
      if( textValue.toUpperCase().indexOf(filtro) > -1 ){
        card.style.display = "";
      }
      else{
        card.style.display = "none";
      }
    }
  }

</script>
                            
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

<script src="../vendor/jquery/jquery.min.js"></script>
<script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="../vendor/jquery-easing/jquery.easing.min.js"></script>
<script src="../js/sb-admin-2.min.js"></script>
<script src="../vendor/chart.js/Chart.min.js"></script>
</body>
</html>