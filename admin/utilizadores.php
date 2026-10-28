<?php
include('../config.php');

if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

$id = $_SESSION['id'];

$sq="SELECT * FROM tb_utilizadores 
  INNER JOIN tb_genero ON tb_utilizadores.genero_id=tb_genero.id_genero 
  INNER JOIN tb_cargo ON tb_utilizadores.cargo_id=tb_cargo.id_cargo
  INNER JOIN tb_instrumentos ON tb_utilizadores.instrumento=tb_instrumentos.id_instrumento
  WHERE id_utilizador != $id
  ORDER BY nome_utilizador";
	$results = $link->query($sq);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Direção</title>
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
    width: 100%; 
    height: 100%; 
    max-width: 100px;
    max-height: 100px;
    object-fit: cover;
  }
</style>
<body>
    
<?php include("navbar_admin.php")?>
<div class="container1">
<h2>Utilizadores <a style='float:right' href='adicionar_utilizadores.php'class='btn btn-md btn-outline-success btabela'><i class="fas fa-plus"></i></a></h2>

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
          <th>Foto</th>
          <th>Nome</th>
          <th>Telemóvel</th>
          <th>Nº Cartão Cidadão</th>
          <th>Nº Identificação Fiscal</th>
          <th>Data de nascimento</th>
          <th>Email</th>
          <th>Instrumento</th>
          <th>Género</th>
          <th>Cargo</th>
          <th>Opções</th>
        </tr>
      </thead>
      <tbody>
      <?php
            if ($results->num_rows>0){
                while ($row = $results->fetch_assoc()){
                    $foto = $row["foto_perfil"];
                    echo "<tr>";
                    echo "<td style='vertical-align: middle;'><img src='data:image/jpeg;base64,".base64_encode($foto)."' class='imagem img-fluid'></td>";
                    echo "<td style='vertical-align: middle;'>".$row['nome_utilizador']."</td>";
                    echo "<td style='vertical-align: middle;'>".$row['telemovel']."</td>";
                    echo "<td style='vertical-align: middle;'>".$row['numero_cc']."</td>";
                    echo "<td style='vertical-align: middle;'>".$row['nif']."</td>";
                    echo "<td style='vertical-align: middle;'>".$row['data_nascimento']."</td>";
                    echo "<td style='vertical-align: middle;'>".$row['email']."</td>";
                    echo "<td style='vertical-align: middle;'>".$row['nome_instrumento']."</td>";
                    echo "<td style='vertical-align: middle;'>".$row['genero']."</td>";
                    echo "<td style='vertical-align: middle;'>".$row['nome_cargo']."</td>";

                    echo "<td style='vertical-align: middle;'>";
                    echo "<a href='atualizar_utilizadores.php?id=".$row['id_utilizador']."'class='btn btn-md btn-outline-warning'><i class='fas fa-pen'></i></a>";
                    echo "  ";
                    echo "<a href='#' class='btn btn-md btn-outline-danger' onclick='confirmarEliminacao(".$row['id_utilizador'].")'><i class='fas fa-trash'></i></a>";
                                            
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
            message: 'Utilizador atualizado com sucesso.',
            position: 'topRight',
            timeout: 5000 
        });
        localStorage.removeItem('sucesso');
    }

    var sucesso1 = localStorage.getItem('sucesso1');
    if (sucesso1) {
        iziToast.success({
            title: 'Sucesso',
            message: 'Utilizador registado com sucesso.',
            position: 'topRight',
            timeout: 5000 
        });
        localStorage.removeItem('sucesso1');
    }

    var sucesso2 = localStorage.getItem('sucesso2');
    if (sucesso2) {
        iziToast.success({
            title: 'Sucesso',
            message: 'Utilizador eliminado com sucesso.',
            position: 'topRight',
            timeout: 5000 
        });
        localStorage.removeItem('sucesso2');
    }

    var sucesso3 = localStorage.getItem('sucesso3');
    if (sucesso3) {
        iziToast.success({
            title: 'Sucesso',
            message: 'Sócio registado com sucesso.',
            position: 'topRight',
            timeout: 5000 
        });
        localStorage.removeItem('sucesso3');
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
        message: 'Tem certeza que deseja eliminar este utilizador?',
        position: 'topCenter',
        buttons: [
          ['<button><b>Sim</b></button>', function (instance, toast) {
            window.location.href = 'eliminar_utilizadores.php?id=' + id;
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
        coluna = linhas[i].getElementsByTagName("td")[1];
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