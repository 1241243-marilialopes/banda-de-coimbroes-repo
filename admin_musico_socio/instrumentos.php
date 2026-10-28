<?php
include('../config.php');

if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

$sq="SELECT * FROM tb_instrumentos
    ORDER BY nome_instrumento";
	$results = $link->query($sq);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instrumentos</title>
    <link rel="icon" type="image/x-icon" href="../assets/banda.png" />
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
  </head>
<style>
  .container1{
    width: 95%;
    margin: auto;
    margin-top: 4%;
  }
  .imagem{
    border-radius: 50%;
    width: 70px;
    height: 70px;
    object-fit: cover;
  }
</style>
<body>
    
<?php include("navbar_admin.php")?>

<div class="container1">
<h2>Instrumentos
    <a class="btn btn-outline-secondary" href="./caderneta.php" style="float: right;" role="button"><i class="fas fa-backward"></i><a class="btn btn-outline-success" href="./adicionar_instrumentos.php" style="float: right; margin-right: 1%;" role="button"><i class="fas fa-plus"></i></a>
</h2><br>

    <br>
    <div class="form-group">
      <label for="numLinhas">Linhas a mostrar:</label>
      <select class="form-control" id="numLinhas" onchange="changeNumLinhas()">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
    </div>
    <div class="form-group">
      <input type="text" class="form-control" id="pesquisa" onkeyup="filtrarTabela()" placeholder="Pesquisar...">
    </div>
    <div class="table-responsive">
    <table class="table" id="tabela">
      <thead>
        <tr>
          <th>Instrumento</th>
          <th>Opções</th>
        </tr>
      </thead>
      <tbody>
      <?php
            if ($results->num_rows>0){
                while ($row = $results->fetch_assoc()){
                    echo "<tr>";
                    echo "<td style='vertical-align: middle;'>".$row['nome_instrumento']."</td>";

                    echo "<td style='vertical-align: middle;'>";
                    echo "<a href='atualizar_instrumentos.php?id=".$row['id_instrumento']."'class='btn btn-md btn-outline-warning'><i class='fas fa-pen'></i></a>";
                    echo "  ";
                    echo "<a href='#' class='btn btn-md btn-outline-danger' onclick='confirmarEliminacao(".$row['id_instrumento'].")'><i class='fas fa-trash'></i></a>";

                                            
                    echo "</td>";
                    echo "</tr>";
                }
                $results->free();
            }
            $link->close();
            ?>               
      </tbody>
    </table>
  </div>
  </div>
  </div>
  <script>

    var sucesso = localStorage.getItem('sucesso');
    if (sucesso) {
        iziToast.success({
            title: 'Sucesso',
            message: 'Instrumento atualizado com sucesso.',
            position: 'topRight',
            timeout: 5000 
        });
        localStorage.removeItem('sucesso');
    }

    var sucesso1 = localStorage.getItem('sucesso1');
    if (sucesso1) {
        iziToast.success({
            title: 'Sucesso',
            message: 'Instrumento adicionado com sucesso.',
            position: 'topRight',
            timeout: 5000 
        });
        localStorage.removeItem('sucesso1');
    }

    var sucesso2 = localStorage.getItem('sucesso2');
    if (sucesso2) {
        iziToast.success({
            title: 'Sucesso',
            message: 'Instrumento eliminado com sucesso.',
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
        message: 'Tem certeza que deseja eliminar este instrumento?',
        position: 'topCenter',
        buttons: [
          ['<button><b>Sim</b></button>', function (instance, toast) {
            window.location.href = 'eliminar_instrumentos.php?id=' + id;
            instance.hide({ transitionOut: 'fadeOut' }, toast);
          }, true],
          ['<button>Não</button>', function (instance, toast) {
            instance.hide({ transitionOut: 'fadeOut' }, toast);
          }]
        ]
      });
    }

    function changeNumLinhas() {
      var numLinhas = document.getElementById("numLinhas").value;
      var tabela = document.getElementById("tabela");
      var linhas = tabela.getElementsByTagName("tr");

      for (var i = 1; i < linhas.length; i++) {
        if (i <= numLinhas) {
          linhas[i].style.display = "";
        } else {
          linhas[i].style.display = "none";
        }
      }
    }

    function filtrarTabela(){
      var input, tabela, filtro, coluna, linhas, textoFiltro;
      input = document.getElementById("pesquisa");
      tabela = document.getElementById("tabela");
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


  </script>
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