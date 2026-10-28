<?php
include('../config.php');

if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

$sql = "SELECT * FROM tb_tipos_elementos";
$resultado=$link->query($sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BackOffice</title>
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

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.min.js"></script>
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
     <div class="row">
        <div class="col">
            <h2 class="centered-h3 mt-3">BackOffice</h2>
            <div>
              <h4 style="display: inline-block; font-size: 20px; padding-right: 1%; margin-top: 2%;">Selecione o sítio do elemento: </h4>
              <form id="form" name="servico" method="POST" action="./mostrar_backoffice.php" style="display: inline-block; width: 75%;">
                <select id="servicos" class="custom-select" onchange="select(this.value)">
                  <?php
                    if($resultado -> num_rows >=0){
                      echo "<option disabled selected >--</option>";
                      while ($row=$resultado->fetch_assoc()){
                        echo "<option value=".$row['id_tipo'].">".$row['tipo_elemento']."</option>";
                      }
                    }
                    else{
                      echo "Essa opção não é selecionável.";
                    }
                  ?>
                </select>
              </form>
            </div>
          <br><br>
        </div>
      </div>

      <div id="result"></div> 

    <script>

        var sucesso = localStorage.getItem('sucesso');
        if (sucesso) {
            iziToast.success({
                title: 'Sucesso',
                message: 'Elemento atualizado com sucesso.',
                position: 'topRight',
                timeout: 5000 
            });
            localStorage.removeItem('sucesso');
        }

        var erro = localStorage.getItem('erro');
        if (erro) {
            iziToast.error({
                title: 'Erro',
                message: 'Ocorreu um erro.',
                position: 'topRight',
                timeout: 5000 
            });
            localStorage.removeItem('erro');
        }
        function filtrarTabela(){
        var input, tabela, filtro, coluna, linhas, textoFiltro;
        input = document.getElementById("pesquisa");
        tabela = document.getElementById("table");
        filtro = input.value.toUpperCase();
        linhas = tabela.getElementsByTagName("tr");

        for( var i = 0; i < linhas.length; i++ ){
            coluna = linhas[i].getElementsByTagName("td")[0];
            if(coluna){
            textoFiltro = coluna.textContent || coluna.innerText;
            if( textoFiltro.toUpperCase().indexOf(filtro) > -1 ){
                linhas[i].style.display = "";
            }
            else{
                linhas[i].style.display = "none";
            }
            }
        }
        }

        function select(str) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
            document.getElementById("result").innerHTML = this.responseText;
            }
        };
        xmlhttp.open('GET',"mostrar_backoffice.php?op=" + str,true);
        xmlhttp.send();
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