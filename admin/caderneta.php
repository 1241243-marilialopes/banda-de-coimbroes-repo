<?php
include('../config.php');

if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

$sql="SELECT * FROM tb_nome_partituras";
$result=$link->query($sql);
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
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.min.js"></script>
    <style>
      .container1{
        width: 95%;
        margin-top: 3% !important;
        margin: auto;
      }
      .container2{
        width: 95%;
        margin-top: 0% !important;
        margin: auto;
      }
      .imagem{
        transition: filter 0.3s ease;
      }
      .imagem:hover{
        filter: brightness(0.7);
      }
      .imagem{
        width: 100%;
        max-height: 300px;
        object-fit: cover;
      }
    </style>
</head>
<body>
<?php include("navbar_admin.php")?>
<div class="container1">
     <div class="row">
        <div class="col">
            <h2 class="centered-h3 mt-3">Caderneta
              <a class="btn btn-outline-success" href="./adicionar_partituras.php" style="float: right;" role="button"><i class="fas fa-plus"></i><a class="btn btn-outline-info" href="./instrumentos.php" style="float: right; margin-right: 1%;" role="button"><i class="fas fa-drum"></i><a class="btn btn-outline-secondary" href="./partituras" style="float: right; margin-right: 1%;" role="button"><i class="fas fa-scroll"></i></a></a><br></a>
            </h2><br>  
              
            <div>
              <h4 style="display: inline-block; font-size: 20px; padding-right: 1%;">Selecione a partitura: </h4>
              <form id="form" name="instrumento" method="POST" action="./mostrar_caderneta.php" style="display: inline-block; width: 75%;">
                <select id="instrumento" class="custom-select" onchange="select(this.value)">
                  <?php
                    if($result -> num_rows >=0){
                      echo "<option disabled selected >--</option>";
                      while ($row=$result->fetch_assoc()){
                        echo "<option value=".$row['id_nome_partitura'].">".$row['nome_partitura']."</option>";
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
      <div class="row">
        <div class="col-md-12">
            <div>
                <div class="row" id="result">
                    <?php
                    if(isset($_GET['op'])){
                        $selected = $_GET['op'];
                        include("mostrar_caderneta.php");
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>
      <script>

    var sucesso = localStorage.getItem('sucesso');
    if (sucesso) {
        iziToast.success({
            title: 'Sucesso',
            message: 'Partitura atualizada com sucesso.',
            position: 'topRight',
            timeout: 5000 
        });
        localStorage.removeItem('sucesso');
    }

    var sucesso1 = localStorage.getItem('sucesso1');
    if (sucesso1) {
        iziToast.success({
            title: 'Sucesso',
            message: 'Partitura adicionada com sucesso.',
            position: 'topRight',
            timeout: 5000 
        });
        localStorage.removeItem('sucesso1');
    }

    var sucesso2 = localStorage.getItem('sucesso2');
    if (sucesso2) {
        iziToast.success({
            title: 'Sucesso',
            message: 'Partitura eliminada com sucesso.',
            position: 'topRight',
            timeout: 5000 
        });
        localStorage.removeItem('sucesso2');
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

    function confirmarEliminacao(id) {

      iziToast.question({
        timeout: false,
        close: false,
        overlay: true,
        displayMode: 'once',
        id: 'question',
        zindex: 999,
        title: 'Eliminar',
        message: 'Tem certeza que deseja eliminar esta partitura?',
        position: 'topCenter',
        buttons: [
          ['<button><b>Sim</b></button>', function (instance, toast) {
            window.location.href = 'eliminar_partituras.php?id=' + id;
            instance.hide({ transitionOut: 'fadeOut' }, toast);
          }, true],
          ['<button>Não</button>', function (instance, toast) {
            instance.hide({ transitionOut: 'fadeOut' }, toast);
          }]
        ]
      });
    }

    function filtrarCards(){
      var input, filtro, cards, card, titulo, textValue;
      input = document.getElementById("pesquisa");
      filtro = input.value.toUpperCase();
      cards = document.getElementsByClassName("col-md-4");

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
    function select(str) {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
          document.getElementById("result").innerHTML = this.responseText;
        }
      };
      xmlhttp.open('GET',"mostrar_caderneta.php?op=" + str,true);
      xmlhttp.send();
    }
      </script>
</div>
         
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

<script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="../vendor/jquery-easing/jquery.easing.min.js"></script>
<script src="../js/sb-admin-2.min.js"></script>
<script src="../vendor/chart.js/Chart.min.js"></script>
</body>
</html>