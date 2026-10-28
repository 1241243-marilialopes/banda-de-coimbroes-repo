<?php
require_once "../config.php";

if(!isset($_SESSION['log-in'])) {
    header('Location: .././index.php');
    exit();
  }

if($_SERVER["REQUEST_METHOD"]=="POST"){
    if(isset($_POST['nome']) ){
        $sql_instrumento = "INSERT INTO tb_instrumentos(nome_instrumento) VALUES (?)";
       
        if($stmt_instrumento = $link -> prepare($sql_instrumento)){
            $stmt_instrumento -> bind_param("s", $_POST['nome']);
            if($stmt_instrumento -> execute()){
                echo"       
                <script>
                    localStorage.setItem('sucesso1', 'sucesso1');
                    setTimeout(function() {
                        window.location.href = 'instrumentos.php';
                    }, 100);
                </script>";
        
                exit();
            }
            else{
                echo"       
                <script>
                    localStorage.setItem('erro', 'erro');
                    setTimeout(function() {
                        window.location.href = 'instrumentos.php';
                    }, 100);
                </script>";
            }
            $stmt_instrumento -> close();   
        }
        
    }
    $link -> close();
}
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Adicionar Instrumento</title>
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
                <div class="page-header mt-5">
                    <h2>Adicionar instrumentos</h2>
                </div>
                <p>Ficha de Registo de Instrumentos.</p>
                <form action="<?php echo $_SERVER["PHP_SELF"] ?>" method="post">
                    <div class="form-group">
                        <label>Nome do instrumento</label>
                        <input type="text" name="nome" class="form-control" required>
                    </div>
                   
                    <input type="submit" class="btn btn-outline-dark" value="Inserir">
                    <a href="instrumentos.php" class="btn btn-outline-dark">Cancelar</a>
                    <p></p>
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