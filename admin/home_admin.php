<?php
include('../config.php');

if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Área Reservada</title>
    <link rel="icon" type="image/x-icon" href="../assets/banda.png" />
    <link rel="stylesheet" href="../css/style_admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.17.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link href="../vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link
        href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
        rel="stylesheet">
    <link href="../css/sb-admin-2.min.css" rel="stylesheet">
  </head>
<body>
<?php include("navbar_admin.php");

$id = $_SESSION['id'];
$sqlname = "SELECT nome_utilizador FROM tb_utilizadores WHERE id_utilizador = $id";
$result3 = $link->query($sqlname);
?>
<div class="container2">
  <h1 >
    <?php if ($result3->num_rows>0){
      while ($row = $result3->fetch_assoc()){
          echo "Olá, ".$row['nome_utilizador'];
      }
      $result3->free();
    }?></h1>
  <div class="nivers">
    <h4>Avisos de Aniversários</h4><br>
      <?php
      $sql1 = "SELECT nome_utilizador,data_nascimento,genero_id FROM tb_utilizadores";
      $result1 = $link->query($sql1);
      $c = 0;
      $data_amanha = (new DateTime())->add(new DateInterval("P1D"))->format('m-d');
                              
      if ($result1->num_rows>0){
        while ($row = $result1->fetch_assoc()){
          $mesDiaBancoDados = date("m-d", strtotime($row['data_nascimento']));
          if ($data_amanha === $mesDiaBancoDados){
            if( $row['genero_id'] == 0){
              echo "<div class='alert alert-warning' role='alert'>
              O ".$row['nome_utilizador']." faz anos amanhã";
              echo "</div>";
              $c ++;
            }
            else{
              echo "<div class='alert alert-warning' role='alert'>
              A ".$row['nome_utilizador']." faz anos amanhã";
              echo "</div>";
              $c ++;
            }
                                          
          }
          else if(date('m-d')==$mesDiaBancoDados){
            if( $row['genero_id'] == 0){
              echo "<div class='alert alert-success' role='alert'>
              O ".$row['nome_utilizador']." faz anos hoje";
              echo "</div>";
              $c ++;
            }
            else{
              echo "<div class='alert alert-success' role='alert'>
              A ".$row['nome_utilizador']." faz anos hoje";
              echo "</div>";
              $c ++;
            }
          }
        }
        $result1->free();
      }
      if( $c == 0){
        echo "<div class='alert alert-success' role='alert'>
        Ninguém faz anos hoje/amanhã";
        echo "</div>";
      }
      ?>        
  </div>      
  <br>
  <h4>Avisos de Serviços</h4><br>
<?php
  $contador_eventos = 0;
  $sq = "SELECT id_servico, data_inicial FROM tb_servicos";
  $results = $link->query($sq);
  if ($results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
      $data_inicial = strtotime($row['data_inicial']);
      $data_atual = strtotime(date("Y-m-d"));
      $dias = ($data_inicial - $data_atual) / (60 * 60 * 24); 
      if ($data_inicial >= $data_atual && $dias <= 14) {
        $contador_eventos++;
        //echo "Evento contado: ID Serviço - " . $row['id_servico'] . ", Data Inicial - " . $row['data_inicial'] . " dias: " . $dias . "<br>";
      }
    }
    if ($contador_eventos == 0) {
      echo "<div class='alert alert-success' role='alert'>
            Sem serviços próximos
           </div>";
    } else {
      if ($contador_eventos == 1) {
        echo "<div class='alert alert-warning' role='alert'>
                Existe 1 serviço próximo";
      } else {
        echo "<div class='alert alert-warning' role='alert'>
                    Existem $contador_eventos serviços próximos";
      }
      echo "<a href='./calendario_admin.php'><button class='btn btn-outline-success' style='float: right; margin: -0.5%;' ><i class='fas fa-eye'></i></button></a>";
      echo "</div>";
    }
    $results->free();
  }
?>

<br>
</div>


<script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

<script src="../vendor/jquery/jquery.min.js"></script>
<script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="../vendor/jquery-easing/jquery.easing.min.js"></script>
<script src="../js/sb-admin-2.min.js"></script>
<script src="../vendor/chart.js/Chart.min.js"></script>
</body>
</html>