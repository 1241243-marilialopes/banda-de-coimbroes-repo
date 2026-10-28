<?php

include('../config.php');

if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

$sq="SELECT * FROM tb_instrumentos";
$resultado=$link->query($sq);

$sql="SELECT * FROM tb_nome_partituras";
$resultado_partituras=$link->query($sql);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $nome = $_POST["nome"];
    $pdf = file_get_contents($_FILES["pdf"]["tmp_name"]);
    $nome_ficheiro = $_FILES["pdf"]["name"];
    $instrumento = $_POST["instrumento"];

    //print_r($_FILES);
    if(!empty($_FILES['imagem']['tmp_name']) && $_FILES["imagem"]["error"] == 0){
        $imagem = file_get_contents($_FILES["imagem"]["tmp_name"]);
        $nome_imagem = $_FILES["imagem"]["name"];
    }
    else{
        $nome_imagem = "partitura.jpg";
        $imagem = file_get_contents('../assets/img/partitura.jpg');
    }

    $query = "INSERT INTO tb_partituras(nome, nome_ficheiro, nome_imagem, imagem_partitura, ficheiro_partitura, instrumento) VALUES (?,?,?,?,?,?)";
    $stmt = $link->prepare($query);
    $stmt->bind_param("isssss", $nome,  $nome_ficheiro, $nome_imagem, $imagem, $pdf, $instrumento);
    $stmt->execute();

    $stmt->close();

    echo"
    <script>
        localStorage.setItem('sucesso1', 'sucesso1');
        setTimeout(function() {
            window.location.href = 'caderneta.php';
        }, 100);
    </script>";
    exit();
    
}
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Adicionar Partituras</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
    integrity="sha384- Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="icon" type="image/x-icon" href="../assets/banda.png" />
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

<?php include("navbar_admin.php")?>

<p></p>
<div class="wrapper">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="page-header">
                    <h2>Adicionar partituras</h2>
                </div>
                <form action=<?php echo $_SERVER["PHP_SELF"] ?> method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label>Nome da partitura</label>
                        <select class="form-control" name="nome">
                        <?php
                            if($resultado_partituras -> num_rows >=0){
                                while ($row_partitura=$resultado_partituras->fetch_assoc()){
                                echo "<option value=".$row_partitura['id_nome_partitura'].">".$row_partitura['nome_partitura']."</option>";
                                }
                            }
                        ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Instrumento</label>
                        <select class="form-control" name="instrumento">
                        <?php
                            if($resultado -> num_rows >=0){
                                while ($row_instrumento=$resultado->fetch_assoc()){
                                echo "<option value=".$row_instrumento['id_instrumento'].">".$row_instrumento['nome_instrumento']."</option>";
                                }
                            }
                        ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Imagem da partitura</label><br>
                        <input type="file" name="imagem" id="imagem" accept=".jpg, .png">
                    </div>
                    <div class="form-group">
                        <label>Ficheiro</label><br>
                        <input type="file" name="pdf" id="pdf" accept=".pdf" required>
                    </div>
                    <input type="submit" class="btn btn-outline-dark" value="Inserir">
                    <a href="caderneta.php" class="btn btn-outline-dark">Cancelar</a>
                </form>
            </div>  
        </div>
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