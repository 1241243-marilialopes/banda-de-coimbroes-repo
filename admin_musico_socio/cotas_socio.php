<?php
include('../config.php');

if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}
$id_socio=$_SESSION['id'];
$nome_socio = $_SESSION['nome'];
$sq1="SELECT * FROM tb_utilizadores WHERE id_utilizador = '".$id_socio."'";

$results = $link->query($sq1);
if($results->num_rows>0){
  while($row = $results->fetch_assoc()){
    $id_socio = $row['id_utilizador'];
  }
}


$sql_anos="SELECT * FROM tb_ano";
$result = $link->query($sql_anos);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotas</title>
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
        margin-top: 4% !important;
        margin: auto;
      }
      .pago{
        color: green;
      }
      .nao-pago{
        color: red;
      }
    </style>
  </head>
<body>
<?php include("navbar_admin.php")?>

<div class="container1">
<h2>Cotas </h2>
    <br>
    <div class="table-responsive">
    <table class="table" id="tabela">
      <thead>
        <tr>
          <th>Ano</th>
          <th>janeiro</th>
          <th>fevereiro</th>
          <th>março</th>
          <th>abril</th>
          <th>maio</th>
          <th>junho</th>
          <th>julho</th>
          <th>agosto</th>
          <th>setembro</th>
          <th>outubro</th>
          <th>novembro</th>
          <th>dezembro</th>
          <th>Ano</th>
        </tr>
      </thead>
      <tbody>
      <?php
        if ($result->num_rows>0){
            while ($row = $result->fetch_assoc()){
                echo "<tr>";
                echo "<td>".$row['ano']."</td>";

                $sql2 = "SELECT * FROM tb_cota_mes WHERE socio_id = ".$id_socio." AND ano=".$row['id_ano'];
                $result2 = $link->query($sql2);
                if($result2->num_rows > 0){
                  while($row2 = $result2->fetch_assoc()){
                    echo "<td class='".($row2['janeiro'] == 1 ? "pago" : "nao-pago")."'>".($row2['janeiro'] == 1 ? "Pago" : "Não pago")."</td>";
                    echo "<td class='".($row2['fevereiro'] == 1 ? "pago" : "nao-pago")."'>".($row2['fevereiro'] == 1 ? "Pago" : "Não pago")."</td>";
                    echo "<td class='".($row2['marco'] == 1 ? "pago" : "nao-pago")."'>".($row2['marco'] == 1 ? "Pago" : "Não pago")."</td>";
                    echo "<td class='".($row2['abril'] == 1 ? "pago" : "nao-pago")."'>".($row2['abril'] == 1 ? "Pago" : "Não pago")."</td>";
                    echo "<td class='".($row2['maio'] == 1 ? "pago" : "nao-pago")."'>".($row2['maio'] == 1 ? "Pago" : "Não pago")."</td>";
                    echo "<td class='".($row2['junho'] == 1 ? "pago" : "nao-pago")."'>".($row2['junho'] == 1 ? "Pago" : "Não pago")."</td>";
                    echo "<td class='".($row2['julho'] == 1 ? "pago" : "nao-pago")."'>".($row2['julho'] == 1 ? "Pago" : "Não pago")."</td>";
                    echo "<td class='".($row2['agosto'] == 1 ? "pago" : "nao-pago")."'>".($row2['agosto'] == 1 ? "Pago" : "Não pago")."</td>";
                    echo "<td class='".($row2['setembro'] == 1 ? "pago" : "nao-pago")."'>".($row2['setembro'] == 1 ? "Pago" : "Não pago")."</td>";
                    echo "<td class='".($row2['outubro'] == 1 ? "pago" : "nao-pago")."'>".($row2['outubro'] == 1 ? "Pago" : "Não pago")."</td>";
                    echo "<td class='".($row2['novembro'] == 1 ? "pago" : "nao-pago")."'>".($row2['novembro'] == 1 ? "Pago" : "Não pago")."</td>";
                    echo "<td class='".($row2['dezembro'] == 1 ? "pago" : "nao-pago")."'>".($row2['dezembro'] == 1 ? "Pago" : "Não pago")."</td>";
                    echo "<td class='".($row2['ano_completo'] == 1 ? "pago" : "nao-pago")."'>".($row2['ano_completo'] == 1 ? "Pago" : "Não pago")."</td>";
                  }
                }
                else{
                  for($i = 0; $i < 12; $i++){
                    echo "<td class='nao-pago'>Não pago</td>";
                  }
                }
                echo "</tr>";
            }
            $result->free();
          }
        $link->close();
      ?>               
      </tbody>
    </table>
  </div>
</div>
</div>

</main>

</div>
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