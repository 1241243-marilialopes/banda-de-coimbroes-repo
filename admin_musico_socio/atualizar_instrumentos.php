<?php
    require_once "../config.php";

    if(!isset($_SESSION['log-in'])) {
      header('Location: ../index.php');
      exit();
    }

    $id_instrumento=$_GET["id"];
    if (isset($id_instrumento) ){
        $sql= "SELECT * FROM tb_instrumentos
        WHERE id_instrumento= ?";
        if ($stmt = $link->prepare($sql)){
            $stmt->bind_param("i", $_GET["id"]);
            if ($stmt->execute()){
                $result = $stmt->get_result();
                if ($result->num_rows==1){
                    $row=$result->fetch_array(MYSQLI_ASSOC);
                    $instrumento=$row["nome_instrumento"];
                }
                else{
                    echo "Ocorreu um erro! Por favor tente novamente1.";
                    exit();
                }
            }
            else{
                echo "Ocorreu um erro! Por favor tente novamente2.";
                exit();
            }
        }
        $stmt->close();
        
    }
    else{
        echo "Ocorreu um erro! Por favor tente novamente3.";
    
        exit();
    }
    $link->close();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar</title>
    <link rel="icon" type="image/x-icon" href="../assets/banda.png" />
    <link rel="stylesheet" href="../css/style_admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.17.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="../js/datatables-simple-demo.js"></script>
    <link href="../vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link
        href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
        rel="stylesheet">
    <link href="../css/sb-admin-2.min.css" rel="stylesheet">
  </head>
  <style>
    .container-fluid{
        margin-top: 15%;
    }
  </style>
<body>

<?php include("navbar_admin.php")?>

<div class="container-fluid pt-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card mb-4">
          <div class="card-body w-100">
            <form action="editarinstrumentos.php" method="POST" enctype="multipart/form-data">
            <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Nome do instrumento</p>
                </div>
                <div class="col-sm-9">
                  <input class="form-control w-100" name="instrumento" value="<?php echo $instrumento; ?>">
                </div>
            </div>
                <input type="hidden" value="<?php echo($id_instrumento)?>" name="id_instrumento">
                <?php 
              echo "<input type='submit' href='editarinstrumentos.php?id=".$row['id_instrumento']."'class='btn btn-secondary btabela mt-5 position-relative bottom-0 start-50 translate-middle w-100' value='Salvar'>";
              echo "<a href='instrumentos.php' class='btn btn-secondary btabela mt-2 position-relative bottom-0 start-50 translate-middle w-100'>Cancelar</a>"
              ?>
            </form>
          </div>
        </div>
      </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
<script src="../js/datatables-simple-demo.js"></script>

<script src="../vendor/jquery/jquery.min.js"></script>
<script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="../vendor/jquery-easing/jquery.easing.min.js"></script>
<script src="../js/sb-admin-2.min.js"></script>
<script src="../vendor/chart.js/Chart.min.js"></script>
</body>
</html>