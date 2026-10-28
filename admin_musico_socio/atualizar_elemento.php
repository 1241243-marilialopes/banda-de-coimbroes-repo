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
    <title>Editar</title>
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
    <script src="https://cdn.ckeditor.com/ckeditor5/34.0.0/classic/ckeditor.js"></script>

    <style>
      .container1{
        width: 95%;
        margin-top: 3% !important;
        margin: auto;
        padding: 0 !important;
      }
    </style>
  </head>
<body>
<?php include("navbar_admin.php");?>
<div class="container1">
    <h2 class="centered-h3 mt-3">Editar Conteúdo</h2><br><br>
<?php 
if(isset($_GET['id'])){
    $selected = $_GET['id'];
    $op = $_GET['op'];
    if($op == '6'){
        $sql1="SELECT * FROM tb_backoffice_imagens
        INNER JOIN tb_tipos_elementos on tb_backoffice_imagens.conteudo_tipo=tb_tipos_elementos.id_tipo
        WHERE id_imagem = ".$selected;
        $result1=$link->query($sql1);

        if($result1->num_rows>0){
            echo '<form action="editar_elemento.php" method="post" enctype="multipart/form-data">';
            while($row1=$result1->fetch_assoc()){
                echo '<div class="form-group">';
                echo '<h4 for="conteudo" style="display: inline-block; font-size: 20px; padding-right: 1%; margin-bottom: 2%;">Conteúdo</h4>';

                echo "<p>";
                echo '<input type="file" class="form-control-file" id="imagem" name="imagem" required>';
                echo '<input type="hidden" name="imagem_atual" value="'.$row1['nome_imagem'].'">';
                

                echo '<input type="hidden" name="elemento_id" value="'.$row1['id_imagem'].'">';
                echo '<input type="hidden" name="tipo_elemento" value="'.$row1['conteudo_tipo'].'">';
                echo '</div>';

            }
            echo '<button style="margin-top: 1%;" type="submit" class="btn btn-secondary">Salvar</button>';
            echo "<a href='backoffice.php' style='margin-left: 1%; margin-top: 1%;' class='btn btn-secondary'>Cancelar</a>";
            echo '<br>';
            echo '</form>';
        }
        else{
            echo "Erro";
        }
    }
    else{
        $sql ="SELECT * FROM tb_backoffice
        INNER JOIN tb_tipos_elementos on tb_backoffice.elemento_tipo=tb_tipos_elementos.id_tipo
        WHERE id_elemento = ".$selected;
        $result=$link->query($sql);
    
        if($result->num_rows>0){
            echo '<form action="editar_elemento.php" method="post" enctype="multipart/form-data">';
            while($row=$result->fetch_assoc()){
                echo '<div class="form-group">
                    <h4 for="conteudo" style="display: inline-block; font-size: 20px; padding-right: 1%; margin-bottom: 2%;">Conteúdo</h4>
                    <textarea id="conteudo" name="conteudo" style="height: 600px;" required>' . $row['conteudo'] . '</textarea>
                    <input type="hidden" name="elemento_id" value="' . $row['id_elemento'] . '">
                    <input type="hidden" name="tipo_elemento" value="' . $row['elemento_tipo'] . '">
                </div>';

    
            }
            echo '<br>';
            echo '<button type="submit" class="btn btn-secondary">Salvar</button>';
            echo "<a href='backoffice.php' style='margin-left: 1%' class='btn btn-secondary'>Cancelar</a>";
            echo "<p>";
            echo '</form>';
        }
        else{
            echo "Erro";
        }
    }
}
else{
    echo "Erro 2";
}
?>
</div>

<script>
    ClassicEditor
        .create(document.querySelector('#conteudo'))
        .catch(error => {
            console.error(error);
        });
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